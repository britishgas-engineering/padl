import shell from 'shelljs';
import path from 'path';

shell.config.silent = true;

const cliPath = path.join(path.dirname(__filename), '../..');
const concurrently = path.join(cliPath, 'node_modules/.bin/concurrently');
const rollup = path.join(cliPath, 'node_modules/.bin/rollup');
const story2sketch = path.join(cliPath, 'node_modules/.bin/story2sketch');
const rollupConfig = path.join(cliPath, 'rollup.config.js');
const rollupServeConfig = path.join(cliPath, 'rollup.test.config.js');
const storybookStart = 'node_modules/.bin/start-storybook';
const storybookBuild = 'node_modules/.bin/build-storybook';
const wct = 'node_modules/.bin/wct';

const CONSTANTS = {
  cliPath,
  concurrently,
  rollup,
  story2sketch,
  rollupConfig,
  rollupServeConfig,
  storybookStart,
  storybookBuild,
  wct
};

const types = {
  test: 'test',
  new: 'newRepo',
  build: 'build',
  sketch: 'sketch',
  serve: 'serve',
  delete: 'd',
  d: 'd',
  generate: 'generate',
  g: 'generate',
};

const messageEnd = (message, exit) => {
  shell.echo(message)
  shell.exit(exit);
};

const errorMessage = (message) => {
  messageEnd(message, 1)
};

const successMessage = (message) => {
  messageEnd(message, 0);
};

const missingArg = (type, message) => {
  if (!type) {
      errorMessage(message);
  }
};

const buildFiles = (config, isSilent) => {
  return new Promise((resolve) => {
    shell.echo('Cleaning cache...');
    shell.rm('-rf', 'dist');
    shell.echo('Building files...');
    shell.exec(`${rollup} -c ${config} --silent`, (code, stdout, stderr) => {
      if (!isSilent) {
        const message = code === 0 ? '🎉 Files have now been built' : `Something went wrong: ${stderr}`;
        console.log(message);
      }
      return resolve();
    });
  });
};

const buildStorybook = (config) => {
  return new Promise((resolve) => {
    shell.echo('Building storybook...');
    shell.exec(`${storybookBuild} -c ${config} -o dist/demo`, (code, stdout, stderr) => {
      if (stderr) {
        console.log('err: ', stderr);
      }
      return resolve();
    });
  });
};

const serveFiles = (config, port, options) => {
  let commands = `${concurrently} -p -n -r --kill-others "${storybookStart} -p ${port} -c .storybook -s ./dist" "${rollup} --environment ${options.environments} -c ${config} -w"`;

  if (options.commands) {
    commands += ` "${options.commands}"`;
  };

  shell.echo('Serving app...');
  shell.exec(commands, (code, stdout, stderr) => {
    if (stderr) {
      console.log('err: ', stderr);
    }
  });
  shell.echo(`http://localhost:${port}`);
};

export {
  errorMessage,
  successMessage,
  missingArg,
  buildFiles,
  serveFiles,
  buildStorybook,
  types,
  CONSTANTS
};
