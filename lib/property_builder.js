var utils    = require(__dirname + '/utilities');
var _        = require('lodash');
var mongoose = require('mongoose');

var Schema   = mongoose.Schema;

//
//  Binds prototype functions for building a schema property
//  Each prototype function returns an instance of the property
//

module.exports = PropertyBuilder;
function PropertyBuilder (propName, strict) {

  // internal property constructor;
  function Property () {
    this.data = {};
  }

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


  Property.prototype.required = function (required) { return this.set('required', ((required === false) ? false : true)); }
  Property.prototype.default  = function (val) { return this.set('default', val); }
  Property.prototype.unique   = function (val) { return this.index('unique', ((val === false) ? false : true)); }
  Property.prototype.enum     = function (values, msg) {
    return this.set('enum', {
      values : values || [],
      message : msg || (propName ? propName + ' does not support `{VALUE}`' : '`{VALUE}` is not supported')
    });
  }


  /////////////////////////////////////////////////////////////////////////////////
  //
  // Validation
  //
  /////////////////////////////////////////////////////////////////////////////////


  // Minimum length
  Property.prototype.min = function (min, msg) {
    return this.validate(msg || (propName ?  propName + ' must be at least ' + min : 'must be at least ' + min), function (value) {

      // Array or String
      if (utils.isString(value) || utils.isArray(value) || utils.isBuffer(value)) {
        return value.length >= min;

      } else if (utils.isDate(value) || utils.isNumber(value)) {
        return value >= min;

      } else if (utils.isObject(value)) {
        return Object.keys(value).length >= min;

      } else {
        return !strict;
      }
    });
  }

  // Maximum minimum
  Property.prototype.max = function (max, msg) {
    return this.validate(msg || (propName ?  propName + ' must be no more than ' + max : 'must be no more than ' + max), function (value) {

      // Array or String
      if (utils.isString(value) || utils.isArray(value) || utils.isBuffer(value)) {
        return value.length <= max;

      } else if (utils.isDate(value) || utils.isNumber(value)) {
        return value <= max;

      } else if (utils.isObject(value)) {
        return Object.keys(value).length <= max;

      } else {
        return !strict;
      }
    });
  }

  // Exact length
  Property.prototype.length = function (length, msg) {
    return this.validate(msg || (propName ?  propName + ' must be exactly ' + length : 'must be exactly ' + length), function (value) {

      // Array or String
      if (utils.isString(value) || utils.isArray(value) || utils.isBuffer(value)) {
        return value.length === length;

      } else if (utils.isObject(value)) {
        return Object.keys(value).length === length;

      } else {
        return !strict;
      }
    });
  }


  //
  // Array
  //


  // sparse
  Property.prototype.sparse = function (enabled, msg) {
    return this.validate(msg || (propName ?  propName + ' cannot have undefined values ' : 'undefined values not allowed'), function (value) {

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
      } else if (strict) {
        isSparse = true;
      }

      return !isSparse;
    });
  }


  //
  // String
  //


  //  Alphanum
  Property.prototype.alphanum = function (msg) {
    return this.validate(msg || (propName ? propName + ' should contain alpha-numeric characters only' : 'alpha-numeric characters only'), function (value) {
      if (utils.isString(value)) {
        return /^[a-z0-9]+$/i.test(value);

      }  else {
        return !strict;
      }
    });
  }


  //  Regex
  Property.prototype.regex = function (regex, msg) {
    return this.validate(msg || (propName ? propName + ' is invalid' : 'invalid value'), function (value) {
      if (utils.isString(value)) {
        return regex.test(value);

      } else {
        return !strict;
      }
    });
  }

  //  Email
  Property.prototype.email = function (msg) {
    return this.validate(msg || (propName ? propName + ' is not a valid email' : 'invalid email'), function (value) {
      if (utils.isString(value)) {
        return utils.regexSet.email.test(value);

      } else {
        return !strict;
      }
    });
  }

  //  Token
  Property.prototype.token = function (msg) {
    return this.validate(msg || (propName ? propName + ' is not a valid token' : 'invalid token'), function (value) {
      if (utils.isString(value)) {
        return utils.regexSet.token.test(value);

      } else {
        return !strict;
      }
    });
  }

  //  Guid
  Property.prototype.guid = function (msg) {
    return this.validate(msg || (propName ? propName + ' is not a valid GUID' : 'invalid GUID'), function (value) {
      if (utils.isString(value)) {
        return utils.regexSet.guid.test(value);

      } else {
        return !strict;
      }
    });
  }

  //  Host name
  Property.prototype.hostname = function (msg) {
    return this.validate(msg || (propName ? propName + ' is not a valid host name' : 'invalid host name'), function (value) {
      if (utils.isString(value)) {
        return utils.regexSet.host.test(value);

      } else {
        return !strict;
      }
    });
  }

  //  Uppercase
  Property.prototype.uppercase = function (msg) {
    return this.validate(msg || (propName ? propName + ' must be upper case' : 'must be upper case'), function (value) {
      if (utils.isString(value)) {
        return value === value.toUpperCase();

      } else {
        return !strict;
      }
    });
  }

  //  Lowercase
  Property.prototype.lowercase = function (msg) {
    return this.validate(msg || (propName ? propName + ' must be lower case' : 'must be lower case'), function (value) {
      if (utils.isString(value)) {
        return value === value.toLowerCase();

      } else {
        return !strict;
      }
    });
  }


  //
  // Number
  //


  // greater than
  Property.prototype.greater = function (greater, msg) {
    return this.validate(msg || (propName ? propName + ' must be greater than ' + greater : 'must be greater than ' + greater), function (value) {
      if (utils.isNumber(value)) {
        return value > greater;

      } else {
        return !strict;
      }
    });
  }

  // Less than
  Property.prototype.less = function (less, msg) {
    return this.validate(msg || (propName ? propName + ' must be less than ' + less : 'must be less than ' + less), function (value) {
      if (utils.isNumber(value)) {
        return value < less;

      } else {
        return !strict;
      }
    });
  }

  // Integer
  Property.prototype.integer = function (msg) {
    return this.validate(msg || (propName ? propName + ' must be an integer' : 'must be an integer'), function (value) {
      if (utils.isNumber(value)) {
        return (value === parseInt(value, 10));

      } else {
        return !strict;
      }
    });
  }



  /////////////////////////////////////////////////////////////////////////////////
  //
  // Helpers and return
  //
  /////////////////////////////////////////////////////////////////////////////////


  Property.prototype.set = function (name, val) {
    if (!name) { return; }
    this.data[name] = val;
    return this;
  }

  Property.prototype.validate = function (msg, func) {
    var validator = {
      msg       : msg,
      validator : func
    };

    if (this.data.validate) {
      this.data.validate.push(validator);
    } else {
      this.data.validate = [validator];
    }

    return this;
  }

  Property.prototype.index = function (key, value) {
    if (this.data.index) {
      this.data.index[key] = value;
    } else {
      this.data.index = {}
      this.data.index[key] = value;
    }

    return this;
  }

  Property.prototype.fin = function () {
    if (!(this.data && this.data.type)) {
      throw new Error('No type set for schema property ' + propName);
    } else {
      return this.data;
    }
  }

  //
  // return a newinstance of Property
  //
  return new Property();
}
