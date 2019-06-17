import shell from 'shelljs';

import * as util from '../util';

const {
  buildFiles,
  buildStorybook,
  CONSTANTS
} = util;

const { rollupConfig,story2sketch } = CONSTANTS;

export default (args) => {
  buildFiles(rollupConfig, true).then(() => {
    buildStorybook('.storybook').then(() => {
      shell.exec(`"${story2sketch}" --input dist/demo/iframe.html --output stories.asketch.json`, (code, stdout, stderr) => {
        if (stderr) {
          console.log('err: ', stderr);
        }
      });
    })
  });
}
