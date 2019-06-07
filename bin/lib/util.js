import shell from 'shelljs';
import path from 'path';
import chokidar from 'chokidar';
import fs from 'fs';
import findModules from 'find-node-modules';

shell.config.silent = true;

const getRightPathLocation = (path) => {
  return findModules().map((nodePath) => {
    const totalPath = `${nodePath}/${path}`;

    if(fs.existsSync(totalPath)) {
      return totalPath;
    }
  }).filter(nodePath => nodePath)[0];
};

const libraryPath = process.cwd();
const rollupPath = getRightPathLocation('.bin/rollup');
const concurrentlyPath = getRightPathLocation('.bin/concurrently');
const lessPath = getRightPathLocation('.bin/lessc');

const cliPath = path.join(path.dirname(__filename), '../..');

const concurrently = concurrentlyPath ? concurrentlyPath : `concurrently` ;
const rollup = rollupPath ? rollupPath : `rollup`;
const less = lessPath ? lessPath : `lessc`;

const story2sketch = getRightPathLocation('.bin/story2sketch');
const rollupConfig = path.join(cliPath, 'build', 'rollup', 'rollup.config.js');
const rollupServeConfig = path.join(cliPath, 'build', 'rollup', 'rollup.test.config.js');
const rollupModuleConfig = path.join(cliPath, 'build', 'rollup', 'rollup.module.config.js');
const storybookStart = getRightPathLocation('.bin/start-storybook');
const storybookBuild = getRightPathLocation('.bin/build-storybook');
const wct = getRightPathLocation('.bin/wct');

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

const checkExistsWithTimeout = (filePath, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
        if (watcher) {
          watcher.close();
        }

        console.log('Cannot find component files');
    }, timeout);

    fs.access(filePath, fs.constants.R_OK, (err) => {
      if (!err) {
        clearTimeout(timer);
        if (watcher) {
          watcher.close();
        }
        resolve();
      }
    });

    const dir = path.dirname(filePath);
    const basename = path.basename(filePath);
    const watcher = fs.watch(dir, (eventType, filename) => {
      if (eventType === 'rename' && filename === basename) {
        clearTimeout(timer);

        if (watcher) {
          watcher.close();
        }

        resolve();
      }
    });
  });
}

const createModule = (options) => {
  if (
    !(options &&
    options.environments &&
    options.environments.BUILD &&
    options.environments.BUILD === 'serve')
  ) {
    const webcomponent = path.join('@webcomponents', 'webcomponentsjs');
    const templatePath = path.join(cliPath, 'templates', 'module');
    const name = JSON.parse(fs.readFileSync(`${libraryPath}/package.json`, 'utf8')).name.replace(/ /g, '-');
    const location = `${libraryPath}/dist/${name}.js`;

    shell.cp(path.join(templatePath, 'index.js'), location);
    shell.cp('-R', getRightPathLocation(`${webcomponent}/bundles`), `${libraryPath}/dist/bundles`);

    checkExistsWithTimeout(`${libraryPath}/dist/only.components.min.js`).then(() => {
      const es5Path = getRightPathLocation(`${webcomponent}/custom-elements-es5-adapter.js`);
      const loaderPath = getRightPathLocation(`${webcomponent}/webcomponents-loader.js`);
      const file = shell.ls(location);
      const component = fs.readFileSync(`${libraryPath}/dist/only.components.min.js`, 'utf8');
      const es5 = fs.readFileSync(es5Path, 'utf8');
      const loader = fs.readFileSync(loaderPath, 'utf8');

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
    });
  }
};

const createStyles = (isSilent, options) => {
  if (options && options.globalStyle) {
    const cssInput = options.globalStyle.input;
    const cssOutput = options.globalStyle.output;

    return checkExistsWithTimeout(cssInput).then(() => {
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
  getRightPathLocation,
  CONSTANTS
};
