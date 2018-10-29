import * as util from '../util';

export default (args) => {
  let options = {};

  if (args.config && args.config.static) {
    options.static = args.config.static;
  };

  util.buildFiles(util.CONSTANTS.rollupConfig, false, options).then(() => {
    if (args.storybook) {
      util.buildStorybook('.storybook');
    }
  });
}
