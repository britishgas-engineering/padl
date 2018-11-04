import test from 'ava';
import path from 'path';
import sinon from 'sinon';
import shell from 'shelljs';

import serve from '../bin/lib/commands/serve';

test.before((t) => {
  t.context.cliPath = path.join(path.dirname(__filename), '..');
});

test('exists', (t) => {
	t.truthy(serve, true);
});

test('run serve', (t) => {
  const echo = sinon.stub(shell, 'echo');
	const rm = sinon.stub(shell, 'rm');
	const exec = sinon.stub(shell, 'exec');
  const config = path.join(t.context.cliPath, 'rollup.config.js');
	const rollup = path.join(t.context.cliPath, 'node_modules/.bin/rollup');

  serve();

  t.deepEqual(echo.args[0], ['Cleaning cache...'], 'Cleaning cache message');
  t.deepEqual(rm.args[0], ['-rf', 'dist'], 'Removing files in dist');
  t.deepEqual(echo.args[1], ['Building files...'], 'Building files message');
  t.deepEqual(exec.args[0][0], `${rollup} -c ${config}`);

  sinon.restore();
});
