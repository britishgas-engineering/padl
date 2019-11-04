"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRightPathLocation = exports.getConfigArgs = exports.terserConfig = exports.babelConfig = exports.runCommand = void 0;

var _findNodeModules = _interopRequireDefault(require("find-node-modules"));

var _child_process = require("child_process");

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const runCommand = command => {
  return new Promise((resolve, reject) => {
    (0, _child_process.exec)(command, (error, stdout, stderr) => {
      if (error) {
        reject(stdout + stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

exports.runCommand = runCommand;
const babelConfig = {
  babelrc: false,
  runtimeHelpers: true,
  presets: [['@babel/preset-env', {
    targets: {
      browsers: ['last 2 versions'],
      ie: 11
    },
    loose: true,
    corejs: '3',
    useBuiltIns: 'entry'
  }]],
  plugins: ["@babel/plugin-transform-spread"]
};
exports.babelConfig = babelConfig;
const terserConfig = {
  output: {
    comments: function () {
      return false;
    }
  }
};
exports.terserConfig = terserConfig;

const getConfigArgs = () => {
  let config;

  try {
    config = JSON.parse(_fs.default.readFileSync('.padl').toString());
  } catch (e) {
    console.error('Missing config, is this the right folder?');
    process.exit(1);
  }

  return config;
};

exports.getConfigArgs = getConfigArgs;

const getRightPathLocation = dir => {
  return (0, _findNodeModules.default)().map(nodePath => {
    const totalPath = _path.default.join(nodePath, dir);

    if (_fs.default.existsSync(totalPath)) {
      return totalPath;
    }
  }).filter(nodePath => nodePath)[0];
};

exports.getRightPathLocation = getRightPathLocation;