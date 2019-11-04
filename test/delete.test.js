import test from 'ava';
import sinon from 'sinon';
import fs from 'fs-extra';

import d from '../src/commands/delete';

test('exists', (t) => {
	t.truthy(d, 'true');
});

test('no config', (t) => {
	const con = sinon.stub(console, 'log');
	const proc = sinon.stub(process, 'exit');

	d();

	t.deepEqual(con.args[0], ['Missing name for component.'], 'No name is given');
	t.deepEqual(proc.args[0], [1], 'Process exited with 1');

	sinon.restore();
});

test('no existing component', (t) => {
	const con = sinon.stub(console, 'log');
	const proc = sinon.stub(process, 'exit');
	const exists = sinon.stub(fs, 'existsSync');

	exists.callsFake(() => {
    return false;
  });

	d({}, 'foobar');

	t.deepEqual(con.args[0], [`The component foobar doesn't exists.`], 'Component does not exists');
	t.deepEqual(proc.args[0], [1], 'Process exited with 1');

	sinon.restore();
});

test('delete component', async (t) => {
	const con = sinon.stub(console, 'log');
	const proc = sinon.stub(process, 'exit');
	const exists = sinon.stub(fs, 'existsSync');

	exists.callsFake(() => {
    return true;
  });

	await d({}, 'foobar');

	t.deepEqual(con.args[0], [`Deleted component 'foobar'.`], 'Component deleted');
	t.deepEqual(proc.args[0], [0], 'Process exited with 0');

	sinon.restore();
});
