#! /usr/bin/env node
const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const parseArgs = require('minimist')
const args = parseArgs(process.argv.slice(2));
const command = args._[0];

shell.config.silent = true;

let config;

const cliPath = path.join(path.dirname(__filename), '..');
const con = path.join(cliPath, 'node_modules/.bin/concurrently');
const roll = path.join(cliPath, 'node_modules/.bin/rollup');
const story2sketch = path.join(cliPath, 'node_modules/.bin/story2sketch');
const rollConfig = path.join(cliPath, 'rollup.config.js');
const rollTestConfig = path.join(cliPath, 'rollup.test.config.js');
const story = 'node_modules/.bin/start-storybook';
const buildStory = 'node_modules/.bin/build-storybook';
const wct = 'node_modules/.bin/wct';

const errorMessage = (message) => {
  shell.echo(message)
  shell.exit(1);
};

const successMessage = (message) => {
  shell.echo(message)
  shell.exit(0);
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
    shell.exec(`${roll} -c ${config} --silent`, (code, stdout, stderr) => {
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
    shell.exec(`${buildStory} -c ${config} -o dist/demo`, (code, stdout, stderr) => {
      if (stderr) {
        console.log('err: ', stderr);
      }
      return resolve();
    });
  });
};

const serveFiles = (config) => {
  shell.echo('Serving app...');
  shell.exec(`${con} -p -n -r --kill-others "${story} -p 9001 -c .storybook --quiet" "${roll} -c ${config} -w"`, (code, stdout, stderr) => {
    if (stderr) {
      console.log('err: ', stderr);
    }
  });
  shell.echo('http://localhost:9001');
};

missingArg(command, 'Please tell me what you want me todo!');

if (command === 'test') {
  buildFiles(rollConfig).then(() => {
    glob('test/**/*_test*', (err, arr) => {

      if (err) {
        errorMessage(`Error: ${err}`);
      }
      arr = arr.map(file => `'${file}'`);
      shell.echo('Running tests...');
      shell.sed('-i', /const files =.+/, `const files = [${arr}];`, `test/index.html`)
        .exec(`${wct} --npm`, (code, stdout, stderr) => {
          console.log(code === 0 ? stdout : stderr);
        });
    });
  }).catch((e) => {
    shell.echo(`error: ${e}`);
  });
};

if (command === 'new') {

  missingArg(args._[1], `Please state the library name after '${command}'.`);
  let type;
  const name = args._[1].replace(/[^\w\-]/gi, '');

  if (args['type'] === 'polymer' || args['type'] === 'lit' || !args['type']) {
    type = args['type'] || 'polymer';
  } else {
    errorMessage(`Type can only be 'polymer' or 'lit'`);
  }

  const templatePath = path.join(cliPath, 'templates', 'repo');

  if (shell.find(name) == '') {
    shell.mkdir('-p', [`${name}`, `${name}/src`, `${name}/test`, `${name}/.storybook`])
    shell.cp('-Rf', `${templatePath}/*`, `${name}/`);
    shell.cp('-Rf', `${templatePath}/.*`, `${name}/`);

    const files = [
      ...shell.ls(`${name}/package.json`),
      ...shell.ls(`${name}/README.md`),
      ...shell.ls(`${name}/.pattern`)
    ];

    files.forEach((file) => {
      shell.sed('-i', /REPO_NAME/g, name, file);
      shell.sed('-i', /REPO_TYPE/g, type, file);

      if (type === 'lit') {
        shell.sed('-i', /@polymer\/polymer.+/, `@polymer/lit-element": "^0.5.2",`, file);
      }
    });

    successMessage(`${name} library has been created. \nRun 'cd ${name} && npm install' to setup ${name}`);
  } else {
    errorMessage(`${name} folder already exists`);
  }
}

if (command === 'build') {
  buildFiles(rollConfig);
}

if (command === 'sketch') {
  buildFiles(rollConfig, true).then(() => {
    buildStorybook('.storybook').then(() => {
      shell.exec(`${story2sketch} --input dist/demo/iframe.html --output stories.asketch.json`, (code, stdout, stderr) => {
        if (stderr) {
          console.log('err: ', stderr);
        }
      });
    })
  });
}

if (command === 'serve') {
  buildFiles(rollTestConfig, true).then(() => {
    serveFiles(rollTestConfig);
  }).catch((e) => {
    shell.echo(`Error: ${e}`);
  });
}

if (command === 'delete' || command === 'd') {
  missingArg(args._[1], `Please state the component name after '${command}'.`);

  const name = args._[1].replace(/[^\w\-]/gi, '');
  if (shell.find([`src/${name}`, `test/${name}`]) == '') {
    errorMessage(`Cannot find component '${name}'`);
  }

  try {
    shell.rm('-rf', `src/${name}`, `test/${name}`);
    successMessage(`Deleted component '${name}'.`);
  }
  catch (e) {
    errorMessage(`Could not delete: ${e}`);
  }
}

if (command === 'generate' || command === 'g') {
  let type;

  try {
    config = JSON.parse(fs.readFileSync('.pattern').toString());
  }
  catch (e) {
    errorMessage('Missing config, is this the right folder?');
  }

  if (!config || !config.type) {
    errorMessage('Missing config settings, please add `type` of polymer you are using `polymer` or `lit`.');
  }

  if (config.type === 'polymer' || config.type === 'lit') {
    type = config.type;
  } else {
    errorMessage('.pattern type is not right, please use `polymer` or `lit`.');
  }

  missingArg(args._[1], `Please state the component name after '${command}'.`);

  const templatePath = path.join(cliPath, 'templates', type);
  const standardPath = path.join(cliPath, 'templates', 'standard');
  const name = args._[1];
  const componentName = name.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
    return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '').replace(/-/g, '');

  if (!name.includes('-')) {
    errorMessage('Component name requires a dash (-).');
  };

  shell.ls(`src/${name}/component.js`).forEach((file) => {
    errorMessage(`'${name}' component already exists.`);
  });

  shell.mkdir('-p', [`src/${name}`, `test/${name}`])

  shell.cp(path.join(templatePath, 'component.js'), `src/${name}/component.js`);
  shell.cp(path.join(standardPath, 'story.js'), `src/${name}/story.js`);
  shell.cp(path.join(standardPath, 'styles.less'), `src/${name}/styles.less`);
  shell.cp(path.join(standardPath, 'test.html'), `test/${name}/${name}_test.html`);
  shell.cp(path.join(standardPath, 'test.js'), `test/${name}/${name}_test.js`);

  const files = [
    ...shell.ls(`src/${name}/component.js`),
    ...shell.ls(`test/${name}/${name}_test.html`),
    ...shell.ls(`test/${name}/${name}_test.js`),
    ...shell.ls(`src/${name}/story.js`)
  ];

  files.forEach((file) => {
    shell.sed('-i', /COMPONENT_NAME/g, componentName, file);
    shell.sed('-i', /DASH_NAME/g, name, file);
  });

  successMessage(`Generated component '${name}'.`);
}
