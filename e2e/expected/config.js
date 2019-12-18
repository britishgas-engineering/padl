import { configure, getStorybook, addDecorator } from '@storybook/html';
import { themes } from '@storybook/components';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs/html';
import { configureViewport } from '@storybook/addon-viewport';

import '../dist/polyfill.js';
import '../dist/components.js';

addDecorator(withA11y);
addDecorator(withKnobs);
configureViewport();

configure(require.context('../src/', true, /.*story.js$/), module);

export { getStorybook };
