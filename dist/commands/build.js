"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rollup = _interopRequireDefault(require("../util/rollup"));

var _util = require("../util");

var _rollupPluginTerser = require("rollup-plugin-terser");

var _rollupPluginNodeResolve = _interopRequireDefault(require("rollup-plugin-node-resolve"));

var _rollupPluginBabel = _interopRequireDefault(require("rollup-plugin-babel"));

var _rollupPluginLivereload = _interopRequireDefault(require("rollup-plugin-livereload"));

var _rollupPluginMultiEntry = _interopRequireDefault(require("rollup-plugin-multi-entry"));

var _rollupPluginLess = _interopRequireDefault(require("rollup-plugin-less"));

var _rollupPluginDelete = _interopRequireDefault(require("rollup-plugin-delete"));

var _rollupPluginCleanup = _interopRequireDefault(require("rollup-plugin-cleanup"));

var _lessPluginAutoprefix = _interopRequireDefault(require("less-plugin-autoprefix"));

var _lessPluginCleanCss = _interopRequireDefault(require("less-plugin-clean-css"));

var _rollupPluginFilesize = _interopRequireDefault(require("rollup-plugin-filesize"));

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _build = require("../util/build");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const autoprefixPlugin = new _lessPluginAutoprefix.default({
  grid: true,
  overrideBrowserslist: ['last 2 versions']
});
const cleanCSSPlugin = new _lessPluginCleanCss.default({
  advanced: true,
  compatibility: 'ie11',
  level: 2
});

const cliPath = _path.default.join(_path.default.dirname(__filename), '..');

const dir = 'dist';

var _default = async config => {
  let options = { ...config
  };
  const polyfillPath = `${dir}/polyfill.js`;
  const componentsPath = `${dir}/components.js`;
  const mergedComponentsPath = `${dir}/components.min.js`;
  const onlyComponentsPath = `${dir}/only.components.min.js`;
  const livereloadPlugin = (0, _rollupPluginLivereload.default)({
    watch: ['src/**', `${dir}/**`],
    exts: ['js', 'less', 'svg', 'png', 'jpg', 'gif', 'css'],
    applyCSSLive: true,
    delay: 1000
  });
  const polyInputs = ['node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js', 'node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js'];
  let plugins = [(0, _rollupPluginNodeResolve.default)(), (0, _rollupPluginLess.default)({
    plugins: [autoprefixPlugin, cleanCSSPlugin]
  }), (0, _rollupPluginMultiEntry.default)(), (0, _rollupPluginBabel.default)(_util.babelConfig), (0, _rollupPluginCleanup.default)()];
  let minPlugins = [(0, _rollupPluginMultiEntry.default)(), (0, _rollupPluginTerser.terser)(_util.terserConfig), (0, _rollupPluginCleanup.default)(), (0, _rollupPluginNodeResolve.default)()];

  if (!options.from) {
    minPlugins.push((0, _rollupPluginFilesize.default)());
  }

  if (options.from && options.from === 'serve' && options.watch && options.reload) {
    plugins.push(livereloadPlugin);
  }

  if (options.from && options.from === 'analysis' && options.plugins) {
    plugins = [...plugins, ...options.plugins, (0, _rollupPluginTerser.terser)(_util.terserConfig)];
  }

  console.log('Building files...'); // Build polyfill.js

  await (0, _rollup.default)(polyInputs, polyfillPath, {}, [(0, _rollupPluginMultiEntry.default)(), (0, _rollupPluginNodeResolve.default)(), (0, _rollupPluginDelete.default)({
    targets: `${dir}/**`
  })]); // Build component.js

  await (0, _rollup.default)([`${cliPath}/lib/runtime.js`, 'src/**/component.js'], componentsPath, options, plugins); // Build components.min.js

  await (0, _rollup.default)([polyfillPath, componentsPath], mergedComponentsPath, {}, minPlugins); // Build components.only.min.js

  await (0, _rollup.default)(componentsPath, onlyComponentsPath, {}, [(0, _rollupPluginTerser.terser)(_util.terserConfig), (0, _rollupPluginCleanup.default)(), (0, _rollupPluginNodeResolve.default)()]);
  await (0, _build.copyFiles)(config, dir);
  const styles = await (0, _build.createStyles)(config, [autoprefixPlugin, cleanCSSPlugin]);

  if (options.from && options.from === 'serve') {
    (0, _build.watchStyles)(config, [autoprefixPlugin, cleanCSSPlugin]);
  }

  const name = await (0, _build.createModule)(config, styles, dir); // Build {name}.min.js module

  await (0, _rollup.default)(`${dir}/${name}.js`, `${dir}/${name}.min.js`, {}, [(0, _rollupPluginTerser.terser)(_util.terserConfig), ...plugins]);
  console.log('Finished building files...');

  if (!options.from) {
    process.exit(0);
    return;
  }
};

exports.default = _default;