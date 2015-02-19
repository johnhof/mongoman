var _  = require('lodash');
var fs = require('fs');


//
// Type checking
//

exports.isString = function (target) { return (typeof target === 'string');}
exports.isObject = function (target) { return (typeof target === 'object'); }
exports.isArray  = function (target) { return (target && target.constructor === Array); }
exports.isNumber = function (target) { return (typeof target === 'number'); }
exports.isDate   = function (target) { return (target instanceof Date); }
exports.isBuffer = function (target) { return (target instanceof Buffer); }
exports.isBool   = function (target) { return (target === false || target === true); }
exports.isFunc   = function (target) { return (typeof target=== 'function'); }


//
// Regex's
//


exports.regexSet = {
  email : /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
  token : /^[\w\-]+$/,
  guid  : /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  host  : /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/,
  url   : /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/i
}


//
// Misc Utilities
//


// returns the an array of directories and an array of files from an directory
exports.getDirContents = function (path) {
  var results = _.map(fs.readdirSync(path) || [], function (content) {
    if (!content) return;

    var match  = content.match(/(.*?)(\..*)$/) || []
    var result = {
      string    : path + '/' + content,
      name      : match[1] || content,
      path      : path,
      extension : match[2] || null,
      isJs      : /\.js$/.test(content),
      isFile    : !fs.statSync(path + '/' + (match[1] || content) + (match[2] || '')).isDirectory()
    };

    return result;
  });

  return results;
}