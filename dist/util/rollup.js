"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rollup = require("rollup");

var _default = async (inputPaths, outputPath, options = {}, plugins = []) => {
  const warning = {
    onwarn(warning, warn) {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning);
    }

  };
  const inputOptions = {
    treeshake: true,
    input: inputPaths,
    plugins,
    ...warning
  };
  const outputOptions = {
    file: outputPath,
    format: 'es'
  };

  if (options.from && options.from === 'serve' && options.watch) {
    const watcher = (0, _rollup.watch)({ ...inputOptions,
      output: [outputOptions]
    });
    watcher.on('event', async event => {
      if (event.code === 'BUNDLE_END') {
        await event.result.write(outputOptions);
      }
    });
  }

  const bundle = await (0, _rollup.rollup)(inputOptions);
  await bundle.write(outputOptions);
};

exports.default = _default;