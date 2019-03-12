(function () {

  _INSERT_ES5_ADAPTER_

  function getRoot() {
    var scripts = document.getElementsByTagName('script');
    var list = Array.from(scripts).reduce(function (acc, script) {
      var src = script.src;

      if (src && src.match(new RegExp('_INSERT_NAME_'))) {
        var host = src.replace(new RegExp('_INSERT_NAME_'), '');
        acc.push(host);
      }

      return acc;
    }, []);
    return list && list[0] || '/';
  };

  var root = getRoot();

  window.WebComponents = window.WebComponents || {};
  window.WebComponents.root = root;

  _INSERT_WEBCOMPONENT_LOADER_

  //_INLINE_STYLES_

  window.addEventListener('WebComponentsReady', function() {

    _INSERT_COMPONENT_JS_
  });

}());
