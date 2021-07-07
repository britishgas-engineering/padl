import rollup from '../util/rollup';
import {terserConfig, randomPort} from '../util';
import {terser} from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import livereload from 'rollup-plugin-livereload';
import multiEntry from '@rollup/plugin-multi-entry';
import commonjs from '@rollup/plugin-commonjs';
// import less from 'rollup-plugin-less';
import stylesPlugin from 'rollup-plugin-styles';
import del from 'rollup-plugin-delete'
import cleanup from 'rollup-plugin-cleanup';
import Autoprefix from 'less-plugin-autoprefix';
import CleanCSS from 'less-plugin-clean-css';
import filesize from 'rollup-plugin-filesize';
import isGlobal from 'is-installed-globally';
import path from 'path';

import {
  copyFiles,
  createStyles,
  createModule,
  watchStyles
} from '../util/build';

const autoprefixPlugin = new Autoprefix({grid: true, overrideBrowserslist: ['last 2 versions']});
const cleanCSSPlugin = new CleanCSS({advanced: true, level: 2});

const cliPath = path.join(path.dirname(__filename), '..');
const dir = 'dist';

export default async (config) => {
  let options = {
    ...config
  };

  const polyfillPath = `${dir}/polyfill.js`;
  const componentsPath = `${dir}/components.js`;
  const mergedComponentsPath = `${dir}/components.min.js`;
  const modernComponentsPath = `${dir}/components.modern.min.js`;
  const onlyComponentsPath = `${dir}/only.components.min.js`;

  const polyInputs = [
    'node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js',
    `${cliPath}/lib/includes.js`
  ];

  let plugins = [
    resolve(),
    stylesPlugin({
      mode: 'extract',
      less: {
        plugins: [autoprefixPlugin, cleanCSSPlugin],
        output: false
      }
    }),
    multiEntry(),
    cleanup()
  ];

  let minPlugins = [
    multiEntry(),
    terser(terserConfig),
    cleanup(),
    resolve()
  ];

  const modernPlugins = [
    multiEntry(),
    stylesPlugin({
      mode: 'extract',
      less: {
        plugins: [autoprefixPlugin, cleanCSSPlugin],
        output: false
      }
    }),
    terser(terserConfig),
    cleanup(),
    resolve()
  ];

  if (!options.from) {
    minPlugins.push(filesize());
  }

  if (options.from &&
    (options.from === 'serve' && options.watch && options.reload && process.env.NODE_ENV !== 'production') ||
    (options.from === 'test' && options.persistent)
  ) {
    const port = await randomPort();
    const livereloadPlugin = livereload({
      watch: [`${dir}/**`],
      exts: ['js', 'less', 'svg', 'png', 'jpg', 'gif', 'css'],
      applyCSSLive: true,
      port
    });

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
  await rollup(polyInputs, polyfillPath, {noWatch: true}, [multiEntry(), resolve(), del({ targets: `${dir}/**` })]);

  // Build component.js
  await rollup(['src/*/component.js'], componentsPath, options, [commonjs(), ...plugins]);

  if (options.from && options.from === 'analysis') {
    return;
  }

  await copyFiles(config, dir);

  const styles = await createStyles(config, [autoprefixPlugin, cleanCSSPlugin]);

  if (options.from &&
    (options.from === 'serve') ||
    (options.from === 'test' && options.persistent)
  ) {
    watchStyles(config, [autoprefixPlugin, cleanCSSPlugin]);
  }

  if (options.from && (options.from === 'serve') && process.env.NODE_ENV !== 'production') {
    return;
  }

  // Build components.min.js
  await rollup(componentsPath, mergedComponentsPath, options, minPlugins);

  //Build components.modern.min.js
  await rollup('src/**/component.js', modernComponentsPath, options, modernPlugins);

  // Build components.only.min.js
  await rollup(componentsPath, onlyComponentsPath, {format: 'iife'}, [terser(terserConfig), cleanup(), resolve()]);

  const name = await createModule(config, styles, dir);
  // Build {name}.min.js module
  await rollup(`${dir}/${name}.js`, `${dir}/${name}.min.js`, {}, [terser(terserConfig), ...plugins]);

  if (options.storybook) {
    // build static storybook
    console.log('Building Storybook...');

    const errorMessage = 'Please use PaDL locally to serve to get the correct version of Storybook';
    if (!isGlobal) {
      try {
        const storybook = require('@storybook/html/standalone');

        await storybook({
          mode: 'static',
          outputDir: `${dir}/demo`,
          configDir: '.storybook'
        }).catch((e) => {
          console.error(e);
          process.exit(1);
          return;
        });
      } catch (error) {
        console.log(`Error: ${error}`);
      }

    } else {
      console.log(errorMessage);
    }
  }

  console.log('Finished building files...');

  if (!options.from) {
    process.exit(0);
    return;
  }

}
