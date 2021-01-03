if (process.env.NODE_ENV === 'development') {
  require('../dist/polyfill.js');
  require('../dist/components.js');
} else {
  require('../dist/REPO_NAME.min.js');
}
