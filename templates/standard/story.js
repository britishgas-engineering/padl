import { storiesOf } from '@storybook/html';
import { withKnobs, text } from '@storybook/addon-knobs/html';

storiesOf('DASH_NAME', module)
  .addDecorator(withKnobs)
  .add('Standard', () => (
    '<div><DASH_NAME></DASH_NAME></div>'
  )).add('Change prop value', () => {
  const prop = text('prop', 'foo');

  return (`<div><DASH_NAME prop1="${prop}"></DASH_NAME></div>`);
});
