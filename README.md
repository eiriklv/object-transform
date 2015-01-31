Object Transform
================

#### Introduction:
A small library to do object transforms.
Mostly for use with functional programming pipelines and streams.
The arguments are 'reversed' to be able to do meaningful partial application / currying.

---------------------------------------

### .transformSync(fn, object)

Transform the properties of an object based on a transform function `fn`

__Arguments__

* `fn(result, value, key)` - This gets called for all properties of the object,
  and the `result` should be mutated to the desired result. No explicit return necessary.
* `object` - The original object that is to be transformed.

__Example__

```js
var words = {
  a: 'hello',
  b: 'world'
};

var transformed = obtr.transformSync(function(result, value, key) {
  result[key] = value.split('').reverse().join('');
}, words);
// {
//   a: 'olleh',
//   b: 'dlrow'
// }
```

---------------------------------------

### .transformToSync(transforms, object)

Transform the properties of an object based on an object
describing transforms on specific properties. The value
of the property is used as input for the transform

__Arguments__

* `transforms` - An object specifying the transforms to be applied.
* `object` - The original object that is to be transformed.

__Example__

```js
var reverse = function(str) {
  return str.split('').reverse().join('');
};

var words = {
  a: 'hello',
  b: 'world',
  foo: 'bar'
};

var transforms = {
  a: reverse,
  b: reverse
};

var transformed = obtr.transformToSync(transforms, words);
// {
//   a: 'olleh',
//   b: 'dlrow',
//   foo: 'bar'
// }
```

---------------------------------------

### .copy(entries, object)

Copy object properties to new properties on the same object.

__Arguments__

* `entries` - A string or an array of strings describing
  what to copy and where to put it.
* `object` - The original object that is to be transformed.

__Example__

```js
var words = {
  a: 'hello',
  b: 'world'
};

var entries = {
  a: ['c', 'd'],
  b: 'crap'
};

var copied = obtr.copy(entries, words);
// {
//   a: 'hello',
//   b: 'world',
//   c: 'hello',
//   d: 'hello',
//   crap: 'world'
// }
```

---------------------------------------

### .transform(fn, object, callback)

(Asyncronous version)
Transform the properties of an object based on a transform function `fn`.

__Arguments__


* `fn(result, value, key, callback)` - This gets called for all properties of the object,
  and the `result` should be mutated to the desired result.
  Invoke `callback` with an error or `null` when done.
* `object` - The original object that is to be transformed.
* `callback(err, result)` - a final callback to be called with the result or an error.

__Example__

```js
var words = {
  a: 'hello',
  b: 'world'
};

obtr.transform(function(result, value, key, callback) {
  result[key] = value.split('').reverse().join('');
  callback();
}, words, function(err, transformed) {
  console.log(transformed);
  // {
  //   a: 'olleh',
  //   b: 'dlrow'
  // }
});
```

---------------------------------------

### .transformTo(transforms, object)

(Asyncronous version)
Transform the properties of an object based on an object
describing transforms on specific properties. The value
of the property is used as input for the transform.

__Arguments__

* `transforms` - An object specifying the transforms to be applied.
* `object` - The original object that is to be transformed.
* `callback(err, result)` - a final callback to be called with the result or an error.

__Example__

```js
var reverse = function(input, callback) {
  callback(null, input.split('').reverse().join(''));
}

var words = {
  a: 'hello',
  b: 'world',
  foo: 'bar'
};

var transforms = {
  a: reverse,
  b: reverse
};

obtr.transformTo(transforms, words, function(err, transformed) {
  console.log(transformed);
  // {
  //   a: 'olleh',
  //   b: 'dlrow',
  //   foo: 'bar'
  // }
});
```

---------------------------------------
