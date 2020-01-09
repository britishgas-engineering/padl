import {rollup, watch} from 'rollup';

export default async (inputPaths, outputPath, options = {}, plugins = []) => {
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

  if (options.from &&
    (options.from === 'serve' && options.watch) ||
    (options.from === 'test' && options.persistent)
  ) {
    const watcher = watch({
      ...inputOptions,
      output: [outputOptions]
    });

    watcher.on('event', async (event) => {
      if (event.code === 'BUNDLE_END') {
        await event.result.write(outputOptions);
      }
    });
  }

  const bundle = await rollup(inputOptions);

  await bundle.write(outputOptions);
};
