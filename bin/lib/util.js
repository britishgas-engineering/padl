import shell from 'shelljs';
import path from 'path';
import fs from 'fs';

shell.config.silent = true;

const rollupBin = 'node_modules/.bin/rollup';
const concurrentlyBin = 'node_modules/.bin/concurrently';

const cliPath = path.join(path.dirname(__filename), '../..');
const rollupPath = path.join(cliPath, rollupBin);
const concurrentlyPath = path.join(cliPath, concurrentlyBin);

const concurrently = fs.existsSync(concurrentlyPath) ? concurrentlyPath : concurrentlyBin;
const rollup = fs.existsSync(rollupPath) ? rollupPath : rollupBin;

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

const buildFiles = (config, isSilent, options) => {

  const copyFiles = () => {
    if (options && options.static) {
      shell.echo('Copying files...');
      options.static.forEach((dir) => {
        shell.cp('-R', dir, `./dist/${dir.split(/[/]+/).pop()}`);
      });
    };
  }

  return new Promise((resolve) => {
    const output = (code, stdout, stderr) => {
      copyFiles();
      if (!isSilent) {
        const message = code === 0 ? '🎉 Files have now been built' : `Something went wrong: ${stderr}`;
        shell.echo(message);
      }
      return resolve();
    };

    shell.echo('Cleaning cache...');
    shell.rm('-rf', 'dist');
    shell.echo('Building files...');
    shell.exec(`${rollup} -c ${config}`, output);
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

const serveFiles = (config, port, options = {}) => {
  const storybook = `${storybookStart} -p ${port} -c .storybook -s ./dist`;
  const rollupEnv = options.environments ? Object.keys(options.environments).map(env => `${env}:${options.environments[env]}`).join() : '';

  let commands = `${concurrently} -p -n -r --kill-others "${storybook}" "${rollup}${rollupEnv ? ` --environment ${rollupEnv}` : ''} -c ${config} -w"`;

  if (options && options.commands) {
    options.commands.forEach((command) => {
      commands += ` "${command}"`;
    });
  };

  shell.echo('Serving app...');
  const commandExec = shell.exec(`${commands} --color always`, {async:true});

  commandExec.stderr.on('data', (data) => {
    const regex = /\d+(\%|\s\bpercent\b)/g;
    const hasPercent = data.match(regex);
    const message = data.replace(/[^0-9a-zA-Z ]/g, '');

    if (message && message.trim().length > 0 && !hasPercent) {
      shell.echo(data.trim());
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
