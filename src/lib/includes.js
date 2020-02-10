(function() {

  ![].includes &&
    (Array.prototype.includes = function(searchElement, fromIndex) {
      "use strict";

      var O = Object(this);
      var len = parseInt(O.length) || 0;
      if (len === 0) return false;
      var n = parseInt(fromIndex) || 0;
      var k;

      for (n >= 0 ? (k = n) : ((k = len + n), k < 0 && (k = 0)); k < len; ) {
        var currentElement = O[k];
        if (
          searchElement === currentElement ||
          (searchElement !== searchElement && currentElement !== currentElement)
        )
          return true;
        k++;
      }

      return false;
    });
})();
