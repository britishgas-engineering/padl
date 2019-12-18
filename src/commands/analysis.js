import visualizer from 'rollup-plugin-visualizer';
import build from './build';

export default async (config) => {
  let options = {
    ...config,
    from: 'analysis',
    plugins: [
      visualizer({
        title: 'PaDL component bundle anlysis',
        open: true,
        filename: 'dist/stats.html'
      })
    ]
  };

  await build(options);

  process.exit(0);

  return;
}
