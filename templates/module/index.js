_INSERT_ES5_ADAPTER_

(function () {
  var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},asyncToGenerator=function(e){return function(){var c=e.apply(this,arguments);return new Promise(function(u,i){return function t(e,n){try{var o=c[e](n),r=o.value}catch(e){return void i(e)}if(!o.done)return Promise.resolve(r).then(function(e){t("next",e)},function(e){t("throw",e)});u(r)}("next")})}},classCallCheck=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},createClass=function(){function o(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(e,t,n){return t&&o(e.prototype,t),n&&o(e,n),e}}(),inherits=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},possibleConstructorReturn=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t};


  if (!Array.from) {
    Array.from = (function () {
      var toStr = Object.prototype.toString;
      var isCallable = function (fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };
      var toInteger = function (value) {
        var number = Number(value);
        if (isNaN(number)) { return 0; }
        if (number === 0 || !isFinite(number)) { return number; }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };
      var maxSafeInteger = Math.pow(2, 53) - 1;
      var toLength = function (value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };

      // The length property of the from method is 1.
      return function from(arrayLike/*, mapFn, thisArg */) {
        // 1. Let C be the this value.
        var C = this;

        // 2. Let items be ToObject(arrayLike).
        var items = Object(arrayLike);

        // 3. ReturnIfAbrupt(items).
        if (arrayLike == null) {
          throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }

        // 4. If mapfn is undefined, then let mapping be false.
        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;
        if (typeof mapFn !== 'undefined') {
          // 5. else
          // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          }

          // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
          if (arguments.length > 2) {
            T = arguments[2];
          }
        }

        // 10. Let lenValue be Get(items, "length").
        // 11. Let len be ToLength(lenValue).
        var len = toLength(items.length);

        // 13. If IsConstructor(C) is true, then
        // 13. a. Let A be the result of calling the [[Construct]] internal method
        // of C with an argument list containing the single item len.
        // 14. a. Else, Let A be ArrayCreate(len).
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);

        // 16. Let k be 0.
        var k = 0;
        // 17. Repeat, while k < len… (also steps a - h)
        var kValue;
        while (k < len) {
          kValue = items[k];
          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        // 18. Let putStatus be Put(A, "length", len, true).
        A.length = len;
        // 20. Return A.
        return A;
      };
    }());
  }

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
  var host = "_INSERT_HOSTNAME_";

  window.WebComponents = window.WebComponents || {};
  window.WebComponents.root = host || root;

  _INSERT_WEBCOMPONENT_LOADER_

  window.addEventListener('WebComponentsReady', function() {
    //_INLINE_STYLES_
    _INSERT_COMPONENT_JS_
  });

}());
