import test from 'ava';
import sinon from 'sinon';
import fs from 'fs-extra';
import glob from 'glob';

import te from '../src/commands/test';
import * as rollupBuild from '../src/util/rollup';
import * as buildTools from '../src/util/build';

test('exists', (t) => {
	t.truthy(te, 'true');
});

test('no config', async (t) => {
	const con = sinon.stub(console, 'log');
	const proc = sinon.stub(process, 'exit');
  const exists = sinon.stub(fs, 'existsSync');
	const outputFile = sinon.stub(fs, 'outputFileSync');
	const readFile = sinon.stub(fs, 'readFileSync');
  const globber = sinon.stub(glob, 'sync');
	const roll = sinon.stub(rollupBuild, 'default');
  const rep = sinon.stub(buildTools, 'createModule');

  globber.callsFake(() => {
    return ['foo', 'bar']
  })

  readFile.callsFake(() => {
    return 'foo';
  })

  roll.callsFake(() => {
    return new Promise((resolve) => {
      return resolve('');
    });
  });

	await te();

  t.deepEqual(con.args[0], ['Building files...'], 'Building files message output');
  t.deepEqual(con.args[1], ['Finished building files...'], 'Build finished');
  t.deepEqual(con.args[2], ['Running tests...'], 'Running tests message output');
  // t.deepEqual(con.args[3], ['Running tests...'], 'Running tests message output');

	t.deepEqual(proc.args[0], [1], 'Process exited with 1');

	sinon.restore();
});
