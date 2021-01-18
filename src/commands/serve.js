import isGlobal from 'is-installed-globally';
import build from './build';

export default async (config) => {
  console.log('Initialising serve...');

  let options = {
    ...config,
    from: 'serve',
    watch: true
  };

  const port = options.port && parseInt(options.port) || 9001;
  const errorMessage = 'Please use PaDL locally to serve to get the correct version of Storybook';
  if (!isGlobal) {
    try {
      const storybook = require('@storybook/html/standalone');

      await build(options);

      storybook({
        mode: 'dev',
        port,
        staticDir: ['./dist'],
        configDir: './.storybook',
        ci: !options.open
      });
    } catch (error) {
      console.log(`Error: ${error}`);
    }
    
  } else {
    console.log(errorMessage);
  }
}
