import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import multiEntry from 'rollup-plugin-multi-entry';
import less from 'rollup-plugin-less';
import path from 'path';
import fs from 'fs';

let cliPath = path.join(path.dirname(__filename));

const babelConfig = {
  presets: [
    ['env', {
      targets: {
        browsers: ['last 2 versions'],
        ie: 11
      },
      loose: true,
      useBuiltIns: true
    }]
  ],
  plugins: [
    'external-helpers',
    'transform-object-rest-spread'
  ]
};

const plugins = [
  resolve({jsnext: true}),
  less(),
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

export default [
  {
    input: [
      `${es5}`,
      `${webBundle}`
    ],
    output: {
      file: 'dist/polyfill.js',
      format: 'esm'
    },
    plugins: [multiEntry()]
  },
  {
    input: [`${runtime}`,'src/**/component.js'],
    output: {
      name: 'polymerElement',
      format: 'esm',
      file: 'dist/components.js'
    },
    plugins
  },
  {
    input: ['dist/polyfill.js', 'dist/components.js'],
    output: {
      name: 'polymerElement',
      format: 'esm',
      file: 'dist/components.min.js'
    },
    plugins: [multiEntry(), terser()]
  },
  {
    input: 'dist/components.js',
    output: {
      name: 'polymerElement',
      format: 'esm',
      file: 'dist/only.components.min.js'
    },
    plugins: [terser()]
  }
]
