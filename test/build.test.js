import test from 'ava';
import sinon from 'sinon';
import fs from 'fs-extra';
import glob from 'glob';

import build from '../src/commands/build';
import * as rollupBuild from '../src/util/rollup';
import * as buildTools from '../src/util/build';

test('exists', (t) => {
	t.truthy(build, 'true');
});

test('run build', async (t) => {
	const con = sinon.stub(console, 'log');
	const proc = sinon.stub(process, 'exit');
  const roll = sinon.stub(rollupBuild, 'default');
	const outputFile = sinon.stub(fs, 'outputFileSync');
	const readFile = sinon.stub(fs, 'readFileSync');
	const globber = sinon.stub(glob, 'sync');
	const rep = sinon.stub(buildTools, 'createModule');

	process.env.NODE_ENV = 'production';

  roll.callsFake(() => {
		return '';
  });

	await build({name: 'foo'});

	t.deepEqual(con.args[0], ['Building files...'], 'Build started');
  t.deepEqual(con.args[1], ['Finished building files...'], 'Build finished');

	t.deepEqual(proc.args[0], [0], 'Process exited with 0');

	sinon.restore();

});
