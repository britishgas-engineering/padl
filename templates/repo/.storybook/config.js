import { configure } from '@storybook/html';
import '../dist/components.js';

const req = require.context('../src', true, /.*story.js$/);

function loadStories() {
  // DO NOT CHANGE: this will automatically find all the story.js files
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
