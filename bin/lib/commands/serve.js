import * as util from '../util';

const {
  buildFiles,
  serveFiles,
  CONSTANTS
} = util;

const { rollupServeConfig } = CONSTANTS;

export default (args) => {
  const port = args.port || 9001

  buildFiles(rollupServeConfig, true).then(() => {
    serveFiles(rollupServeConfig, port);
  }).catch((e) => {
    shell.echo(`Error: ${e}`);
  });
}
