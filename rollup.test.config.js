import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import resolve from 'rollup-plugin-node-resolve';
import multiEntry from 'rollup-plugin-multi-entry';
import less from 'rollup-plugin-less';
import path from 'path';

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
  resolve(),
  less(),
  multiEntry(),
  babel(babelrc({
    addExternalHelpersPlugin: true,
    config: babelConfig,
    exclude: 'node_modules/**'
  }))
];

const es5 = path.join(cliPath, 'node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js');
const webBundle = path.join(cliPath, 'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js');
const runtime = path.join(cliPath, 'node_modules/regenerator-runtime/runtime.js');

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
  }
]
