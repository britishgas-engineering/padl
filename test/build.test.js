import test from 'ava';
import sinon from 'sinon';
import fs from 'fs-extra';

import build from '../src/commands/build';
import * as rollupBuild from '../src/util/rollup';

test('exists', (t) => {
	t.truthy(build, 'true');
});

test('run build', (t) => {
	const con = sinon.stub(console, 'log');
	const proc = sinon.stub(process, 'exit');
  const roll = sinon.stub(rollupBuild, 'default');

  roll.callsFake(() => {
    return new Promise((resolve) => {
      return resolve('');
    });
  });

	build();

	t.deepEqual(con.args[0], ['Building files...'], 'Build started');
  // t.deepEqual(con.args[1], ['Finished building files...'], 'Build finished');

	// t.deepEqual(proc.args[0], [0], 'Process exited with 0');

	sinon.restore();
});
