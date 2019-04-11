import {
  main,
  warning,
  plugins,
  runtime,
  livereload
} from './rollup.default.config';

let dir_watch = ['src', 'dist/**'];

if (process.env.WATCH_DIR) {
  process.env.WATCH_DIR.split(',').forEach((dir) => dir_watch.push(dir));
};

if (!process.env.NO_LIVERELOAD) {
  const livereloadPlugin = livereload({
    watch: dir_watch,
    exts: ['js', 'less', 'svg', 'png', 'jpg', 'gif', 'css'],
    applyCSSLive: true,
    delay: 500
  });
  plugins.push(livereloadPlugin);
}

export default [
  ...main,
  {
    input: [`${runtime}`, 'src/**/component.js'],
    output: {
      name: 'polymerElement',
      format: 'esm',
      file: 'dist/components.js'
    },
    plugins,
    ...warning
  }
]
