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
      result[key] = _byString(input, specs[key])
    } else if (typeof specs[key] === 'object') {
      if (!specs[key]) return;
      _addField(result, key);
      _addProps(result[key], specs[key], input);
    }
  }

  function _addProps(output, specs, input) {
    if (!specs) return;
    Object.keys(specs).forEach(function(key) {
      _addNestedProp(key, output, specs, input);
    });
  }

  function _addField(o, field) {
    o[field] = {};
  }

  function _byString(o, s) {
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
  };

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

  objectTransform.copy = function(copies, object) {
    return objectTransform.transformSync(function(result, value, key) {
      if (copies.hasOwnProperty(key)) {
        if (Array.isArray(copies[key])) {
          copies[key].forEach(function(newKey) {
            result[newKey] = value;
          });
        } else {
          result[copies[key]] = value;
        }
      }
      result[key] = value;
    }, object);
  };

  objectTransform.copyToFrom = function(specs, object) {
    var result = objectTransform.copy({}, object);
    
    _addProps(result, specs, object);
    
    return result;
  };

  objectTransform.transformToSync = function(transforms, object) {
    return objectTransform.transformSync(function(result, value, key) {
      if (transforms.hasOwnProperty(key)) {
        result[key] = transforms[key](value);
      } else {
        result[key] = value;
      }
    }, object);
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
    objectTransform.transform(function(result, value, key, callback) {
      if (transforms.hasOwnProperty(key)) {
        transforms[key](value, function(err, transformed) {
          if (!err) result[key] = transformed;
          return callback(err);
        });
      } else {
        result[key] = value;
        callback();
      }
    }, object, callback);
  };

  return objectTransform;

}));
