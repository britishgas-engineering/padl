import shell from 'shelljs';
import path from 'path';

import * as util from '../util';

const {
  missingArg,
  successMessage,
  errorMessage,
  CONSTANTS
} = util;

const { cliPath } = CONSTANTS;

export default (args) => {
  const command = args._[0];

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
      ...shell.ls(`${name}/.padl`)
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
};
