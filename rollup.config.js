import {
  standard,
  warning,
  multiEntry,
  terser
} from './rollup.default.config';

export default [
  ...standard,
  {
    input: ['dist/polyfill.js', 'dist/components.js'],
    output: {
      name: 'polymerElement',
      format: 'esm',
      file: 'dist/components.min.js'
    },
    plugins: [multiEntry(), terser()],
    ...warning
  },
  {
    input: 'dist/components.js',
    output: {
      name: 'polymerElement',
      format: 'esm',
      file: 'dist/only.components.min.js'
    },
    plugins: [terser()],
    ...warning
  }
]
