Mongoman
========

A node utility to simplify model and schema management

TODO
====

validation functions based on joi

* ~~array.sparse(enabled)~~ - not tested
* array.includes(type)
* array.excludes(type)
* ~~array.min(limit)~~ - not tested
* ~~array.max(limit)~~ - not tested
* ~~array.length(limit)~~ - not tested
* array.unique()

* ~~binary.encoding(encoding)~~ - not tested
* ~~binary.min(limit)~~ - not tested
* ~~binary.max(limit)~~ - not tested
* ~~binary.length(limit)~~ - not tested

* ~~date.min(date)~~ - not tested
* ~~date.max(date)~~ - not tested

* ~~number.min(limit)~~ - not tested
* ~~number.max(limit)~~ - not tested
* ~~number.greater(limit)~~ - not tested
* ~~number.less(limit)~~ - not tested
* ~~number.integer()~~ - not tested

* object.keys([schema])
* ~~object.min(limit)~~ - not tested
* ~~object.max(limit)~~ - not tested
* ~~object.length(limit)~~ - not tested
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

* ~~string.min(limit, [encoding])~~ - not tested
* ~~string.max(limit, [encoding])~~ - not tested
* ~~string.length(limit, [encoding])~~ - not tested
* ~~string.regex(pattern, [name])~~ - not tested
* ~~string.alphanum()~~ - not tested
* ~~string.token()~~ - not tested
* ~~string.email()~~ - not tested
* ~~string.guid()~~ - not tested
* ~~string.hostname()~~ - not tested
* ~~string.lowercase()~~ - not tested
* ~~string.uppercase()~~ - not tested

Consider
========
* string.trim()
* date.format(format)
* date.iso()
* number.precision(limit)
