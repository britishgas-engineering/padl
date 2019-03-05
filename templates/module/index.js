/*
  - Bundles need to be added to folder
  - Inline styles (but needs to be an option in .padl)
  - Babel to es5 and compress
  - REPO_NAME
 */

(function () {

  /* */
  /* */
  /* ADD ES5 ADAPTER */
  /* */
  /* */

  _INSERT_ES5_ADAPTER_

  const getRoot = () => {
    const scripts = document.getElementsByTagName('script');
    const lastScript = scripts[scripts.length - 1].src;
    const list = lastScript.match(new RegExp('https?://[^/]*'))

    return list && list[0] || '';
  };

  const root = `${getRoot()}/`;

  window.WebComponents = window.WebComponents || {};
  window.WebComponents.root = root;

  /* */
  /* */
  /* ADD WEBCOMPONENT LOADER */
  /* */
  /* */

  _INSERT_WEBCOMPONENT_LOADER_

  //_INLINE_STYLES_

  window.addEventListener('WebComponentsReady', function() {
    /* */
    /* */
    /* ADD ONLY.COMPONENTS.MIN.JS */
    /* */
    /* */
    _INSERT_COMPONENT_JS_
  });

}());
