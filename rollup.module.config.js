import fs from 'fs';
import {
  warning,
  terser
} from './rollup.default.config';

const name = JSON.parse(fs.readFileSync(`package.json`, 'utf8')).name.replace(/ /g, '-');

export default [
  {
    input: `dist/${name}.js`,
    output: {
      name: 'polymerElement',
      format: 'esm',
      file: `dist/${name}.min.js`
    },
    plugins: [terser()],
    ...warning
  }
]
