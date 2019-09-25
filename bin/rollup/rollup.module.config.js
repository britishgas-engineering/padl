import fs from 'fs';
import {
  warning,
  terser,
  plugins
} from './rollup.default.config';

const config = JSON.parse(fs.readFileSync('.padl').toString());
const name = config.name || JSON.parse(fs.readFileSync(`package.json`, 'utf8')).name.replace(/ /g, '-');

export default [
  {
    input: `dist/${name}.js`,
    output: {
      name: 'polymerElement',
      format: 'es',
      file: `dist/${name}.min.js`
    },
    plugins: [...plugins, terser()],
    ...warning
  }
]
