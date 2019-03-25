import shell from 'shelljs';
import path from 'path';
import chokidar from 'chokidar';
import fs from 'fs';

shell.config.silent = true;

const rollupBin = 'node_modules/.bin/rollup';
const concurrentlyBin = 'node_modules/.bin/concurrently';
const lessBin = 'node_modules/.bin/lessc';

const cliPath = path.join(path.dirname(__filename), '../..');
const rollupPath = path.join(cliPath, rollupBin);
const concurrentlyPath = path.join(cliPath, concurrentlyBin);
const lessPath = path.join(cliPath, lessBin);

const concurrently = fs.existsSync(concurrentlyPath) ? concurrentlyPath : concurrentlyBin;
const rollup = fs.existsSync(rollupPath) ? rollupPath : rollupBin;
const less = fs.existsSync(lessPath) ? lessPath : lessBin;

const story2sketch = path.join(cliPath, 'node_modules/.bin/story2sketch');
const rollupConfig = path.join(cliPath, 'rollup.config.js');
const rollupServeConfig = path.join(cliPath, 'rollup.test.config.js');
const rollupModuleConfig = path.join(cliPath, 'rollup.module.config.js');
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
  rollupModuleConfig,
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

const createModule = (options) => {
  if (
    !(options &&
    options.environments &&
    options.environments.BUILD &&
    options.environments.BUILD === 'serve')
  ) {
    const webcomponent = path.join('node_modules', '@webcomponents', 'webcomponentsjs');
    const runtime = path.join(cliPath, 'node_modules', 'regenerator-runtime');
    const templatePath = path.join(cliPath, 'templates', 'module');
    const name = JSON.parse(fs.readFileSync(`package.json`, 'utf8')).name.replace(/ /g, '-');
    const location = `dist/${name}.js`;

    shell.cp(path.join(templatePath, 'index.js'), location);
    shell.cp('-R', path.join(webcomponent, 'bundles'), `./dist/bundles`);

    const file = shell.ls(location);
    const component = fs.readFileSync(`dist/only.components.min.js`, 'utf8');
    const es5 = fs.readFileSync(`${webcomponent}/custom-elements-es5-adapter.js`, 'utf8');
    const loader = fs.readFileSync(`${webcomponent}/webcomponents-loader.js`, 'utf8');

    shell.sed('-i', /_INSERT_ES5_ADAPTER_/g, es5, file);
    shell.sed('-i', /_INSERT_WEBCOMPONENT_LOADER_/g, loader, file);
    shell.sed('-i', /_INSERT_COMPONENT_JS_/g, component, file);
    shell.sed('-i', /_INSERT_NAME_/g, `${name}.?m?i?n?.js`, file);

    if (options && options.globalStyle  && options.globalStyle.inline) {
      let inlineContent = '';
      try {
        inlineContent = fs.readFileSync(options.globalStyle.output).toString().replace(/"/g, "'").replace(/\\/g, '\\\\');
      }
      catch (e) {
        console.log(`${e}`);
      }

      const content = `
      const style = document.createElement('style');
      const ref = document.querySelector('script');
      style.innerHTML = "${inlineContent}";
      ref.parentNode.insertBefore(style, ref);
      `;

      shell.sed('-i', /_INLINE_STYLES_/g, content, file);
    }

    shell.exec(`${rollup} -c ${rollupModuleConfig} --no-strict`);

  }
};

const createStyles = (isSilent, options) => {
  if (options && options.globalStyle) {
    const cssInput = options.globalStyle.input;
    const cssOutput = options.globalStyle.output;

    return new Promise((resolve) => {
      const output = (code, stdout, stderr) => {
        if (!isSilent) {
          const message = code === 0 ? 'Creating styles...' : `Something went wrong: ${stderr}`;
          shell.echo(message);
        }
        return resolve();
      };

      shell.exec(`${less} ${cssInput} ${cssOutput} --autoprefix='last 2 versions' --clean-css='--level=2 --advanced --compatibility=ie11'`, output);
    });
  }
};

const watchStyles = (options) => {
  if (options && options.globalStyle && options.globalStyle.watch) {
    const watcher = chokidar.watch(options.globalStyle.watch, {
      persistent: true
    });

    watcher.on('change', () => {
      createStyles(true, options);
    });
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
  };

  return new Promise((resolve) => {
    const output = (code, stdout, stderr) => {
      copyFiles(isSilent);
      createModule(options);
      if (!isSilent) {
        const message = code === 0 ? '🎉 Files have now been built' : `Something went wrong: ${stderr}`;
        shell.echo(message);
      }
      return resolve();
    };

    shell.echo('Cleaning cache...');
    shell.rm('-rf', 'dist');
    shell.echo('Building files...');
    createStyles(isSilent, options);
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
  watchStyles(options);
  const commandExec = shell.exec(`${commands} --color always`, {async:true});

  commandExec.stderr.on('data', (data) => {
    const regex = /\d+(\%|\s\bpercent\b)/g;
    const hasPercent = data.match(regex);
    const message = data.replace(/[^0-9a-zA-Z ]/g, '');

    if (message && message.trim().length > 0 && !hasPercent) {
      shell.echo(data.trim());
    }
  });

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
