Mongoman
========

A node utility to simplify model and schema management

TODO
====

validation functions based on joi

~~array.sparse(enabled)~~ - not tested
array.includes(type)
array.excludes(type)
array.min(limit)
array.max(limit)
array.length(limit)
array.unique()

binary.encoding(encoding)
binary.min(limit)
binary.max(limit)
binary.length(limit)

date.min(date)
date.max(date)
date.format(format)
date.iso()

number.min(limit)
number.max(limit)
number.greater(limit)
number.less(limit)
number.integer()
number.precision(limit)

object.keys([schema])
object.min(limit)
object.max(limit)
object.length(limit)
object.pattern(regex, schema)
object.and(peers)
object.nand(peers)
object.or(peers)
object.xor(peers)
object.with(key, peers)
object.without(key, peers)
object.rename(from, to, [options])
object.assert(ref, schema, [message])
object.unknown([allow])
object.type(constructor, [name])
object.requiredKeys(children)
object.optionalKeys(children)

string.insensitive()
~~string.min(limit, [encoding])~~ - not tested
~~string.max(limit, [encoding])~~ - not tested
~~string.length(limit, [encoding])~~ - not tested
string.creditCard()
string.regex(pattern, [name])
string.alphanum()
string.token()
string.email()
string.guid()
string.hostname()
string.lowercase()
string.uppercase()
string.trim()