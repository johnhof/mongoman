var utils = require(__dirname + '/utilities');

//
//  Binds prototype functions for building a schema property
//  Each prototype function returns an instance of the property
//

module.exports = PropertyBuilder;
function PropertyBuilder (propName) {
  // internal property constructor;
  function Property () {}

  Property.prototype = { constructor : Property };

  Property.prototype.string   = function () { return this.set('type', String); }
  Property.prototype.date     = function () { return this.set('type', Date); }
  Property.prototype.number   = function () { return this.set('type', Number); }
  Property.prototype.buffer   = function () { return this.set('type', Buffer); }
  Property.prototype.boolean  = function () { return this.set('type', Boolean); }
  Property.prototype.mixed    = function () { return this.set('type', Schema.Types.Mixed); }
  Property.prototype.objectId = function () { return this.set('type', Schema.Types.ObjectId); }
  Property.prototype.array    = function (type) { return this.set('type', type ? [type] : Array); }


  /////////////////////////////////////////////////////////////////////////////////
  //
  // Misc
  //
  /////////////////////////////////////////////////////////////////////////////////



  Property.prototype.require   = function (required) { return this.set('required', ((required === false) ? false : true)); }
  Property.prototype.defaultTo = function (val) { return this.set('type', val); }
  Property.prototype.enum      = function (val) { return this.set('enum', val); }
  Property.prototype.unique    = function (val) { return this.set('unique', ((val === false) ? false : true)); }


  /////////////////////////////////////////////////////////////////////////////////
  //
  // Validation
  //
  /////////////////////////////////////////////////////////////////////////////////


  // sparse
  Property.prototype.sparse = function (enabled, msg) {
    return this.val(msg || propName + ' cannot have undefiend values', function (value) {

      // if sparse is enabled, return true
      if (enabled) {
        return true;
      }

      var isSparse = false;

      // only worry about arrays
      if (utils.isArray(value)) {
        _.each(value, function (val, index) {
          if (val === undefined) {
            isSparse = true;
            return false;
          }
        });
      }

      return isSparse;
    });
  }

  // Minimum length
  Property.prototype.min = function (min, msg) {
    return this.val(msg || (propName + ' must be at least ' + min), function (value) {

      // Array or String
      if (utils.isString(value) || utils.isArray(value) || utils.isBuffer(value)) {
        return value.length >= min;

      } else if (utils.isDate(value) || utils.isNumber(value)) {
        return value >= min;

      } else if (utils.isObject(value)) {
        return Object.keys(value).length >= min;
      }

      return true;
    });
  }

  // Maximum minimum
  Property.prototype.max = function (max, msg) {
    return this.val(msg || (propName + ' must no more than than ' + max), function (value) {

      // Array or String
      if (utils.isString(value) || utils.isArray(value) || utils.isBuffer(value)) {
        return value.length <= max;

      } else if (utils.isDate(value) || utils.isNumber(value)) {
        return value <= max;

      } else if (utils.isObject(value)) {
        return Object.keys(value).length >= max;
      }


      return true;
    });
  }

  // Exact length
  Property.prototype.length = function (length, msg) {
    return this.val(msg || (propName + ' must be exactly ' + length), function (value) {

      // Array or String
      if (utils.isString(value) || utils.isArray(value) || utils.isBuffer(value)) {
        return value.length === length;

      } else if (utils.isObject(value)) {
        return Object.keys(value).length === length;
      }

      return true;
    });
  }


  //
  // String
  //


  //  Alphanum
  Property.prototype.alphanum = function (msg) {
    return this.val(msg || propName + ' should contain alpha-numeric characters only', function (value) {
      if (utils.isString(value)) {
        return /^[a-z0-9]+$/i.test(value);
      }

      return true;
    });
  }


  //  Regex
  Property.prototype.regex = function (regex, msg) {
    return this.val(msg || propName + ' is invalid', function (value) {
      if (utils.isString(value)) {
        return regex.test(value);
      }

      return true;
    });
  }

  //  Email
  Property.prototype.email = function (msg) {
    return this.val(msg || propName + ' is not a valid email', function (value) {
      if (utils.isString(value)) {
        return utils.regexSet.email.test(value);
      }

      return true;
    });
  }

  //  Token
  Property.prototype.token = function (msg) {
    return this.val(msg || propName + ' is not a valid email', function (value) {
      if (utils.isString(value)) {
        return utils.regexSet.token.test(value);
      }

      return true;
    });
  }

  //  Guid
  Property.prototype.guid = function (msg) {
    return this.val(msg || propName + ' is not a valid GUID', function (value) {
      if (utils.isString(value)) {
        return utils.regexSet.guid.test(value);
      }

      return true;
    });
  }

  //  Host name
  Property.prototype.hostname = function (msg) {
    return this.val(msg || propName + ' is not a valid host name', function (value) {
      if (utils.isString(value)) {
        return utils.regexSet.host.test(value);
      }

      return true;
    });
  }

  //  Uppercase
  Property.prototype.uppercase = function (msg) {
    return this.val(msg || propName + ' is not uppercase', function (value) {
      if (utils.isString(value)) {
        return value === value.toUpperCase();
      }

      return true;
    });
  }

  //  Lowercase
  Property.prototype.lowercase = function (msg) {
    return this.val(msg || propName + ' is not lowercase', function (value) {
      if (utils.isString(value)) {
        return value === value.toLowerCase();
      }

      return true;
    });
  }


  //
  // Number
  //


  // greater than
  Property.prototype.greater = function (greater, msg) {
    return this.val(msg || (propName + ' must be greater than ' + greater), function (value) {
      if (utils.isNumber(value)) {
        return value > less;
      }

      return true;
    });
  }

  // Less than
  Property.prototype.less = function (less, msg) {
    return this.val(msg || (propName + ' must be less than ' + less), function (value) {
      if (utils.isNumber(value)) {
        return value < less;
      }

      return true;
    });
  }

  // Integer
  Property.prototype.integer = function (msg) {
    return this.val(msg || (propName + ' must be an integer'), function (value) {
      if (utils.isNumber(value)) {
        return (value === parseInt(value, 10));
      }

      return true;
    });
  }


  //
  // Buffer
  //


  // Buffer encoding
  Property.prototype.encoding = function (encoding, msg) {
    return this.val(msg || (propName + ' must be less than ' + max), function (value) {
      if (utils.isBuffer(value)) {
        return value.isEncoding(encoding)
      } else {
        return true;
      }
    });
  }


  //
  // Generic
  //


  Property.prototype.val = function (msg, func) {
    var validator = {
      msg       : msg,
      validator : func
    };

    if (this.validate) {
      this.validate.push(validator);
    } else {
      this.validate = [validator];
    }

    return this;
  }


  /////////////////////////////////////////////////////////////////////////////////
  //
  // Helpers and return
  //
  /////////////////////////////////////////////////////////////////////////////////

  Property.prototype.set = function (name, val) {
    if (!name) { return; }
    this[name] = val;
    return this;
  }

  //
  // return a newinstance of Property
  //

  return new Property();
}
