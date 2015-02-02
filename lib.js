(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.returnExports = factory();
  }
}(this, function() {

  var objectTransform = {};

  function _onlyOnce(fn) {
    var called = false;
    return function() {
      if (called) throw new Error('callback was already called');
      called = true;
      fn.apply(null, arguments);
    }
  }

  function _addNestedProp(key, result, specs, input) {
    if (typeof specs[key] === 'string') {
      result[key] = _getPropByString(specs[key], input)
    } else if (typeof specs[key] === 'object' &&
      specs[key]
    ) {
      _addField(result, key);
      _addProps(result[key], specs[key], input);
    }
  }

  function _clone(object) {
    return JSON.parse(JSON.stringify(object));
  }

  function _addProps(output, specs, input) {
    if (!specs) return;

    try {
      Object.keys(specs);
    } catch (e) {
      return;
    }
    
    Object.keys(specs).forEach(function(key) {
      _addNestedProp(key, output, specs, input);
    });
  }

  function _addField(o, field) {
    o[field] = {};
  }

  function _addNestedTransforms(key, output, specs, input, trail) {
    trail = trail + '.' + key;
    if (trail.split('')[0] === '.')
      trail = trail.slice(1);

    if (typeof specs[key] === 'function') {
      output.push({
        location: trail,
        value: _getPropByString(trail, input),
        transform: specs[key]
      })
    } else if (typeof specs[key] === 'object' &&
      specs[key]
    ) {
      _addTransforms(output, specs[key], input, trail);
    }
  }

  function _addTransforms(output, specs, input, trail) {
    if (!specs) return;
    trail = trail || '';

    try {
      Object.keys(specs);
    } catch (e) {
      return;
    }

    Object.keys(specs).forEach(function(key) {
      _addNestedTransforms(key, output, specs, input, trail);
    });
  }

  function _getTransformsList(specs, object) {
    var output = [];
    _addTransforms(output, specs, object);
    return output;
  };

  function _getPropByString(s, o) {
    s = s.replace(/\[(\w+)\]/g, '.$1');
    s = s.replace(/^\./, '');

    var a = s.split('.');

    return (function iter() {
      var n = a.shift();
      var predicate = false;

      try {
        predicate = (n in o);
      } catch (e) {}

      if (!predicate) return;
      o = o[n];

      if (a.length)
        return iter();
      return o;
    }());
  }

  function _setPropByString(s, u, o) {
    s = s.replace(/\[(\w+)\]/g, '.$1');
    s = s.replace(/^\./, '');

    var a = s.split('.');

    return (function iter(object) {
      var n = a.shift();

      if (!object[n]) {
        object[n] = {};
      }

      if (a.length) return iter(object[n]);
      object[n] = u;
      return o;
    }(o));
  }

  function _each(arr, iterator) {
    for (var i = 0; i < arr.length; i += 1) {
      iterator(arr[i], i, arr);
    }
  }

  function _asyncEach(arr, iterator, callback) {
    callback = callback || function() {};
    if (!arr.length) {
      return callback();
    }
    var completed = 0;
    _each(arr, function(x) {
      iterator(x, _onlyOnce(done));
    });

    function done(err) {
      if (err) {
        callback(err);
        callback = function() {};
      } else {
        completed += 1;
        if (completed >= arr.length) {
          callback();
        }
      }
    }
  }

  objectTransform.transformSync = function(fn, object) {
    var keys = Object.keys(object);
    var result = {};

    keys.forEach(function(key) {
      fn(result, object[key], key);
    });

    return result;
  };

  objectTransform.copyToFrom = function(specs, object) {
    var result = _clone(object);
    _addProps(result, specs, object);
    return result;
  };

  objectTransform.transformToSync = function(transforms, object) {
    var transformList = _getTransformsList(transforms, object);
    var output = _clone(object);

    transformList.forEach(function(item) {
      _setPropByString(item.location, item.transform(item.value), output);
    });

    return output;
  };

  objectTransform.transform = function(fn, object, callback) {
    var keys = Object.keys(object);
    var result = {};

    _asyncEach(keys, function(key, callback) {
      fn(result, object[key], key, callback);
    }, function(err) {
      callback(err, result);
    });
  };

  objectTransform.transformTo = function(transforms, object, callback) {
    var transformList = _getTransformsList(transforms, object);
    var output = _clone(object);

    _asyncEach(transformList, function(item, callback) {
      item.transform(item.value, function(err, result) {
        if (err) return callback(err);
        _setPropByString(item.location, result, output);
        callback();
      });
    }, function(err) {
      callback(err, output);
    });
  };

  return objectTransform;

}));
