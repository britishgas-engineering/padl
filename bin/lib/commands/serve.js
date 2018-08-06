import * as util from '../util';

const {
  buildFiles,
  serveFiles,
  CONSTANTS
} = util;

const { rollupConfig, rollupServeConfig } = CONSTANTS;

export default (args) => {
  const port = args.port || 9001

  buildFiles(rollupConfig, true).then(() => {
    serveFiles(rollupServeConfig, port);
  }).catch((e) => {
    shell.echo(`Error: ${e}`);
  });
}
