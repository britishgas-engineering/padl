"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var _glob = _interopRequireDefault(require("glob"));

var _package = _interopRequireDefault(require("../../package.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cliPath = _path.default.join(_path.default.dirname(__filename), '..', '..');

const editFile = (file, name) => {
  const isFile = _fsExtra.default.lstatSync(file).isFile();

  if (isFile) {
    const fileData = _fsExtra.default.readFileSync(file, 'utf8');

    const result = fileData.replace(/REPO_NAME/g, name).replace(/REPO_TYPE/g, 'lit').replace(/REPO_VERSION/g, _package.default.version);

    _fsExtra.default.writeFileSync(file, result, 'utf8');
  }
};

const removeStyles = (config, name) => {
  if (!config.styles) {
    const fileData = _fsExtra.default.readFileSync(`${name}/.padl`, 'utf8');

    const obj = JSON.parse(fileData);
    obj['styles'] = false;

    _fsExtra.default.writeFileSync(`${name}/.padl`, JSON.stringify(obj, null, 2), 'utf8');
  }
};

var _default = async (config, name) => {
  let options = { ...config
  };

  if (!name) {
    console.log('Please state the library name.');
    process.exit(1);
    return;
  }

  if (_fsExtra.default.existsSync(name)) {
    console.log(`The folder ${name} already exists.`);
    process.exit(1);
    return;
  }

  const repoDir = _path.default.join(cliPath, 'templates', 'repo');

  _fsExtra.default.copySync(repoDir, name);

  const files = _glob.default.sync(`${name}/**`, {
    dot: true
  });

  files.forEach(file => editFile(file, name));
  removeStyles(config, name);
  console.log(`Library '${name}' has been created.`);
  process.exit(0);
  return;
};

exports.default = _default;