import * as util from '../util';
import fs from 'fs';

const {
  buildFiles,
  serveFiles,
  errorMessage,
  CONSTANTS
} = util;

let { rollupConfig, rollupServeConfig } = CONSTANTS;

export default (args) => {
  const port = args.port || 9001;
  let options = {};
  let config;
  options.environments = 'BUILD:serve';

  try {
    config = JSON.parse(fs.readFileSync('.padl').toString());
  }
  catch (e) {
    errorMessage('Missing config, is this the right folder?');
  }

  if (config && config.watch) {
    if (config.watch.watchGlob) {
      options.environments += `,WATCH_DIR:${config.watch.watchGlob}`;
    }

    if (config.watch.commands) {
      options.commands = config.watch.commands
    }
  }

  buildFiles(rollupConfig, true).then(() => {
    serveFiles(rollupServeConfig, port, options);
  }).catch((e) => {
    shell.echo(`Error: ${e}`);
  });
}
