import shell from 'shelljs';
import path from 'path';
import glob from 'glob';
import write from 'write';
import fs from 'fs';
import colors from 'colors';

import * as util from '../util';

const {
  missingArg,
  successMessage,
  errorMessage,
  buildFiles,
  CONSTANTS
} = util;

const { cliPath, wct, rollupConfig } = CONSTANTS;

const headlessCheck = () => {
  try {
    JSON.parse(fs.readFileSync('wct.headless.config.json').toString());
  }
  catch (e) {
    errorMessage(`${colors.red("Missing wct.headless.config.json")}\n\nFind out more here: https://github.com/britishgas-engineering/padl#headless \n`);
  }
}

const createTestFixtures = (files, suiteFiles) => {
  let fixtures = '';

  files.forEach((file) => {
    const data = fs.readFileSync(file).toString();
    fixtures += data;
  });

  return '(function () {document.write(`' + fixtures + '`); const files = [' + suiteFiles + ']; WCT.loadSuites(files); })();';
};

export default (args) => {
  const isHeadless = args.headless || args.h;
  const isPersistent = args.persistent || args.p;

  if (isHeadless) {
    headlessCheck();
  }

  buildFiles(rollupConfig).then(() => {
    const testHTMLFiles = glob.sync('test/**/*_test.html');
    const suiteFiles = glob.sync('test/**/*_test.js').map(file => `'${file.replace('test/', '')}'`);
    const fixtureContent = createTestFixtures(testHTMLFiles, suiteFiles);



    write.sync('dist/test-fixtures.js', fixtureContent);
    shell.echo('Running tests...');
    shell.exec(`${wct} --npm ${isHeadless ? `--config-file wct.headless.config.json` : ''} ${isPersistent ? '-p' : ''}`, (code, stdout, stderr) => {
        console.log(code === 0 ? stdout : stdout + stderr);
        if (code === 1) {
          process.exit(1);
        }
      });
  }).catch((e) => {
    shell.echo(`error: ${e}`);
  });
}
