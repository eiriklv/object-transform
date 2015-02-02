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
  foo: 'bar',
  bar: {
    baz: 'qux'
  }
};

var transforms = {
  a: reverse,
  b: reverse,
  bar: {
    baz: reverse
  }
};

var transformed = obtr.transformToSync(transforms, words);
// {
//   a: 'olleh',
//   b: 'dlrow',
//   foo: 'bar',
//   bar: {
//     baz: 'xuq'
//   }
// }
```

---------------------------------------

### .copyToFrom(specs, object)

Copy object properties to new properties on the same object,
with support for string literals

__Arguments__

* `specs` - A string or an array of strings describing
  what to copy and where to put it.
* `object` - The original object that is to be transformed.

__Example__

```js
var original = {
  name: 'Eirik',
  birth: {
    year: 1986
  },
  list: [{
    count: 1
  }]
};

var specs = {
  newField: 'name',
  newField2: {
    nestedField: 'name',
    nestedField2: {
      birthYear: 'birth.year'
    }
  },
  birthYear: 'birth.year',
  firstListElement: 'list[0].count'
};

var transformed = o.copyToFrom(specs, original);
// { 
//   name: 'Eirik',
//   birth: { year: 1986 },
//   list: [ { count: 1 } ],
//   newField: 'Eirik',
//   newField2: { nestedField: 'Eirik', nestedField2: { birthYear: 1986 } },
//   birthYear: 1986,
//   firstListElement: 1
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
  foo: 'bar',
  bar: {
    baz: 'qux'
  }
};

var transforms = {
  a: reverse,
  b: reverse,
  bar: {
    baz: reverse
  }
};

obtr.transformTo(transforms, words, function(err, transformed) {
  console.log(transformed);
  // {
  //   a: 'olleh',
  //   b: 'dlrow',
  //   foo: 'bar',
  //   bar: {
  //     baz: 'xuq'
  //   }
  // }
});
```

---------------------------------------
