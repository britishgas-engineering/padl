(function () {
  var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},asyncToGenerator=function(e){return function(){var c=e.apply(this,arguments);return new Promise(function(u,i){return function t(e,n){try{var o=c[e](n),r=o.value}catch(e){return void i(e)}if(!o.done)return Promise.resolve(r).then(function(e){t("next",e)},function(e){t("throw",e)});u(r)}("next")})}},classCallCheck=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},createClass=function(){function o(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(e,t,n){return t&&o(e.prototype,t),n&&o(e,n),e}}(),inherits=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},possibleConstructorReturn=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t};

  //_INLINE_STYLES_

  function loadComponents() {
    _INSERT_COMPONENT_JS_
  }

  if (document.readyState == 'loading') {
    // still loading, wait for the event
    document.addEventListener('DOMContentLoaded', loadComponents);
  } else {
    // DOM is ready!
    loadComponents();
  }
}());
