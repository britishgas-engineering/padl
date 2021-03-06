#! /usr/bin/env node
import commander from 'commander';
import updateNotifier from 'update-notifier';
import * as commands from './commands';
import packageJson from '../package.json';
import {getConfigArgs} from './util';

const program = new commander.Command();
const notifier = updateNotifier({pkg: packageJson, updateCheckInterval: 1000 * 60 * 60});

notifier.notify({isGlobal: true});

program.version(packageJson.version, '-v, --v, --version', 'Output the current version');

program
  .command('build')
  .description('Build padl web component files')
  .option('--storybook', 'Creates static storybook with build')
  .action((options) => {
    const config = {
      ...getConfigArgs(),
      ...options
    };
    return commands.build(config);
  });

program
  .command('analysis')
  .description('Analyse padl web component files')
  .action(() => {
    return commands.analysis(getConfigArgs());
  });

program
  .command('delete [component]')
  .alias('d')
  .description('Delete specific component')
  .action((component) => {
    return commands.d(getConfigArgs(), component);
  });

program
  .command('generate [component]')
  .alias('g')
  .description('Create new web component')
  .action((component) => {
    return commands.generate(getConfigArgs(), component);
  });


program
  .command('new [name]')
  .description('Create new library')
  .option('--no-styles', 'Create a new library that does not need styles in the component')
  .action((name, options) => {
    // doesn't need `getConfigArgs` as config file hasn't been created.
    return commands.newRepo(options, name);
  });

program
  .command('serve')
  .alias('s')
  .description('Serve web components using Storybook')
  .option('-p, --port <port>', 'Change port number')
  .option('--no-open', 'Stops serve from automatically opening in browser after loading')
  .option('--no-reload', 'Stops Storybook from automatically reloading to changes')
  .action((options) => {
    const config = {
      ...getConfigArgs(),
      ...options
    };

    return commands.serve(config);
  });

program
  .command('test')
  .alias('t')
  .description('Run tests')
  .option('-h, --headless', 'Run tests headlessly')
  .option('-p, --persistent', 'Keep tests open after running')
  .action((options) => {
    const config = {
      ...getConfigArgs(),
      ...options
    };

    return commands.test(config);
  });

program
  .command('*')
  .action(() => {
    console.log('Unknown command, if you are stuck run padl --help');
  });

program.parse(process.argv);
