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



  Property.prototype.required = function (required) { return this.set('required', ((required === false) ? false : true)); }
  Property.prototype.default  = function (val) { return this.set('type', val); }
  Property.prototype.enum     = function (val) { return this.set('enum', val); }
  Property.prototype.unique   = function (val) { return this.set('type', ((val === false) ? false : true)); }


  /////////////////////////////////////////////////////////////////////////////////
  //
  // Validation
  //
  /////////////////////////////////////////////////////////////////////////////////


// sparse - if enabled, allow undefined falues, otherwise restrict them
//
Property.prototype.sparse = function (enabled, msg) {
  return this.validator(msg || propName + ' cannot have undefiend values', function (value) {

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
Property.prototype.includes = function (type, msg) {

}
Property.prototype.excludes = function (type, msg) {

}

Property.prototype.min = function (min, msg) {
  return this.validator(msg || (propName + ' must be at least ' + min), function (value) {

    // Array or String
    if (utils.isString(value) || utils.isArray(value)) {
      return value.length >= min;
    }

    return true;
  });
}

Property.prototype.max = function (max, msg) {
  return this.validator(msg || (propName + ' must be less than ' + max), function (value) {

    // Array or String
    if (utils.isString(value) || utils.isArray(value)) {
      return value.length <= max;
    }

    return true;
  });
}

Property.prototype.length = function (length, msg) {
  return this.validator(msg || (propName + ' must be exactly ' + length), function (value) {

    // Array or String
    if (utils.isString(value) || utils.isArray(value)) {
      return value.length === length;
    }

    return true;
  });
}

Property.prototype.unique = function (msg) {

}

  //  alphanum
  //
  Property.prototype.alphanum = function (msg) {
    return this.validator({
      msg       : msg || propName + ' should contain alpha-numeric characters only',
      validator : function (value) {
        return /^[a-z0-9]+$/i.test(value);
      }
    });
  },

  //  isLength - expect ([min, max])
  //
  Property.prototype.isLength = function (minmax, msg) {
    if (!minmax) {
      return this;

    // array of one
    } else if (minmax.length === 1) {
      minmax = [minmax[0], minmax[0]];

    // individual value
    } else if (!minmax.length) {
      vaminmaxl = [minmax, minmax];
    }

    return this.validator({
      msg       : msg || propName + ' should be between ' + val[0] + ' and ' + val[1] + ' characters',
      validator : function (value) {
        return value && value.length >= minmax[0] && value.length <= minmax[1];
      }
    });
  },

  // minLength - expect (min)
  //
  Property.prototype.minLength = function (val, msg) {
    return this.validator({
      msg       : msg || propName + ' should be more than ' + val + ' characters',
      validator : function (value) {
        return value && value.length >= val;
      }
    });
  },

  // maxLength - expect (max)
  //
  Property.prototype.maxLength = function (val, msg) {
    return this.validator({
      msg       : msg || propName + ' should be between ' + val + ' characters',
      validator : function (value) {
        return value && value.length <= val;
      }
    });
  },

  Property.prototype.matches = function (regEx, msg) {
    return this.validator({
      validator : 'matches',
      arguments : regEx,
      message   : msg || propName + ' invalid'
    });
  }

  Property.prototype.validator = function (msg, func) {
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
