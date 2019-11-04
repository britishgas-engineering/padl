import rollup from '../util/rollup';
import {babelConfig, terserConfig} from '../util';
import {terser} from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import livereload from 'rollup-plugin-livereload';
import multiEntry from 'rollup-plugin-multi-entry';
import less from 'rollup-plugin-less';
import del from 'rollup-plugin-delete'
import cleanup from 'rollup-plugin-cleanup';
import Autoprefix from 'less-plugin-autoprefix';
import CleanCSS from 'less-plugin-clean-css';
import filesize from 'rollup-plugin-filesize';
import path from 'path';
import fs from 'fs-extra';

import {
  copyFiles,
  createStyles,
  createModule,
  watchStyles
} from '../util/build';

const autoprefixPlugin = new Autoprefix({grid: true, overrideBrowserslist: ['last 2 versions']});
const cleanCSSPlugin = new CleanCSS({advanced: true, compatibility: 'ie11', level: 2});

const cliPath = path.join(path.dirname(__filename), '..');
const dir = 'dist';

export default async (config) => {
  let options = {
    ...config
  };

  const polyfillPath = `${dir}/polyfill.js`;
  const componentsPath = `${dir}/components.js`;
  const mergedComponentsPath = `${dir}/components.min.js`;
  const onlyComponentsPath = `${dir}/only.components.min.js`;

  const livereloadPlugin = livereload({
    watch: ['src/**', `${dir}/**`],
    exts: ['js', 'less', 'svg', 'png', 'jpg', 'gif', 'css'],
    applyCSSLive: true,
    delay: 1000
  });

  const polyInputs = [
    'node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js'
  ];

  let plugins = [
    resolve(),
    less({
      plugins: [autoprefixPlugin, cleanCSSPlugin]
    }),
    multiEntry(),
    babel(babelConfig),
    cleanup()
  ];

  let minPlugins = [
    multiEntry(),
    terser(terserConfig),
    cleanup(),
    resolve()
  ];

  if (!options.from) {
    minPlugins.push(filesize());
  }

  if (options.from && options.from === 'serve' && options.watch && options.reload) {
    plugins.push(livereloadPlugin)
  }

  if (options.from && options.from === 'analysis' && options.plugins) {
    plugins = [
      ...plugins,
      ...options.plugins,
      terser(terserConfig)
    ]
  }

  console.log('Building files...');

  // Build polyfill.js
  await rollup(polyInputs, polyfillPath, {}, [multiEntry(), resolve(), del({targets: `${dir}/**`})]);
  // Build component.js
  await rollup([`${cliPath}/lib/runtime.js`, 'src/**/component.js'], componentsPath, options, plugins);
  // Build components.min.js
  await rollup([polyfillPath, componentsPath], mergedComponentsPath, {}, minPlugins);
  // Build components.only.min.js
  await rollup(componentsPath, onlyComponentsPath, {}, [terser(terserConfig), cleanup(), resolve()]);

  await copyFiles(config, dir);

  const styles = await createStyles(config, [autoprefixPlugin, cleanCSSPlugin]);

  if (options.from && options.from === 'serve') {
    watchStyles(config, [autoprefixPlugin, cleanCSSPlugin]);
  }

  const name = await createModule(config, styles, dir);
  // Build {name}.min.js module
  await rollup(`${dir}/${name}.js`, `${dir}/${name}.min.js`, {}, [terser(terserConfig), ...plugins]);

  console.log('Finished building files...');

  if (!options.from) {
    process.exit(0);
    return;
  }

}
