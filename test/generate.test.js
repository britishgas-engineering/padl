import test from 'ava';
import sinon from 'sinon';
import fs from 'fs-extra';
import glob from 'glob';

import generate from '../src/commands/generate';

test('exists', (t) => {
	t.truthy(generate, 'true');
});

test('no config', (t) => {
	const con = sinon.stub(console, 'log');
	const proc = sinon.stub(process, 'exit');

	generate();

	t.deepEqual(con.args[0], ['Missing name for component.'], 'No name is given');
	t.deepEqual(proc.args[0], [1], 'Process exited with 1');

	sinon.restore();
});

test('wrong component name', (t) => {
  const con = sinon.stub(console, 'log');
  const proc = sinon.stub(process, 'exit');
  const exists = sinon.stub(fs, 'existsSync');

  exists.callsFake(() => {
    return true;
  });

  generate({}, 'foobar');

  t.deepEqual(con.args[0], [`Component name requires a dash (-).`], 'Component does not have a dash');
  t.deepEqual(proc.args[0], [1], 'Process exited with 1');

  sinon.restore();
});

test('existing file', (t) => {
	const con = sinon.stub(console, 'log');
	const proc = sinon.stub(process, 'exit');
	const exists = sinon.stub(fs, 'existsSync');

	exists.callsFake(() => {
    return true;
  });

	generate({}, 'foo-bar');

	t.deepEqual(con.args[0], [`The component foo-bar already exists.`], 'Component already exists');
	t.deepEqual(proc.args[0], [1], 'Process exited with 1');

	sinon.restore();
});

test('generate component', async (t) => {
	const con = sinon.stub(console, 'log');
	const proc = sinon.stub(process, 'exit');
	const exists = sinon.stub(fs, 'existsSync');
  const fsCopy = sinon.stub(fs, 'copySync');
  const globStub = sinon.stub(glob, 'sync');
  const lstatSync = sinon.stub(fs, 'lstatSync');

	exists.callsFake(() => {
    return false;
  });

  // @TODO: Update to check the read, result and write
  globStub.callsFake(() => {
    return ['xyz', 'thing'];
  });

  lstatSync.callsFake(() => {
    return {
      isFile() {
        return false;
      }
    };
  });

	await generate({}, 'foo-bar');

	t.deepEqual(con.args[0], [`Generated component 'foo-bar'.`], 'Component generated');
	t.deepEqual(proc.args[0], [0], 'Process exited with 0');

	sinon.restore();
});
