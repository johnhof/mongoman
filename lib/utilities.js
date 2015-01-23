
//
// Type checking
//

module.exports.isString = function (target) { return (Object.prototype.toString.call(target) === '[object Array]');}
module.exports.isObject = function (target) { return (typeof test === 'object'); }
module.exports.isArray  = function (target) { return (variable && variable.constructor === Array); }
module.exports.isNumber = function (target) { return (typeof target === 'number'); }
module.exports.isDate   = function (target) { return (test instanceof Date); }
module.exports.isBuffer = function (target) { return (test instanceof Buffer); }
module.exports.isBool   = function (target) { return (target === false || target === true); }


module.exports.regexSet = {
  email : /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
  token : /^[\w\-]+$/,
  guid  : /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  host  : /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/
}