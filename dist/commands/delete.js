"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = async (config, name) => {
  let options = {};

  if (!name) {
    console.log('Missing name for component.');
    process.exit(1);
    return;
  }

  ;

  if (!_fsExtra.default.existsSync(`src/${name}`)) {
    console.log(`The component ${name} doesn't exists.`);
    process.exit(1);
    return;
  }

  await _fsExtra.default.remove(`src/${name}`);
  await _fsExtra.default.remove(`test/${name}`);
  console.log(`Deleted component '${name}'.`);
  process.exit(0);
  return;
};

exports.default = _default;