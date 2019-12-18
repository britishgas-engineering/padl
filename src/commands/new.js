import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import packageJson from '../../package.json';

const cliPath = path.join(path.dirname(__filename), '..', '..');

const editFile = (file, name) => {
  const isFile = fs.lstatSync(file).isFile();

  if (isFile) {
    const fileData = fs.readFileSync(file, 'utf8');

    const result = fileData
      .replace(/REPO_NAME/g, name)
      .replace(/REPO_TYPE/g, 'lit')
      .replace(/REPO_VERSION/g, packageJson.version);

    fs.writeFileSync(file, result, 'utf8');
  }
};

const removeStyles = (config, name) => {
  if (!config.styles) {
    const fileData = fs.readFileSync(`${name}/.padl`, 'utf8');

    const obj = JSON.parse(fileData);
    obj['no-styles'] = true;

    fs.writeFileSync(`${name}/.padl`, JSON.stringify(obj, null, 2), 'utf8');
  }
};

export default async (config, name) => {
  let options = {
    ...config
  };

  if (!name) {
    console.log('Please state the library name.');
    process.exit(1);
    return;
  }

  if (fs.existsSync(name)) {
    console.log(`The folder ${name} already exists.`);
    process.exit(1);
    return;
  }

  const repoDir = path.join(cliPath, 'templates', 'repo');

  fs.copySync(repoDir, name);

  const files = glob.sync(`${name}/**`, {dot: true});

  files.forEach(file => editFile(file, name));

  removeStyles(config, name);

  console.log(`Library '${name}' has been created.`);

  process.exit(0);
  return;
}
