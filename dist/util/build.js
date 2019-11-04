"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.watchStyles = exports.createModule = exports.createStyles = exports.copyFiles = void 0;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _less = _interopRequireDefault(require("less"));

var _chokidar = _interopRequireDefault(require("chokidar"));

var _path = _interopRequireDefault(require("path"));

var _ = require("./");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const watchStyles = (config, plugins) => {
  if (config && config.globalStyle && config.globalStyle.watch) {
    const watcher = _chokidar.default.watch(config.globalStyle.watch, {
      persistent: true
    });

    watcher.on('change', () => {
      createStyles(config, plugins);
    });
  }
};

exports.watchStyles = watchStyles;

const copyFiles = (config, dir) => {
  if (config && config.static) {
    console.log('Copying files...');
    return new Promise(resolve => {
      config.static.forEach(staticDir => {
        const fileDir = _path.default.join('.', dir, staticDir.split(/[/]+/).pop());

        _fsExtra.default.copySync(staticDir, fileDir);
      });
      resolve();
    });
  }
};

exports.copyFiles = copyFiles;

const createStyles = (config, plugins) => {
  if (config && config.globalStyle) {
    return new Promise(resolve => {
      const cssInput = config.globalStyle.input;
      const cssOutput = config.globalStyle.output;

      _less.default.render(_fsExtra.default.readFileSync(cssInput).toString(), {
        filename: _path.default.resolve(cssInput),
        plugins
      }, function (e, output) {
        _fsExtra.default.writeFileSync(cssOutput, output.css, 'utf8');

        return resolve(output.css);
      });
    });
  }
};

exports.createStyles = createStyles;

const createModule = (config, styles, dir) => {
  return new Promise(resolve => {
    const libraryPath = process.cwd();

    const templatePath = _path.default.join(_path.default.dirname(__filename), '..', '..');

    const webcomponent = _path.default.join('@webcomponents', 'webcomponentsjs');

    const templateIndexPath = _path.default.join(templatePath, 'templates', 'module', 'index.js');

    const name = config.name || JSON.parse(_fsExtra.default.readFileSync(_path.default.join(libraryPath, 'package.json'), 'utf8')).name.replace(/ /g, '-');

    const location = _path.default.join(libraryPath, dir, `${name}.js`);

    _fsExtra.default.copySync(templateIndexPath, location);

    const es5Path = (0, _.getRightPathLocation)(_path.default.join(webcomponent, 'custom-elements-es5-adapter.js'));
    const loaderPath = (0, _.getRightPathLocation)(_path.default.join(webcomponent, 'webcomponents-loader.js'));

    const fileData = _fsExtra.default.readFileSync(location, 'utf8');

    const es5 = _fsExtra.default.readFileSync(es5Path, 'utf8');

    const loader = _fsExtra.default.readFileSync(loaderPath, 'utf8');

    const component = _fsExtra.default.readFileSync(_path.default.join(libraryPath, dir, 'only.components.min.js'), 'utf8');

    let cssContent = '';

    if (styles) {
      const css = styles.replace(/"/g, "'").replace(/\\/g, '\\\\');
      cssContent = `
        const style = document.createElement('style');
        const ref = document.querySelector('script');
        style.innerHTML = "${css}";
        ref.parentNode.insertBefore(style, ref);
        `;
    }

    const result = fileData.replace(/_INSERT_ES5_ADAPTER_/g, es5).replace(/_INSERT_WEBCOMPONENT_LOADER_/g, loader).replace(/_INSERT_COMPONENT_JS_/g, component).replace(/_INSERT_NAME_/g, `${name}.?m?i?n?.js`).replace(/_INLINE_STYLES_/g, cssContent);

    _fsExtra.default.writeFileSync(location, result, 'utf8');

    return resolve(name);
  });
};

exports.createModule = createModule;