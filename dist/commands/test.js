"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _glob = _interopRequireDefault(require("glob"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _path = _interopRequireDefault(require("path"));

var _build = _interopRequireDefault(require("./build"));

var _util = require("../util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createTestFixtures = (files, suiteFiles) => {
  let fixtures = '';
  files.forEach(file => {
    const data = _fsExtra.default.readFileSync(file).toString();

    fixtures += data;
  });
  return '(function () {document.write(`' + fixtures + '`); const files = [' + suiteFiles + ']; WCT.loadSuites(files); })();';
};

const wct = (0, _util.getRightPathLocation)(_path.default.join('.bin', 'wct'));

var _default = async config => {
  let options = { ...config,
    from: 'test'
  };
  await (0, _build.default)(options);

  const testHTMLFiles = _glob.default.sync('test/**/*_test.html');

  const suiteFiles = _glob.default.sync('test/**/*_test.js').map(file => `'${file.replace('test/', '')}'`);

  const fixtureContent = createTestFixtures(testHTMLFiles, suiteFiles);
  const configFile = options.headless ? `--config-file wct.headless.config.json` : '';

  _fsExtra.default.outputFileSync('dist/test-fixtures.js', fixtureContent);

  console.log('Running tests...');
  const testCmd = await (0, _util.runCommand)(`${wct} --npm ${configFile} ${options.persistent ? '-p' : ''}`);
  console.log('....................');
  console.log(testCmd);
};

exports.default = _default;