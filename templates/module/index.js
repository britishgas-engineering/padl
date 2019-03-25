(function () {
  var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj};var asyncToGenerator=function(fn){return function(){var gen=fn.apply(this,arguments);return new Promise(function(resolve,reject){function step(key,arg){try{var info=gen[key](arg);var value=info.value}catch(error){reject(error);return}if(info.done){resolve(value)}else{return Promise.resolve(value).then(function(value){step("next",value)},function(err){step("throw",err)})}}return step("next")})}};var classCallCheck=function(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}};var createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i+=1){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor){descriptor.writable=true}Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps){defineProperties(Constructor.prototype,protoProps)}if(staticProps){defineProperties(Constructor,staticProps)}return Constructor}}();var inherits=function(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass){Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}}var possibleConstructorReturn=function(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return call&&(typeof call==="object"||typeof call==="function")?call:self};

  if(!Array.from){Array.from=(function(){var toStr=Object.prototype.toString;var isCallable=function(fn){return typeof fn==='function'||toStr.call(fn)==='[object Function]'};var toInteger=function(value){var number=Number(value);if(isNaN(number)){return 0}if(number===0||!isFinite(number)){return number}return(number>0?1:-1)*Math.floor(Math.abs(number))};var maxSafeInteger=Math.pow(2,53)-1;var toLength=function(value){var len=toInteger(value);return Math.min(Math.max(len,0),maxSafeInteger)};return function from(arrayLike ){var C=this;var items=Object(arrayLike);if(arrayLike==null){throw new TypeError("Array.from requires an array-like object - not null or undefined")}var mapFn=arguments.length>1?arguments[1]:void undefined;var T;if(typeof mapFn!=='undefined'){if(!isCallable(mapFn)){throw new TypeError('Array.from: when provided, the second argument must be a function')}if(arguments.length>2){T=arguments[2]}}var len=toLength(items.length);var A=isCallable(C)?Object(new C(len)):[len];var k=0;var kValue;while(k<len){kValue=items[k];if(mapFn){A[k]=typeof T==='undefined'?mapFn(kValue,k):mapFn.call(T,kValue,k)}else{A[k]=kValue}k+=1}A.length=len;return A}}())}

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
