Mongoman
========

[![Build Status](https://travis-ci.org/johnhof/mongoman.svg)](https://travis-ci.org/johnhof/mongoman)

A node utility to simplify schema and model management. Most utility is wrapped around the [mongoose module](http://mongoosejs.com/index.html). If you would like to use mongoman as a replacement for mongoose, mongoose is aliased at both `mon.mongoose` and `mon.goose`

# Key

- [Usage](#usage)
- [Property Builder](#property-builder)
    - [Universal](#universal)
        - [`prop.set(key, value)`](#propsetkey-value)
        - [`prop.validate(errorMsg, valFunction)`](#propvalidateerrormsg-valfunction)
        - [`prop.index(key|value, [value])`](#propindexkeyvalue-value)
    - [Types](#types)
        - [`prop.string()`](#propstring)
        - [`prop.date()`](#propdate)
        - [`prop.number()`](#propnumber)
        - [`prop.buffer()`](#propbuffer)
        - [`prop.mixed()`](#propmixed)
        - [`prop.objectId()`](#propobjectid)
        - [`prop.array()`](#proparray)
        - [`prop.schema()`](#propschemaref-type)
    - [Middleware](#middleware)
        - [Shared](#shared)
            - [`prop.onGet(function)`](#propongetfunction)
            - [`prop.onSet(function)`](#proponsetfunction)
        - [Date](#date)
            - [`expires(dateTime)`](#propexpiresdateTime)
        - [String](#string)
            - [`prop.toUppercase()`](#proptouppercase)
            - [`prop.toLowercase()`](#proptolowercase)
            - [`prop.trim()`](#proptrim)
    - [Validation](#validation)
        - [Shared](#shared)
            - [`prop.required()`](#proprequired)
            - [`prop.default(value)`](#propdefaultvalue)
            - [`prop.select([value])`](#propselectvalue)
            - [`prop.enum(values, [message])`](#propenumvalues-message)
            - [`prop.unique([bool])`](#propuniquebool)
            - [`prop.ref(model)`](#proprefmodel)
            - [`prop.min(value, [message])`](#propminvalue-message)
            - [`prop.max(value, [message])`](#propmaxvalue-message)
            - [`prop.length(value)`](#proplengthvalue-message)
        - [Arrays](#arrays)
            - [`prop.sparse([enables])`](#propsparseenabled)
        - [Strings](#strings)
            - [`prop.alphanum([message])`](#propalphanummessage)
            - [`prop.regex(expression, [message])`](#propregexexpression-message)
            - [`prop.email([message])`](#propemailmessage)
            - [`prop.token([message])`](#proptokenmessage)
            - [`prop.guid([message])`](#propguidmessage)
            - [`prop.hostname([message])`](#prophostnamemessage)
            - [`prop.url([message])`](#propurlmessage)
            - [`prop.uppercase([message])`](#propuppercasemessage)
            - [`prop.lowercase([message])`](#proplowercasemessage)
        - [Numbers](#numbers)
            - [`prop.greater(limit, [message])`](#propgreaterlimit-message)
            - [`prop.less(limit, [message])`](#proplesslimit-message)
            - [`prop.integer([message])`](#propintegermessage)
- [Utilities](#utilities)
    - [`mon.drop(collection)`](#mondropcollection)
    - [`mon.connect([options])`](#monconnectoptions)
    - [`mon.schema(schema)`](#monschemaschema)
    - [`mon.model(modelName)`](#monmodelmodelname)
    - [`mon.new(modelName)`](#monnewmodelname)
    - [`mon.register(schema, [options])`](#monregisterschema-options)
    - [`mon.registerAll(directory, [regex])`](#monregisteralldirectory-regex)
- [Tests](#running-unit-tests)







# Usage


  `npm install mongoman`

  leverage mongoman to cut down on bloat in model creation. For example, this

  ```javascript
  var mongoose = require('mongoose');

  var newSchema = new mongoose.Schema({
    email : {
      type       : String,
      required   : true,
      validation : [{
        msg       : 'invalid email',
        validator : function (value) {
          return /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(value);
        }
      }]
    password : {
      type       : String,
      required   : true,
      validation : [{
        msg       : 'too short',
        validator : function (value) {
          return value.length >= 6
        }
      }]
    }
  });

  mongoose.model('ExampleModel', newSchema);
  ```

  becomes this

  ```javascript
  var mon = require('mongoman');

  mon.register('ExampleModel', {
    email    : mon().string().required().email().fin(),
    password : mon().string().required().min(6).fin()
  });
```

The focus of mongoman is to simplify validation and schema creation. However, I do recommed looking at the [utilities](#utilities) section for some helpful utilities.




# Property Builder







The core use of mongoman is schema creation via property building. To make a new schema, simply use the property builder chain, initiated with `mongoman()` and terminated with `fin()`. For example. a simple user schema might look something like this

```javascript
mon = require('mongoman');

var user = {

  // validates the name to be a required string that fits the regex
  name : mon().string().required().regex(/[a-z]+\s*[a-z+]/i).fin(),

  // sets the registered propert to default tothe current date-time
  registered : mon().date().default(new Date()).fin(),

  // validates the age to be a required integer of at least 18
  age : mon().required().number().integer.min(18).fin()

}
```

Every validation middleware function has a default error, but errors can be augmented to inlude a property name by passing in a value to the `mon()` function call.

``` javascript
mon().email().fin(); // validation error : 'invalid email'
mon('My email').email().fin(); // validation error : 'My email is not a valid email'
```

## Universal

If a property or validation isn't included as a supported chainable function, you can easily include it using the following functions.

### `prop.set(key, value)`

Set the key/value passed in for the property

```javascript
  schema.newProp = mon().set('type', String).fin();
```

### `prop.validate(errorMsg, valFunction)`

Bind the validation function to the property, throwing the error message if it returns false

```javascript
  function isOdd (value) {
    return (value % 2) == 1
  }

  schema.newProp = mon().validate('newProp must be odd', isOdd).fin();
```

### `prop.index(key|value, [value])`

Bind the key and value to the index attribute of the property. Providing only one parameter will set `index` equal to that parameter

```javascript
  schema.newProp = mon().index('unique', false).fin();
  // or
  schema.newProp = mon().index('hashed').fin();

```











# Types



### `prop.string()`

Set property type to `String`

```javascript
  schema.newProp = mon().string().fin();
```

### `prop.date()`

Set property type to `Date`

```javascript
  schema.newProp = mon().date().fin();
```

### `prop.number()`

Set property type to `Number`

```javascript
  schema.newProp = mon().number().fin();
```

### `prop.buffer()`

Set property type to `Buffer`

```javascript
  schema.newProp = mon().buffer().fin();
```

### `prop.mixed()`

Set property type to be mixed

```javascript
  schema.newProp = mon().mixed().fin();
```

### `prop.objectId()`

Set property type to be an object ID

```javascript
  schema.newProp = mon().objectId().fin();
```

### `prop.array()`

Set property type to be `Array`

```javascript
  schema.newProp = mon().array().fin();
```

### `prop.schema(ref, type)`

Set property type to be a reference to another schema

```ref```  -- Required - name of referred schema
```type``` -- Optional - Defaults ```ObjectId```, possible values (```Number```, ```String```, ```Buffer```)

```javascript
  schema.newProp = mon().schema('schemaName').fin();
```

In order to create an array of schemas (enabling populate over numerous objects) follow this pattern:
```javascript
   .array({ type : mon.mongoose.Schema.Types.ObjectId, ref : 'name_of_schema'})
```



# Middleware

Any time `[]` is a function parameter, its is optional.

## Shared

### `prop.onGet(function)`

type: any

Passes the value of the property into the function. the returned value is what is exposed to the document on get

```javascript
  schema.newProp = mon().onGet(function (value) {
    return value ? value + '-example' : value;
  }).fin();
```


### `prop.onSet(function)`

type: any

Passes the value of the property into the function. the returned value is what is saved to the document on get

```javascript
  schema.newProp = mon().onSet(function (value) {
    return value ? value + '-example' : value;
  }).fin();
```




## Date





### `prop.expires(dateTime)`

type: date

Sets the expiration of the date

```javascript
  schema.newProp = mon().expires('1.5h').fin();
```

## String

### `prop.toUppercase()`

type: string

Sets the value to uppercase

```javascript
  schema.newProp = mon().toUppercase().fin();
```

### `prop.toLowercase()`

type: string

Sets the value lowercase

```javascript
  schema.newProp = mon().toLowercase().fin();
```

### `prop.trim()`

type: string

Trims the whitespace off the beginning and end of the string

```javascript
  schema.newProp = mon().trim().fin();
```









# Validation

**important:** using validations that do not apply to the property type will throw an error. To allow them to pass silently, set mongo configuration `strict : false`.

Any time `[]` is a function parameter, its is optional. any time `[message]` is included, a default message will be used unless this parameter is specified.




## Shared




### `prop.required()`

type: any

return an error if the property is not defined

```javascript
  schema.newProp = mon().required().fin();
```

### `prop.default(value)`

type: any

If no value is set for the property, set it to the default value passed in

```javascript
  schema.newProp = mon().default('default value').fin();
```

### `prop.select([bool])`

type: any

`[bool]` true or undefined if this path should always be included in the results, false if it should be excluded by default. This setting can be overridden at the query level.


```javascript
  schema.newProp = mon().select().fin();
```

### `prop.enum(values, [message])`

type: any

If the value submitted is not uncluded in the list of enumerated properties, an error is returned.

```javascript
  schema.newProp = mon().enum(['foo', 'bar'], 'custom error').fin();
```

### `prop.unique([bool])`

type: any

Insures a unique index is generated for the property. defaults to true. False causes the DB to be indifferent

```javascript
  schema.newProp = mon().unique().fin();
```

### `prop.ref(model)`

type: any

Creates a reference to another model. This is used to populate data from another document

```javascript
  schema.newProp = mon().objectId().ref('fooModel').fin();
```

### `prop.min(value, [message])`

type: `string` (length), `array` (length), `number` (value), `date` (value), `object` (keys), `buffer` (length)

Check that the value being saved is greater than or equal to the value passed into the property builder

```javascript
  schema.newProp = mon().min(5).fin();
```

### `prop.max(value, [message])`

type: `string` (length), `array` (length), `number` (value), `date` (value), `object` (keys), `buffer` (length)

Check that the value being saved is less than or equal to the value passed into the property builder

```javascript
  schema.newProp = mon().max(5).fin();
```

### `prop.length(value, [message])`

type: `string` (length), `array` (length), `object` (keys), `buffer` (length)

Check that the value being saved is the same length as the value passed into the property builder

```javascript
  schema.newProp = mon().length(5).fin();
```




## Arrays




### `prop.sparse()`

return an error if the array contains undefined values

```javascript
  schema.newProp = mon().array().sparse().fin();
```




## Strings





### `prop.alphanum([message])`

return an error if the string contains non alpha-numeric values

```javascript
  schema.newProp = mon().string().alphanum().fin();
```

### `prop.regex(expression, [message])`

return an error if the string does not match the expression

```javascript
  schema.newProp = mon().string().regex(expression).fin();
```

### `prop.email([message])`

return an error if the string is not a valid email address

```javascript
  schema.newProp = mon().string().email().fin();
```

### `prop.token([message])`

return an error if the string is not a valid token

```javascript
  schema.newProp = mon().string().token().fin();
```

### `prop.guid([message])`

return an error if the string is not a valid GUID

```javascript
  schema.newProp = mon().string().guid().fin();

```

### `prop.hostname([message])`

return an error if the string is not a valid hostname

```javascript
  schema.newProp = mon().string().hostname().fin();

```

### `prop.url([message])`

return an error if the string is not a valid url

```javascript
  schema.newProp = mon().string().url().fin();
```

### `prop.uppercase([message])`

return an error if the string is not uppercase

```javascript
  schema.newProp = mon().string().uppercase().fin();
```

### `prop.lowercase([message])`

return an error if the string is not lowercase

```javascript
  schema.newProp = mon().string().lowercase().fin();
```




## Numbers





### `prop.greater(limit, [message])`

return an error if the number is below the limit

```javascript
  schema.newProp = mon().number().greater(5).fin();
```

### `prop.less(limit, [message])`

return an error if the number is above the limit

```javascript
  schema.newProp = mon().number().less(5).fin();
```

### `prop.integer([message])`

return an error if the string is not an integer

```javascript
  schema.newProp = mon().string().integer().fin();
```








# Utilities








### `mon.drop(collection)`

drop a collection by name (normally just 'db')

```javascript
mon.drop('db');
```

### `mon.connect([options])`

takes options, defaulting to 'mongodb://localhost/database'. returns an instance of the database. also accessable through `mon.db`

```javascript
var db = mon.connect();
```

### `mon.schema(schema)`

returns an instance of a schema with the given schema object definition

```javascript
var mySchema = mon.schema({
  name : mon().string().required().fin()
});
```

### `mon.model(modelName)`

returns the model matching the given name

```javascript
var MyModel = mon.model('MyModel');
```

### `mon.new(modelName)`

returns a new instance of the model specified. applies the inputs if they are defined

```javascript
var tester = mon.new('MyModel', {
  name : 'tester'
});
```

### `mon.register(schema, [options])`

registers a new model with the given schema and options. The options object is where middleware, methods, index properties, and virtual properties are defined. A minimalistic model is defined below

```javascript
var mon    = require('mongoman');
var bcrypt = require('bcrypt-nodejs');

mon.register('Person', {
  firstName : mon().string().required().fin(),
  lastName  : mon().string().required().fin(),
  secret    : mon().string().fin()
}, {
  middleware : {
    pre : {
      save : function (callback) {
        if (this.isModified('secret'))  {
          this.secret = bcrypt.hashSync(this.secret, bcrypt.genSaltSync());
        }

        return callback();
      }
    }
  },
  methods : {
    findFamily : function (callback) {
      return mon.model('Person').find({
        lastName : this.lastName
      }, callback);
    },
    compareSecret : function(submitted, callback) {
      var result = bcrypt.compareSync(submitted, this.secret);
      return callback(null, result);
    }
  },
  statics : {
    findByFirst : function (first, callback) {
      return mon.model('Person').find({
        firstName : first
      }, callback);
    }
  },
  virtuals : {
    fullName : {
      get : function () {
        return this.firstName + ' ' + this.lastName;
      }
    }
  }
});
```

### `mon.registerAll(directory, [regex])`

traverses the directory tree requiring all js files (to register models on server startup). optional regex to filter files

**./models/foo.js**

```javascript
var mon = require('mongoman');
mon.register('foo', { foo : mon().string().fin() });
```

**./models/sub_models/bar_model.js**

```javascript
var mon = require('mongoman');
mon.register('bar', { bar : mon().string().fin() });
```

**./server.js**

```javascript
// ... server setup

mon.connect();

mon.registerAll('../models', /_model/); // registers ['bar']

// OR

mon.registerAll('../models'); // registers ['foo', 'bar']

// ... server finalizing
```









# Running Unit Tests

To run the unit tests, execute the following:
```
  npm test
```

Please make sure all unit tests pass before making a new PR

