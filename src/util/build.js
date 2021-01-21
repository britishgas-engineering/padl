import fs from 'fs-extra';
import lesscss from 'less';
import chokidar from 'chokidar';
import path from 'path';
import {getRightPathLocation} from './';

const watchStyles = (config, plugins) => {
  if (config && config.globalStyle && config.globalStyle.watch) {
    const watcher = chokidar.watch(config.globalStyle.watch, {
      persistent: true
    });

    watcher.on('change', () => {
      createStyles(config, plugins);
    });
  }
};

const copyFiles = (config, dir) => {

  if (config && config.static) {
    console.log('Copying files...');

    return new Promise((resolve) => {
      config.static.forEach((staticDir) => {
        const fileDir = path.join('.', dir, staticDir.split(/[/]+/).pop());

        fs.copySync(staticDir, fileDir);
      });
      resolve();
    });
  }
};

const createStyles = (config, plugins) => {
  if (config && config.globalStyle) {
    return new Promise((resolve) => {
      const cssInput = config.globalStyle.input;
      const cssOutput = config.globalStyle.output;

      lesscss.render(fs.readFileSync(cssInput).toString(), {
          filename: path.resolve(cssInput),
          plugins
      }, function(e, output) {

        if (e) {
          console.error(e);
          return;
        }

        fs.writeFileSync(cssOutput, output.css, 'utf8');

        return resolve(output.css);
      });
    });
  }
};

const createModule = (config, styles, dir) => {

  return new Promise((resolve) => {
    const libraryPath = process.cwd();
    const templatePath = path.join(path.dirname(__filename), '..', '..');
    const webcomponent = path.join('@webcomponents', 'webcomponentsjs');
    const templateIndexPath = path.join(templatePath, 'templates', 'module', 'index.js');
    const name = config.name || JSON.parse(fs.readFileSync(path.join(libraryPath, 'package.json'), 'utf8')).name.replace(/ /g, '-');
    const location = path.join(libraryPath, dir, `${name}.js`);

    fs.copySync(templateIndexPath, location);

    const es5Path = getRightPathLocation(path.join(webcomponent, 'custom-elements-es5-adapter.js'));
    const loaderPath = getRightPathLocation(path.join(webcomponent, 'webcomponents-loader.js'));
    const bundles = getRightPathLocation(path.join(webcomponent, 'bundles'));
    const incPolyPath = path.join(path.dirname(__filename), '..', 'lib', 'includes.js');

    fs.copySync(bundles, `${dir}/bundles`);

    const fileData = fs.readFileSync(location, 'utf8');
    const incPoly = fs.readFileSync(incPolyPath, 'utf8');
    const es5 = `${fs.readFileSync(es5Path, 'utf8')}${incPoly}`;
    const loader = fs.readFileSync(loaderPath, 'utf8');
    const component = fs.readFileSync(path.join(libraryPath, dir, 'only.components.min.js'), 'utf8');
    let cssContent = '';

    if (styles && config.globalStyle && config.globalStyle.inline) {
      const css = styles.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');

      cssContent = `
        const style = document.createElement('style');
        const ref = document.querySelector('script');
        style.innerHTML = "${String.raw`${css}`}";
        style.title = "${name}-styles";
        ref.parentNode.insertBefore(style, ref);
        `;
    }

    const result = fileData
      .replace(/_INSERT_COMPONENT_JS_/g, component)
      .replace(/_INSERT_ES5_ADAPTER_/g, es5)
      .replace(/_INSERT_WEBCOMPONENT_LOADER_/g, loader)
      .replace(/_INSERT_NAME_/g, `${name}.?m?i?n?.js`)
      .replace(/_INLINE_STYLES_/g, cssContent);

    fs.writeFileSync(location, result, 'utf8');

    return resolve(name);
  });
};

export {
  copyFiles,
  createStyles,
  createModule,
  watchStyles
}
