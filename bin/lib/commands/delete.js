import shell from 'shelljs';
import * as util from '../util';

const {
  missingArg,
  successMessage,
  errorMessage
} = util;

export default (args) => {
  const command = args._[0];

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
};
