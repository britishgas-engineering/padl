"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _glob = _interopRequireDefault(require("glob"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cliPath = _path.default.join(_path.default.dirname(__filename), '..', '..');

const editFile = (file, name, componentName) => {
  const isFile = _fsExtra.default.lstatSync(file).isFile();

  if (isFile) {
    const fileData = _fsExtra.default.readFileSync(file, 'utf8');

    const result = fileData.replace(/COMPONENT_NAME/g, componentName).replace(/DASH_NAME/g, name);

    _fsExtra.default.writeFileSync(file, result, 'utf8');
  }
};

var _default = (config, name) => {
  let options = { ...config,
    type: 'lit'
  };
  const componentName = name && name.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
    return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '').replace(/-/g, '');

  if (!name) {
    console.log('Missing name for component.');
    process.exit(1);
    return;
  }

  if (!name.includes('-')) {
    console.log('Component name requires a dash (-).');
    process.exit(1);
    return;
  }

  ;

  if (_fsExtra.default.existsSync(`src/${name}`)) {
    console.log(`The component ${name} already exists.`);
    process.exit(1);
    return;
  }

  ;
  const type = options.styles ? options.type : `${options.type}-no-styles`;

  const repoDir = _path.default.join(cliPath, 'templates', 'standard', 'component');

  const testDir = _path.default.join(cliPath, 'templates', 'standard', 'test');

  const compDir = _path.default.join(cliPath, 'templates', type);

  const filterCopy = src => {
    if (!options.styles && src.includes('styles.less')) {
      return false;
    }

    return true;
  };

  _fsExtra.default.copySync(repoDir, `src/${name}`, {
    filter: filterCopy
  });

  _fsExtra.default.copySync(compDir, `src/${name}`);

  _fsExtra.default.copySync(_path.default.join(testDir, 'test.html'), `test/${name}/${name}_test.html`);

  _fsExtra.default.copySync(_path.default.join(testDir, 'test.js'), `test/${name}/${name}_test.js`);

  const files = _glob.default.sync(`src/${name}/**`, {
    dot: true
  });

  const testFiles = _glob.default.sync(`test/${name}/**`, {
    dot: true
  });

  files.forEach(file => editFile(file, name, componentName));
  testFiles.forEach(file => editFile(file, name, componentName));
  console.log(`Generated component '${name}'.`);
  process.exit(0);
  return;
};

exports.default = _default;