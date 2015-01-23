
//
// Type checking
//

module.exports.isString = function (target) { return (Object.prototype.toString.call(target) === '[object Array]');}
module.exports.isObject = function (target) { return (typeof test === 'object'); }
module.exports.isArray  = function (target) { return (variable && variable.constructor === Array); }
module.exports.isNumber = function (target) { return (typeof target === 'number'); }
module.exports.isDate   = function (target) { return (test instanceof Date); }
module.exports.isBool   = function (target) { return (target === false || target === true); }