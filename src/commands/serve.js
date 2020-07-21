import isGlobal from 'is-installed-globally';
import build from './build';

export default async (config) => {
  let options = {
    ...config,
    from: 'serve',
    watch: true
  };

  const port = options.port && parseInt(options.port) || 9001;

  if (!isGlobal) {
    const storybook = require('@storybook/html/standalone');

    await build(options);

    storybook({
      mode: 'dev',
      port,
      staticDir: ['./dist'],
      configDir: './.storybook',
      ci: !options.open
    })
  } else {
    console.log('Please use PaDL locally to serve to get the correct version of Storybook');
  }
}
