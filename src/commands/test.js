import glob from 'glob';
import fs from 'fs-extra';
import path from 'path';
import build from './build';
import {runCommand, getRightPathLocation} from '../util';

const createTestFixtures = (files, suiteFiles) => {
  let fixtures = '';

  files.forEach((file) => {
    const data = fs.readFileSync(file).toString();
    fixtures += data;
  });

  return '(function () {document.write(`' + fixtures + '`); const files = [' + suiteFiles + ']; WCT.loadSuites(files); })();';
};

const wct = getRightPathLocation(path.join('.bin', 'wct'));

export default async (config) => {
  let options = {
    ...config,
    from: 'test'
  };

  await build(options);

  const testHTMLFiles = glob.sync('test/**/*_test.html');
  const suiteFiles = glob.sync('test/**/*_test.js').map(file => `'${file.replace('test/', '')}'`);
  const fixtureContent = createTestFixtures(testHTMLFiles, suiteFiles);
  const configFile = options.headless ? `--config-file wct.headless.config.json` : '';

  fs.outputFileSync('dist/test-fixtures.js', fixtureContent);
  console.log('Running tests...');

  const testCmd = await runCommand(`${wct} --npm ${configFile} ${options.persistent ? '-p' : ''}`).catch((e) => {
    console.log(e);
    process.exit(1);
  });

  console.log(testCmd);

  process.exit(0);

  return;
}
