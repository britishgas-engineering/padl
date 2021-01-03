import { withKnobs, text } from '@storybook/addon-knobs/html';

export default {
  title: 'DASH_NAME',
  decorators: [withKnobs],
};

export const standard = () => {
  return `
    <div>
      <DASH_NAME></DASH_NAME>
    </div>
  `;
};

standard.storyName = 'Standard';

export const changePropValue = () => {
  const prop = text('prop', 'foo');

  return `
    <div>
      <DASH_NAME prop1="${prop}"></DASH_NAME>
    </div>
  `;
};

changePropValue.storyName = 'Change prop value';
