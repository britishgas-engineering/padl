import shell from 'shelljs';
import path from 'path';
import colors from 'colors';

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
  const type = 'lit';
  const name = args._[1].replace(/[^\w\-]/gi, '');
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
    });

    successMessage(`${colors.green(name)} library has been created 🎉 \n\n ${colors.green("Next steps:")} \n    $ cd ${name} && npm install\n    $ npm start\n`);
  } else {
    errorMessage(`${name} folder already exists`);
  }
};
