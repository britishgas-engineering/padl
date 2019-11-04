import test from 'ava';
import sinon from 'sinon';
import fs from 'fs-extra';
import glob from 'glob';

import genNew from '../src/commands/new';

test('exists', (t) => {
	t.truthy(genNew, 'true');
});

test('no name', (t) => {
	const con = sinon.stub(console, 'log');
	const proc = sinon.stub(process, 'exit');

	genNew();

	t.deepEqual(con.args[0], ['Please state the library name.'], 'No name is given');
	t.deepEqual(proc.args[0], [1], 'Process exited with 1');

	sinon.restore();
});

test('exisiting name', (t) => {
	const con = sinon.stub(console, 'log');
	const proc = sinon.stub(process, 'exit');
	const exists = sinon.stub(fs, 'existsSync');

	exists.callsFake(() => {
    return true;
  });

	genNew({}, 'foobar');

	t.deepEqual(con.args[0], [`The folder foobar already exists.`], 'Folder already exists');
	t.deepEqual(proc.args[0], [1], 'Process exited with 1');

	sinon.restore();
});

test('generate library', async (t) => {
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

	await genNew({styles: true}, 'foobar');

	t.deepEqual(con.args[0], [`Library 'foobar' has been created.`], 'Library generated');
	t.deepEqual(proc.args[0], [0], 'Process exited with 0');

	sinon.restore();
});
