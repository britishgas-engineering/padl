import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import Autoprefix from 'less-plugin-autoprefix';
import CleanCSS from 'less-plugin-clean-css';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import multiEntry from 'rollup-plugin-multi-entry';
import livereload from 'rollup-plugin-livereload'
import less from 'rollup-plugin-less';
import path from 'path';
import fs from 'fs';

let cliPath = path.join(path.dirname(__filename));

const autoprefixPlugin = new Autoprefix({grid: true, browsers: ['last 2 versions']});
const cleanCSSPlugin = new CleanCSS({advanced: true, compatibility: 'ie11', level: 2});
const babelConfig = {
  presets: [
    ['@babel/env', {
      targets: {
        browsers: ['last 2 versions'],
        ie: 11
      },
      loose: true,
      useBuiltIns: "entry"
    }]
  ],
  plugins: [
    '@babel/plugin-external-helpers',
    '@babel/plugin-proposal-object-rest-spread'
  ]
};

const plugins = [
  resolve({jsnext: true}),
  less({
    plugins: [autoprefixPlugin, cleanCSSPlugin]
  }),
  multiEntry(),
  babel(babelrc({
    addExternalHelpersPlugin: true,
    config: babelConfig,
    exclude: 'node_modules/**'
  }))
];

const es5Module = 'node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
const webBundleModule = 'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js';
const runtimeModule = 'node_modules/regenerator-runtime/runtime.js';

const es5Path = path.join(cliPath, es5Module);
const webBundlePath = path.join(cliPath, webBundleModule);
const runtimePath = path.join(cliPath, runtimeModule);

const es5 = fs.existsSync(es5Path) ? es5Path : es5Module;
const webBundle = fs.existsSync(webBundlePath) ? webBundlePath : webBundleModule;
const runtime = fs.existsSync(runtimePath) ? runtimePath : webBundleModule;

const warning = {
  onwarn(warning, warn) {
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    warn(warning);
  }
};

const main = [
  {
    input: [
      `${es5}`,
      `${webBundle}`
    ],
    output: {
      file: 'dist/polyfill.js',
      format: 'esm'
    },
    plugins: [multiEntry()],
    ...warning
  }
]

const standard = [
  ...main,
  {
    input: [`${runtime}`,'src/**/component.js'],
    output: {
      name: 'polymerElement',
      format: 'esm',
      file: 'dist/components.js'
    },
    plugins,
    ...warning
  }
];

export {
  standard,
  main,
  warning,
  multiEntry,
  terser,
  plugins,
  runtime,
  livereload
}
