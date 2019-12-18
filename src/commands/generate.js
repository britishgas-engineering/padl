import glob from 'glob';
import fs from 'fs-extra';
import path from 'path';

const cliPath = path.join(path.dirname(__filename), '..', '..');

const editFile = (file, name, componentName) => {
  const isFile = fs.lstatSync(file).isFile();

  if (isFile) {
    const fileData = fs.readFileSync(file, 'utf8');

    const result = fileData
      .replace(/COMPONENT_NAME/g, componentName)
      .replace(/DASH_NAME/g, name);

    fs.writeFileSync(file, result, 'utf8');
  }
};

export default (config, name) => {
  let options = {
    ...config,
    type: 'lit'
  };

  const componentName = name && name.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
    return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '').replace(/-/g, '');

  if (!name) {
    console.log('Missing name for component.');
    process.exit(1);
    return;
  }

  if (!name.includes('-')) {
    console.log('Component name requires a dash (-).');
    process.exit(1);
    return;

  };

  if (fs.existsSync(`src/${name}`)) {
    console.log(`The component ${name} already exists.`);
    process.exit(1);
    return;

  };
  const type = options['no-styles'] ? `${options.type}-no-styles` : options.type;
  const repoDir = path.join(cliPath, 'templates', 'standard', 'component');
  const testDir = path.join(cliPath, 'templates', 'standard', 'test');
  const compDir = path.join(cliPath, 'templates', type);

  const filterCopy = (src) => {
    if (options['no-styles'] && src.includes('styles.less')) {
      return false;
    }

    return true;
  }

  fs.copySync(repoDir, `src/${name}`, {filter: filterCopy});
  fs.copySync(compDir, `src/${name}`);
  fs.copySync(path.join(testDir, 'test.html'), `test/${name}/${name}_test.html`);
  fs.copySync(path.join(testDir, 'test.js'), `test/${name}/${name}_test.js`);

  const files = glob.sync(`src/${name}/**`, {dot: true});
  const testFiles = glob.sync(`test/${name}/**`, {dot: true});

  files.forEach(file => editFile(file, name, componentName));
  testFiles.forEach(file => editFile(file, name, componentName));

  console.log(`Generated component '${name}'.`);

  process.exit(0);
  return;

}
