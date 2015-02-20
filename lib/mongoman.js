var mongoose        = require('mongoose');
var _               = require('lodash');
var PropertyBuilder = require('./property_builder');
var utils           = require(__dirname + '/utilities');

var Schema = mongoose.Schema;

/////////////////////////////////////////////////////////////////////////////////
//
// Initialization
//
/////////////////////////////////////////////////////////////////////////////////

var config = {
  defaults : {
    strict : true
  }
}

// bind the default function to return a property builder
//
var mongoman = function (popertyName) {
  return new PropertyBuilder(popertyName, config.strict);
}

/////////////////////////////////////////////////////////////////////////////////
//
// Base Properties
//
/////////////////////////////////////////////////////////////////////////////////


mongoman.mongoose = mongoman.goose = mongoose;

// set custom configuration
//
mongoman.configure = function (options) {
  config = _.defaults(options, config.defaults);
}

// require a tree of js files to aid in model registration
//
mongoman.registerAll = function (path, regEx) {
  // recursive tree for requiring content which matches regex
  (function traverseSubtree (currentLeaf, currentPath) {
    currentLeaf = currentLeaf || {};

    // for the current leaf, iterate over its contents
    _.each(utils.getDirContents(currentPath), function (content) {
      currentLeaf[content.name] = currentLeaf[content.name] || {};

      // if this is is a file, require it
      var passesFilter = !regEx || (regEx.test(content.name));
      if (content.isJs && passesFilter) {
        require(content.path + '/' + content.name);

      // if it's a directory, recurse
      } else if (!content.isFile) {
        traverseSubtree(_.clone(currentLeaf[content.name], true), content.path + '/' + content.name);
      }
    });
  }(null,  path));
}


// register a model with the given schema
//
mongoman.register = function (name, schema, options) {

  var newSchema = new Schema(schema, options || { strict: true });

  if (_.isObject(options)) {

    // bind index
    //
    if (_.isObject(options.index)) {
      newSchema.index(options.index);
    }

    // bind virtuals
    //
    if (_.isObject(options.virtuals)) {
      _.each(options.virtuals, function (virtual, key) {
        if (virtual) {
          if (_.isFunction(virtual.get)) { newSchema.virtual(key).get(virtual.get); }
          if (_.isFunction(virtual.set)) { newSchema.virtual(key).set(virtual.set); }
        }
      });
    }

    // bind middleware
    //
    if (_.isObject(options.middleware)) {
      if (_.isObject(options.middleware.pre)) {
        _.each(options.middleware.pre, function (preFunc, trigger) {
          if (_.isFunction(preFunc)) {
            newSchema.pre(trigger, preFunc);
          }
        });
      }

      if (_.isObject(options.middleware.post)) {
        _.each(options.middleware.post, function (postFunc, trigger) {
          if (_.isFunction(postFunc)) {
            newSchema.post(trigger, postFunc);
          }
        });
      }
    }

    // bind methods
    //
    if (_.isObject(options.methods)) {
      newSchema.methods = options.methods;
    }

    // bind statics
    //
    if (_.isObject(options.statics)) {
      newSchema.statics = options.statics;
    }
  }


  return mongoose.model(name, newSchema);
}

mongoman.drop = function (collection) {
  if (mongoman.mongoose.connection[collection]) {
    mongoman.mongoose.connection[collection].dropDatabase();
  }
}

// generate a new schema
//
mongoman.connect = function (options) {
  mongoman.db = mongoose.connect(options || 'mongodb://localhost/database');
  return mongoman.db;
}

// generate a new schema
//
mongoman.schema = function (schema) {
  return new mongoose.Schema(schema);
}

// get the model object
//
mongoman.model = function (name) {
  return mongoose.model(name);
}

// get a new model
//
mongoman.new = function (name, inputs) {
  var Model =  mongoose.model(name);
  return new Model(inputs);
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
