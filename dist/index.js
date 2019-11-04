#! /usr/bin/env node
"use strict";

var _commander = _interopRequireDefault(require("commander"));

var commands = _interopRequireWildcard(require("./commands"));

var _package = _interopRequireDefault(require("../package.json"));

var _util = require("./util");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const program = new _commander.default.Command();
program.version(_package.default.version, '-v, --v, --version', 'Output the current version');
program.command('build').description('Build padl web component files').action(() => {
  return commands.build((0, _util.getConfigArgs)());
});
program.command('analysis').description('Analyse padl web component files').action(() => {
  return commands.analysis((0, _util.getConfigArgs)());
});
program.command('delete [component]').alias('d').description('Delete specific component').action(component => {
  return commands.d((0, _util.getConfigArgs)(), component);
});
program.command('generate [component]').alias('g').description('Create new web component').action(component => {
  return commands.generate((0, _util.getConfigArgs)(), component);
});
program.command('new [name]').description('Create new library').option('--no-styles', 'Create a new library that does not need styles in the component').action((name, options) => {
  return commands.newRepo(options, name);
});
program.command('serve').alias('s').description('Serve web components using Storybook').option('-p, --port <port>', 'Change port number').option('--no-open', 'Stops serve from automatically opening in browser after loading').option('--no-reload', 'Stops Storybook from automatically reloading to changes').action(options => {
  const config = { ...(0, _util.getConfigArgs)(),
    ...options
  };
  return commands.serve(config);
});
program.command('test').alias('t').description('Run tests').option('-h, --headless', 'Run tests headlessly').option('-p, --persistent', 'Keep tests open after running').action(options => {
  const config = { ...(0, _util.getConfigArgs)(),
    ...options
  };
  return commands.test(config);
});
program.parse(process.argv);