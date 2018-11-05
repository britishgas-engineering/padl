#! /usr/bin/env node
import shell from 'shelljs';
import parseArgs from 'minimist';
import fs from 'fs';

import * as commands from './lib/commands';
import * as util from './lib/util';

let args = parseArgs(process.argv.slice(2));
const command = args._[0];

const addConfigArgs = () => {
  let config;

  try {
    config = JSON.parse(fs.readFileSync('.padl').toString());
  }
  catch (e) {
    util.errorMessage('Missing config, is this the right folder?');
  }

  args.config = config;
};

shell.config.silent = true;

util.missingArg(command, 'Please tell me what you want me todo!');

addConfigArgs();

commands[util.types[command]](args);
