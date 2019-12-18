import { withKnobs, text } from '@storybook/addon-knobs/html';

export default {
  title: 'foo-bar',
  decorators: [withKnobs],
};

export const standard = () => {
  return `
    <div>
      <foo-bar></foo-bar>
    </div>
  `;
};

standard.story = {
  name: 'Standard',
};

export const changePropValue = () => {
  const prop = text('prop', 'foo');

  return `
    <div>
      <foo-bar prop1="${prop}"></foo-bar>
    </div>
  `;
};

changePropValue.story = {
  name: 'Change prop value',
};
