import test from 'ava';
import sinon from 'sinon';
import shell from 'shelljs';

import * as util from '../build/lib/util';

test('check `CONSTANTS`', (t) => {
	t.is(util.CONSTANTS.wct, 'node_modules/.bin/wct');
	t.is(util.CONSTANTS.storybookBuild, 'node_modules/.bin/build-storybook');
	t.is(util.CONSTANTS.storybookStart, 'node_modules/.bin/start-storybook');
});

test('check `types` commands', (t) => {
	t.is(util.types.test, 'test');
	t.is(util.types.new, 'newRepo');
	t.is(util.types.build, 'build');
	t.is(util.types.sketch, 'sketch');
	t.is(util.types.serve, 'serve');
	t.is(util.types.delete, 'd');
	t.is(util.types.d, 'd');
	t.is(util.types.generate, 'generate');
	t.is(util.types.g, 'generate');
});

test('check `successMessage`', (t) => {
	const message = 'successful';
	const echo = sinon.stub(shell, 'echo');
	const exit = sinon.stub(shell, 'exit');

	util.successMessage(message);

	t.truthy(echo.called);
	t.deepEqual(echo.args[0], [message], 'Message is passed to echo');
	t.truthy(exit.called);
	t.deepEqual(exit.args[0], [0], 'Exits with `0`');
	sinon.restore();
});

test('check `errorMessage`', (t) => {
	const message = 'you done something wrong :(';
	const echo = sinon.stub(shell, 'echo');
	const exit = sinon.stub(shell, 'exit');

	util.errorMessage(message);

	t.truthy(echo.called);
	t.deepEqual(echo.args[0], [message], 'Message is passed to echo');
	t.truthy(exit.called);
	t.deepEqual(exit.args[0], [1], 'Exits with `1`');
	sinon.restore();
});
