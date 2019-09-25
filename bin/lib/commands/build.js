import * as util from '../util';

export default (args) => {
  let options = {};

  if (args.config && args.config.static) {
    options.static = args.config.static;
  };

  if (args.config && args.config.globalStyle) {
    options.globalStyle = args.config.globalStyle;
  };

  if (args.config && args.config.hostname) {
    options.hostname = args.config.hostname;
  };

  util.buildFiles(util.CONSTANTS.rollupConfig, false, options).then(() => {
    if (args.storybook) {
      util.buildStorybook('.storybook');
    }
  });
}
