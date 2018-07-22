import shell from 'shelljs';
import path from 'path';
import glob from 'glob';

import * as util from '../util';

const {
  missingArg,
  successMessage,
  errorMessage,
  buildFiles,
  CONSTANTS
} = util;

const { cliPath, wct, rollupConfig } = CONSTANTS;

export default (args) => {
  buildFiles(rollupConfig).then(() => {
    glob('test/**/*_test*', (err, arr) => {

      if (err) {
        errorMessage(`Error: ${err}`);
      }
      arr = arr.map(file => `'${file}'`);
      shell.echo('Running tests...');
      shell.sed('-i', /const files =.+/, `const files = [${arr}];`, `test/index.html`)
        .exec(`${wct} --npm`, (code, stdout, stderr) => {
          console.log(code === 0 ? stdout : stderr);
        });
    });
  }).catch((e) => {
    shell.echo(`error: ${e}`);
  });
}
