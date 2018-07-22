#! /usr/bin/env node
import shell from 'shelljs';
import parseArgs from 'minimist';

import * as commands from './lib/commands';
import * as util from './lib/util';

const args = parseArgs(process.argv.slice(2));
const command = args._[0];

shell.config.silent = true;

util.missingArg(command, 'Please tell me what you want me todo!');

commands[util.types[command]](args);
