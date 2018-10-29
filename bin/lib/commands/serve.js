import * as util from '../util';
import fs from 'fs';

const {
  buildFiles,
  serveFiles,
  errorMessage,
  CONSTANTS
} = util;

const { rollupConfig, rollupServeConfig } = CONSTANTS;

export default (args) => {
  const port = args.port || 9001;
  let options = {};
  options.environment = {};
  options.environments.BUILD = 'serve';

  if (args.config && args.config.watch) {
    if (args.config.watch.watchGlob) {
      const watchGlob = args.config.watch.watchGlob.join();
      options.environments.WATCH_DIR = watchGlob;
    }

    if (args.config.watch.commands) {
      const watchCommands = args.config.watch.commands;
      options.commands = watchCommands;
    }
  }

  if (args.config && args.config.static) {
    options.static = args.config.static;
  };

  buildFiles(rollupConfig, true, options).then(() => {
    serveFiles(rollupServeConfig, port, options);
  }).catch((e) => {
    shell.echo(`Error: ${e}`);
  });
}
