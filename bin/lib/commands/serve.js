import * as util from '../util';

const {
  buildFiles,
  serveFiles,
  CONSTANTS
} = util;

let { rollupConfig, rollupServeConfig } = CONSTANTS;

export default (args) => {
  const port = args.port || 9001;
  let options = {};
  options.environments = 'BUILD:serve';

  if (args.watch) {
    options.environments += `,WATCH_DIR:${args.watch}`;
  }

  if (args.watch_commands) {
    options.commands = args.watch_commands;
  }

  buildFiles(rollupConfig, true).then(() => {
    serveFiles(rollupServeConfig, port, options);
  }).catch((e) => {
    shell.echo(`Error: ${e}`);
  });
}
