"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rollupPluginVisualizer = _interopRequireDefault(require("rollup-plugin-visualizer"));

var _build = _interopRequireDefault(require("./build"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = async config => {
  let options = { ...config,
    from: 'analysis',
    plugins: [(0, _rollupPluginVisualizer.default)({
      title: 'PaDL component bundle anlysis',
      open: true
    })]
  };
  await (0, _build.default)(options);
};

exports.default = _default;