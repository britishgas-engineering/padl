import shell from 'shelljs';
import path from 'path';
import fs from 'fs';

import * as util from '../util';

const {
  missingArg,
  successMessage,
  errorMessage,
  CONSTANTS
} = util;

const { cliPath } = CONSTANTS;

export default (args) => {
  let type;
  let config;
  const command = args._[0];

  try {
    config = JSON.parse(fs.readFileSync('.padl').toString());
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
    errorMessage('.padl type is not right, please use `polymer` or `lit`.');
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
