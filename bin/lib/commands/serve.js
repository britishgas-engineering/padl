import * as util from '../util';

const {
  buildFiles,
  serveFiles,
  CONSTANTS
} = util;

const { rollupServeConfig } = CONSTANTS;

export default (args) => {
  buildFiles(rollupServeConfig, true).then(() => {
    serveFiles(rollupServeConfig);
  }).catch((e) => {
    shell.echo(`Error: ${e}`);
  });
}
