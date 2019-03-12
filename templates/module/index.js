(function () {

  _INSERT_ES5_ADAPTER_

  function getRoot() {
    const scripts = document.getElementsByTagName('script');
    const lastScript = scripts[scripts.length - 1].src;
    const list = lastScript.match(new RegExp('https?://[^/]*'))

    return list && list[0] || '';
  };

  const root = getRoot() + "/";

  window.WebComponents = window.WebComponents || {};
  window.WebComponents.root = root;

  _INSERT_WEBCOMPONENT_LOADER_

  //_INLINE_STYLES_

  window.addEventListener('WebComponentsReady', function() {

    _INSERT_COMPONENT_JS_
  });

}());
