Mongoman
========

A node utility to simplify model and schema management

# Do not use this. I'm in the process of writing test to make sure everything is hunky-dory. check back in a week

# Key

- [Usage](#usage)
- [General Utilities](#general-utilities)
    - [`prop.set(key, value)`](#propsetkey-value)
    - [`prop.validate(errorMsg, valFunction)`](#propvalidateerrormsg-valfunction)
    - [`prop.index(key, value)`](#propindexkey-value)
- [Types](#types)
    - [`prop.string()`](#propstring)
    - [`prop.date()`](#propdate)
    - [`prop.number()`](#propnumber)
    - [`prop.buffer()`](#propbuffer)
    - [`prop.mixed()`](#propmixed)
    - [`prop.objectId()`](#propobjectid)
    - [`prop.array()`](#proparray)
- [Validation](#validation)
    - [Shared](#shared)
        - [`prop.required()`](#proprequired)
        - [`prop.default(value)`](#propdefaultvalue)
        - [`prop.enum(values, [message])`](#propenumvalues-message)
        - [`prop.unique([bool])`](#propuniquebool)
        - [`prop.min(value, [message])`](#propminvalue-message)
        - [`prop.max(value, [message])`](#propmaxvalue-message)
        - [`prop.length(value)`](#proplengthvalue)
    - [Arrays](#arrays)
        - [`prop.array().sparse([enables])`](#propsparseenabled)
    - [Strings](#strings)
        - [`prop.alphanum([message])`](#propalphanummessage)
        - [`prop.regex(expression, [message])`](#propregexexpression-message)
        - [`prop.email([message])`](#propemailmessage)
        - [`prop.token([message])`](#proptokenmessage)
        - [`prop.guid([message])`](#propguidlmessage)
        - [`prop.uppercase([message])`](#propguidlmessage)
        - [`prop.lowercase([message])`](#lowercase)
    - [Strings](#strings)
        - [`prop.greater(limit, [message])`](#propgreaterlimit-message)
        - [`prop.less(limit, [message])`](#proplesslimit-message)
        - [`prop.integer([message])`](#propintegermessage)
- [Utilities](#utilities)





# Usage

TODO: add basic usage including config setup


# General Utilities

If a property or validation isn't included as a supported chainable function, you can easily include any missing values using the following functions

### `prop.set(key, value)`

Set the key/value passed in for the property

```javascript
  schema.newProp = mon().set('type', 'string').fin();
```

### `prop.validate(errorMsg, valFunction)`

Bind the validation function to the property, returning the error if it returns false

```javascript
  function isOdd (value) {
    return (value % 2) == 1
  }

  schema.newProp = mon().validate('newProp must be odd', isOdd).fin();
```

### `prop.index(key, value)`

Bind the key and value to the index adttribute of the property

```javascript
  schema.newProp = mon().index('unique', false).fin();
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









# Validation

**important:** using validations that to not apply to the property type will throw an error, to allow it to pass silenly, set mongo configuration `strict : false`

any time `[]` is a function parameted, its is optional. anytime `[message]` is included, a default message will be used unless this parameter is set




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

### `prop.enum(values, [message])`

type: any

If the value submitted is not uncluded in thte list of enumerated properties, an error is returned.

```javascript
  schema.newProp = mon().enum(['foo', 'bar'], 'custom error').fin();
```
efault value').fin();
```

### `prop.unique([bool])`

type: any

Insures a unique index is generated for the path. defaults to true. False causes the DB to be indifferent

```javascript
  schema.newProp = mon().unique().fin();
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

return an error if the number is above the limit

```javascript
  schema.newProp = mon().number().greater(5).fin();
```

### `prop.less(limit, [message])`

return an error if the number is below the limit

```javascript
  schema.newProp = mon().string().less(5).fin();
```

### `prop.integer([message])`

return an error if the string is not an integer

```javascript
  schema.newProp = mon().string().integer().fin();
```






# NOTHING BELOW THIS LINE IS TESTED















TODO
====

general

register
new
save

Consider
========

* string.trim()
* date.format(format)
* date.iso()
* number.precision(limit)
* array.includes(type)
* array.excludes(type)
* array.unique()
* object.keys([schema])
* object.pattern(regex, schema)
* object.and(peers)
* object.nand(peers)
* object.or(peers)
* object.xor(peers)
* object.with(key, peers)
* object.without(key, peers)
* object.rename(from, to, [options])
* object.assert(ref, schema, [message])
* object.unknown([allow])
* object.type(constructor, [name])
* object.requiredKeys(children)
* object.optionalKeys(children)
