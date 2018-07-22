import test from 'ava';

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

// test('check `errorMessage`', (t) => {
// 	t.is(util.successMessage('sorry'), 'sorry');
// });
