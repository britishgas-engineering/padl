#! /usr/bin/env node
import commander from 'commander';
import * as commands from './commands';
import packageJson from '../package.json';
import {getConfigArgs} from './util';

const program = new commander.Command();

program.version(packageJson.version, '-v, --v, --version', 'Output the current version');

program
  .command('build')
  .description('Build padl web component files')
  .action(() => {
    return commands.build(getConfigArgs());
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

program.parse(process.argv);
