import { configure, getStorybook, addDecorator } from '@storybook/html';
import { themes } from '@storybook/components';
import { checkA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs/html';
import { configureViewport } from '@storybook/addon-viewport';

import '../dist/polyfill.js';
import '../dist/components.js';

addDecorator(checkA11y);
addDecorator(withKnobs);
configureViewport();

const req = require.context('../src', true, /.*story.js$/);

function loadStories() {
  // DO NOT CHANGE: this will automatically find all the story.js files
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
export { getStorybook };
