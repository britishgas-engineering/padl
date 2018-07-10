import { storiesOf } from '@storybook/html';
import { withKnobs, text } from '@storybook/addon-knobs/html';

storiesOf('DASH_NAME', module)
  .addDecorator(withKnobs)
  .add('Standard', () => (
    '<DASH_NAME></DASH_NAME>'
  )).add('Change prop value', () => {
  const prop = text('prop', 'foo');

  return (`<DASH_NAME prop1="${prop}"></DASH_NAME>`);
});
