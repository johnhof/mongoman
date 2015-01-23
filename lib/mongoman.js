var mongoose        = require('mongoose');
var _               = require('lodash');
var PropertyBuilder = require('./property_builder')

var Schema = mongoose.Schema;

/////////////////////////////////////////////////////////////////////////////////
//
// Initialization
//
/////////////////////////////////////////////////////////////////////////////////

var config = {
  defaults : {}
}

// bind the default function to return a property builder
//
var mongoman = function (popertyName) {
  return new PropertyBuilder(popertyName);
}

/////////////////////////////////////////////////////////////////////////////////
//
// Base Properties
//
/////////////////////////////////////////////////////////////////////////////////


// set custom configuration
//
mongoman.configure = function (options) {
  config = _.defaults(options, config);
}

// register a model with the given schema
//
mongoman.register = function (name, schema, options) {
  if (options) {

    // bind index
    //
    if (options.index) {
      newSchema.index = options.index;
      delete options.index;
    }

    // bind virtuals
    //
    if (utils.isArray(options.virtuals)) {
      _.each(options.virtuals, function (virtual, key) {
        if (virtual) {
          var newVirtual = newSchema.virtual(key);
          (typeof virtual.get === 'function') ? newVirtual.get(virtual.get) : newSchema;
          (typeof virtual.set === 'function') ? newVirtual.set(virtual.set) : newSchema;
        }
      });

      delete options.virtuals;
    }

    // bind middleware
    //
    if (utils.isArray(options.middleware)) {
      _.each(options.middleware, function (props, trigger) {
        if (trigger) {
          if (typeof props.pre === 'function') { newSchema.pre(trigger, props.pre); }
          if (typeof props.post === 'function') { newSchema.post(trigger, props.post); }
        }
      });

      delete options.middleware;
    }

    // bind methods
    //
    if (utils.isArray(options.methods)) {
      _.each(options.methods, function (func, name) {
        if (name && typeof func === 'function') { newSchema.methods[name] = func; }
      });

      delete options.methods;
    }

    // bind statics
    //
    if (utils.isArray(options.statics)) {
      _.each(options.statics, function (func, name) {
        if (name && typeof func === 'function') { newSchema.statics[name] = func;  }
      });

      delete options.statics;
    }
  }

  var newSchema = new Schema(schema, options || { strict: true });

  return mongoose.model(name, newSchema);
}

// generate a new schema
//
mongoman.connect = function (options) {
  return mongoose.connect(options || 'mongodb://localhost/database');
}

// generate a new schema
//
mongoman.schema = function (schema) {
  return new mongoose.Schema(schema);
}

// get a model
//
mongoman.model = function (name, inputs) {
  return mongoose.model(name);
}

// save a model
//
mongoman.save = function (modelName, inputs, errorHandler, successHandler) {
  var Model = mongoman.model(modelName);
  var newModel = new Model(inputs);

  return newModel.save(function (error, result) {
    if (error) {
      return errorHandler(error, result);
    } else {
      successHandler(result);
    }
  })
}

module.exports = mongoman;
