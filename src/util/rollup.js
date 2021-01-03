import {rollup, watch} from 'rollup';
import fs from 'fs-extra';
import path from 'path';

let cache = [];
export default async (inputPaths, outputPath, options = {}, plugins = []) => {
  const libraryPath = process.cwd();
  const packageVersion = JSON.parse(fs.readFileSync(path.join(libraryPath, 'package.json'), 'utf8')).version || 'unknown';

  const warning = {
    onwarn(warning, warn) {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning);
    }
  };

  const inputOptions = {
    // external: [/@babel\/runtime/],
    treeshake: true,
    input: inputPaths,
    plugins,
    cache: cache[outputPath],
    ...warning
  };

  const outputOptions = {
    file: outputPath,
    format: options.format || 'es',
    banner: `/* @version: ${packageVersion} */`,
  };

  if (!options.noWatch &&
    options.from &&
    (options.from === 'serve' && options.watch) ||
    (options.from === 'test' && options.persistent)
  ) {
    const watcher = watch({
      ...inputOptions,
      output: [outputOptions]
    });

    watcher.on('event', async (event) => {
      if(event.code === 'ERROR') {
        console.error(event.error);
      }

      if (event.code === 'BUNDLE_END') {
        cache = event.result.cache;
        await event.result.write(outputOptions);
      }
    });
  }

  const bundle = await rollup(inputOptions);

  cache[outputPath] = bundle.cache;

  await bundle.write(outputOptions);
};
