import storybook from '@storybook/html/standalone';
import build from './build';

export default async (config) => {
  let options = {
    ...config,
    from: 'serve',
    watch: true
  };

  const port = options.port && parseInt(options.port) || 9001;

  await build(options);

  storybook({
    mode: 'dev',
    port,
    staticDir: ['./dist'],
    configDir: './.storybook',
    ci: !options.open
  })
}
