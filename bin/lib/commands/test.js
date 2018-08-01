import shell from 'shelljs';
import path from 'path';
import glob from 'glob';
import write from 'write';
import fs from 'fs';

import * as util from '../util';

const {
  missingArg,
  successMessage,
  errorMessage,
  buildFiles,
  CONSTANTS
} = util;

const { cliPath, wct, rollupConfig } = CONSTANTS;

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

  buildFiles(rollupConfig).then(() => {
    const testHTMLFiles = glob.sync('test/**/*_test.html');
    const suiteFiles = glob.sync('test/**/*_test.js').map(file => `'${file.replace('test/', '')}'`);
    const fixtureContent = createTestFixtures(testHTMLFiles, suiteFiles);

    write.sync('dist/text-fixtures.js', fixtureContent);
    shell.echo('Running tests...');
    shell.exec(`${wct} --npm ${isHeadless ? `--config-file wct.headless.config.json` : ''} ${isPersistent ? '-p' : ''}`, (code, stdout, stderr) => {
        console.log(code === 0 ? stdout : stdout + stderr);
      });
  }).catch((e) => {
    shell.echo(`error: ${e}`);
  });
}
