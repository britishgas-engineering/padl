"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _standalone = _interopRequireDefault(require("@storybook/html/standalone"));

var _build = _interopRequireDefault(require("./build"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = async config => {
  let options = { ...config,
    from: 'serve',
    watch: true
  };
  const port = options.port && parseInt(options.port) || 9001;
  await (0, _build.default)(options);
  (0, _standalone.default)({
    mode: 'dev',
    port,
    staticDir: ['./dist'],
    configDir: './.storybook',
    ci: !options.open
  });
};

exports.default = _default;