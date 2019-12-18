const fs = require('fs');
const path = require('path');
const child = require('child_process');
const diff = require('variable-diff');

const exec = child.exec;

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stdout + stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

const cleanUp = async (name) => {
  await runCommand(`rm -rf ${name}`);
};

const checkExists = async (dir, message) => {
  if (!fs.existsSync(`./${dir}`)) {
    console.log(message);
    process.exit(1);
  };

  return;
};

const checkDiff = async (expectedPath, actualPath, name) => {
  await checkExists(actualPath, `${name} directory missing`);

  const expected = fs.readFileSync(path.resolve(__dirname, expectedPath));
  const actual = fs.readFileSync(path.resolve(__dirname, actualPath));

  if (diff(expected, actual).changed) {
    console.log(`${name} is different and failed`);
    process.exit(1);
  }
};

const checkInitalDir = async (name) => {
  await checkExists(`./${name}`, 'Main folder does not exist');
  await checkExists(`./${name}/.storybook`, 'Storybook config folder does not exist');
  await checkExists(`./${name}/test`, 'Test folder does not exist');

  await checkDiff(`./${name}/test/index.html`, './expected/test/index.html', 'test index');
  await checkDiff(`./${name}/.storybook/.babelrc`, './expected/.storybook/.babelrc', 'storybook .babelrc');
  await checkDiff(`./${name}/.storybook/addons.js`, './expected/.storybook/addons.js', 'storybook addons');
  await checkDiff(`./${name}/.storybook/config.js`, './expected/.storybook/config.js', 'storybook config');
  await checkDiff(`./${name}/.gitignore`, './expected/.gitignore', '.gitignore');
  await checkDiff(`./${name}/.padl`, './expected/.padl', '.padl');
  await checkDiff(`./${name}/package.json`, './expected/package.json', 'package.json');
  await checkDiff(`./${name}/README.md`, './expected/README.md', 'README.md');
};

const checkComponent = async (name, component) => {
  await checkExists(`./${name}/src`, 'src folder does not exist');
  await checkExists(`./${name}/src/${component}`, `${component} folder does not exist`);

  await checkDiff(`./${name}/src/${component}/component.js`, `./expected/src/${component}/component.js`, 'component.js');
  await checkDiff(`./${name}/src/${component}/story.js`, `./expected/src/${component}/story.js`, 'story.js');
  await checkDiff(`./${name}/src/${component}/styles.less`, `./expected/src/${component}/styles.less`, 'styles.less');
};

(async () => {
  const appName = 'hello-world';

  await runCommand(`node ../dist/index.js new ${appName}`).catch((e) => {
    console.log('Command "new" failed');
    console.log(e);
    process.exit(1);
  });

  await checkInitalDir(appName);

  await runCommand(`cd ${appName} && node ../../dist/index.js generate 'foo-bar'`).catch((e) => {
    console.log('Command "generate" failed');
    console.log(e);
    process.exit(1);
  });

  await checkComponent(appName, 'foo-bar');

  await cleanUp(appName);

  console.log('✅All E2E tests passed');
  process.exit(0);
})();
