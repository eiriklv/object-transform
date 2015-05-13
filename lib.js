var get = require('lodash.get');
var set = require('lodash.set');
var asyncEach = require('async-each');

module.exports = (function() {
  var objectTransform = {};

  function _addNestedProp(key, result, specs, input) {
    if (typeof specs[key] === 'string') {
      result[key] = get(input, specs[key])
    } else if (
      typeof specs[key] === 'object' &&
      specs[key]
    ) {
      _addField(result, key);
      _addProps(result[key], specs[key], input);
    }
  }

  function _clone(obj) {
    var clonedObj;

    try {
      clonedObj = JSON.parse(JSON.stringify(obj));
    } catch (e) {
      clonedObj = {};
    }

    return clonedObj;
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
        value: get(input, trail),
        transform: specs[key]
      });
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

  function _addNestedDerivativeCopy(key, result, specs, input) {
    if (Array.isArray(specs[key]) && typeof specs[key][0] === 'string') {
      result[key] = specs[key][0];
    } else if (typeof specs[key] === 'object' && specs[key]) {
      _addField(result, key);
      _addDerivativeCopy(result[key], specs[key], input);
    }
  }

  function _addDerivativeCopy(output, specs, input) {
    if (!specs) return;

    try {
      Object.keys(specs);
    } catch (e) {
      return;
    }
    
    Object.keys(specs).forEach(function(key) {
      _addNestedDerivativeCopy(key, output, specs, input);
    });
  }

  function _addNestedDerivativeTransform(key, result, specs, input) {
    if (Array.isArray(specs[key]) && typeof specs[key][1] === 'function') {
      result[key] = specs[key][1];
    } else if (typeof specs[key] === 'object' && specs[key]) {
      _addField(result, key);
      _addDerivativeTransform(result[key], specs[key], input);
    }
  }

  function _addDerivativeTransform(output, specs, input) {
    if (!specs) return;

    try {
      Object.keys(specs);
    } catch (e) {
      return;
    }
    
    Object.keys(specs).forEach(function(key) {
      _addNestedDerivativeTransform(key, output, specs, input);
    });
  }

  function _getTransformSpec(derivatives, object) {
    var transformSpec = _clone(derivatives);
    _addDerivativeTransform(transformSpec, derivatives, object);
    return transformSpec;
  }

  function _getCopySpec(derivatives, object) {
    var copySpec = _clone(derivatives);
    _addDerivativeCopy(copySpec, derivatives, object);
    return copySpec;
  }

  function _getTransformsList(specs, object) {
    var output = [];
    _addTransforms(output, specs, object);
    return output;
  };

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
      set(output, item.location, item.transform(item.value));
    });

    return output;
  };

  objectTransform.transform = function(fn, object, callback) {
    var keys = Object.keys(object);
    var result = {};

    asyncEach(keys, function(key, callback) {
      fn(result, object[key], key, callback);
    }, function(err) {
      callback(err, result);
    });
  };

  objectTransform.transformTo = function(transforms, object, callback) {
    var transformList = _getTransformsList(transforms, object);
    var output = _clone(object);

    asyncEach(transformList, function(item, callback) {
      item.transform(item.value, function(err, result) {
        if (err) return callback(err);
        set(output, item.location, result);
        callback();
      });
    }, function(err) {
      callback(err, output);
    });
  };

  objectTransform.deriveToSync = function(derivatives, object) {
    return objectTransform.transformToSync(
      _getTransformSpec(derivatives),
      objectTransform.copyToFrom(
        _getCopySpec(derivatives),
        _clone(object)
      )
    );
  };

  objectTransform.deriveTo = function(derivatives, object, callback) {
    return objectTransform.transformTo(
      _getTransformSpec(derivatives),
      objectTransform.copyToFrom(
        _getCopySpec(derivatives),
        _clone(object)
      ),
      callback
    );
  };

  return objectTransform;
}());
