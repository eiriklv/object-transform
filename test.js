var obtr = require('./lib');

var testObject = {
  first: 'hello',
  second: 'world',
  third: {
    fourth: 'foobar',
    fifth: 'bazqux'
  }
};

var reverse = function(str) {
  return str.split('').reverse().join('');
};

var reverseAsync = function(str, callback) {
  setTimeout(callback.bind(null, null, str.split('').reverse().join('')));
};

exports['.transformToSync'] = {
  'should apply correct transform (single)': function(test) {
    test.expect(4);

    var transform = {
      first: reverse
    }

    console.log('---------------');

    var transformed = obtr.transformToSync(transform, testObject);

    console.log('transformed:', transformed);

    test.strictEqual(transformed.first, reverse(testObject.first), 'transform should be applied');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should apply correct transform (single nested)': function(test) {
    test.expect(4);

    var transform = {
      third: {
        fourth: reverse
      }
    };

    var transformed = obtr.transformToSync(transform, testObject);

    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, reverse(testObject.third.fourth), 'transform should be applied');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should apply correct transform (multiple)': function(test) {
    test.expect(4);

    var transform = {
      first: reverse,
      second: reverse
    }

    var transformed = obtr.transformToSync(transform, testObject);

    test.strictEqual(transformed.first, reverse(testObject.first), 'transform should be applied');
    test.strictEqual(transformed.second, reverse(testObject.second), 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should apply correct transforms (multiple nested)': function(test) {
    test.expect(4);

    var transform = {
      first: reverse,
      second: reverse,
      third: {
        fourth: reverse
      }
    }

    var transformed = obtr.transformToSync(transform, testObject);

    test.strictEqual(transformed.first, reverse(testObject.first), 'transform should be applied');
    test.strictEqual(transformed.second, reverse(testObject.second), 'transform should be applied');
    test.strictEqual(transformed.third.fourth, reverse(testObject.third.fourth), 'transform should be applied');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should apply correct transforms (multiple nested all)': function(test) {
    test.expect(4);

    var transform = {
      first: reverse,
      second: reverse,
      third: {
        fourth: reverse,
        fifth: reverse
      }
    }

    var transformed = obtr.transformToSync(transform, testObject);

    test.strictEqual(transformed.first, reverse(testObject.first), 'transform should be applied');
    test.strictEqual(transformed.second, reverse(testObject.second), 'transform should be applied');
    test.strictEqual(transformed.third.fourth, reverse(testObject.third.fourth), 'transform should be applied');
    test.strictEqual(transformed.third.fifth, reverse(testObject.third.fifth), 'transform should be applied');

    test.done();
  },

  'should ignore transform if not a function': function(test) {
    test.expect(4);

    var transform = {
      first: 'goodbye'
    }

    var transformed = obtr.transformToSync(transform, testObject);

    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should ignore transform if not a function (nested)': function(test) {
    test.expect(4);

    var transform = {
      third: {
        fourth: 'goodbye'
      }
    };

    var transformed = obtr.transformToSync(transform, testObject);

    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should ignore transform if not a function (null) (nested)': function(test) {
    test.expect(4);

    var transform = {
      third: {
        fourth: null
      }
    };

    var transformed = obtr.transformToSync(transform, testObject);

    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should ignore transform if not a function (undefined) (nested)': function(test) {
    test.expect(4);

    var transform = {
      third: {
        fourth: undefined
      }
    };

    var transformed = obtr.transformToSync(transform, testObject);

    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should ignore transform if empty': function(test) {
    test.expect(4);

    var transform = {};

    var transformed = obtr.transformToSync(transform, testObject);

    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should ignore transform if not an object (array)': function(test) {
    test.expect(4);

    var transform = [];

    var transformed = obtr.transformToSync(transform, testObject);

    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should ignore transform if not an object (string)': function(test) {
    test.expect(4);

    var transform = 'blabla';

    var transformed = obtr.transformToSync(transform, testObject);

    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should ignore transform if not an object (number)': function(test) {
    test.expect(4);

    var transform = 500;

    var transformed = obtr.transformToSync(transform, testObject);

    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  }
};

exports['.copyToFrom'] = {
  'should copy a field (single)': function(test) {
    test.expect(5);

    var transform = {
      newField: 'first'
    };

    var transformed = obtr.copyToFrom(transform, testObject);

    test.strictEqual(transformed.newField, testObject.first, 'new field should be correct');
    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should copy fields (multiple)': function(test) {
    test.expect(5);

    var transform = {
      newField: 'first',
      newField2: 'first'
    };

    var transformed = obtr.copyToFrom(transform, testObject);

    test.strictEqual(transformed.newField, testObject.first, 'new field should be correct');
    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should copy fields (multiple 2)': function(test) {
    test.expect(6);

    var transform = {
      newField: 'first',
      newField2: 'second'
    };

    var transformed = obtr.copyToFrom(transform, testObject);

    test.strictEqual(transformed.newField, testObject.first, 'new field should be correct');
    test.strictEqual(transformed.newField2, testObject.second, 'new field should be correct');
    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should copy to nested field from non-nested (single)': function(test) {
    test.expect(5);

    var transform = {
      newField: {
        newField2: 'first'
      }
    };

    var transformed = obtr.copyToFrom(transform, testObject);

    test.strictEqual(transformed.newField.newField2, testObject.first, 'new field should be correct');
    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should copy to nested field from nested (single)': function(test) {
    test.expect(5);

    var transform = {
      newField: {
        newField2: 'third.fourth'
      }
    };

    var transformed = obtr.copyToFrom(transform, testObject);

    test.strictEqual(transformed.newField.newField2, testObject.third.fourth, 'new field should be correct');
    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should return unaltered if no copies applied': function(test) {
    test.expect(4);

    var transform = {};

    var transformed = obtr.copyToFrom(transform, testObject);

    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should return unaltered if invalid copy-specs (array)': function(test) {
    test.expect(4);

    var transform = [];

    var transformed = obtr.copyToFrom(transform, testObject);

    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should return unaltered if invalid copy-specs (number)': function(test) {
    test.expect(4);

    var transform = 500;

    var transformed = obtr.copyToFrom(transform, testObject);

    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should return unaltered if invalid copy-specs (string)': function(test) {
    test.expect(4);

    var transform = 'goodbye';

    var transformed = obtr.copyToFrom(transform, testObject);

    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  }
};

exports['.transformTo'] = {
  'should apply correct transform (single)': function(test) {
    test.expect(4);

    var transform = {
      first: reverseAsync
    }

    obtr.transformTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.first, reverse(testObject.first), 'transform should be applied');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  },

  'should apply correct transform (single nested)': function(test) {
    test.expect(4);

    var transform = {
      third: {
        fourth: reverseAsync
      }
    };

    obtr.transformTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, reverse(testObject.third.fourth), 'transform should be applied');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  },

  'should apply correct transform (multiple)': function(test) {
    test.expect(4);

    var transform = {
      first: reverseAsync,
      second: reverseAsync
    }

    obtr.transformTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.first, reverse(testObject.first), 'transform should be applied');
      test.strictEqual(transformed.second, reverse(testObject.second), 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  },

  'should apply correct transforms (multiple nested)': function(test) {
    test.expect(4);

    var transform = {
      first: reverseAsync,
      second: reverseAsync,
      third: {
        fourth: reverseAsync
      }
    }

    obtr.transformTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.first, reverse(testObject.first), 'transform should be applied');
      test.strictEqual(transformed.second, reverse(testObject.second), 'transform should be applied');
      test.strictEqual(transformed.third.fourth, reverse(testObject.third.fourth), 'transform should be applied');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  },

  'should apply correct transforms (multiple nested all)': function(test) {
    test.expect(4);

    var transform = {
      first: reverseAsync,
      second: reverseAsync,
      third: {
        fourth: reverseAsync,
        fifth: reverseAsync
      }
    }

    obtr.transformTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.first, reverse(testObject.first), 'transform should be applied');
      test.strictEqual(transformed.second, reverse(testObject.second), 'transform should be applied');
      test.strictEqual(transformed.third.fourth, reverse(testObject.third.fourth), 'transform should be applied');
      test.strictEqual(transformed.third.fifth, reverse(testObject.third.fifth), 'transform should be applied');
      test.done();
    });
  },

  'should ignore transform if not a function': function(test) {
    test.expect(4);

    var transform = {
      first: 'goodbye'
    }

    obtr.transformTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  },

  'should ignore transform if not a function (nested)': function(test) {
    test.expect(4);

    var transform = {
      third: {
        fourth: 'goodbye'
      }
    };

    obtr.transformTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  },

  'should ignore transform if not a function (null) (nested)': function(test) {
    test.expect(4);

    var transform = {
      third: {
        fourth: null
      }
    };

    obtr.transformTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  },

  'should ignore transform if not a function (undefined) (nested)': function(test) {
    test.expect(4);

    var transform = {
      third: {
        fourth: undefined
      }
    };

    obtr.transformTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  },

  'should ignore transform if empty': function(test) {
    test.expect(4);

    var transform = {};

    obtr.transformTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  },

  'should ignore transform if not an object (array)': function(test) {
    test.expect(4);

    var transform = [];

    obtr.transformTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  },

  'should ignore transform if not an object (string)': function(test) {
    test.expect(4);

    var transform = 'blabla';

    obtr.transformTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  },

  'should ignore transform if not an object (number)': function(test) {
    test.expect(4);

    var transform = 500;

    obtr.transformTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  }
};

exports['.transform'] = {
  'should be unaltered if used correctly': function(test) {
    test.expect(4);

    obtr.transform(function(result, value, key, callback) {
      result[key] = value;
      callback();
    }, testObject, function(err, transformed) {
      test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  },

  'should apply correct transform': function(test) {
    test.expect(4);

    var testObject = {
      first: 'hello',
      second: 'world',
      third: 'foo',
      fourth: 'bar'
    };

    obtr.transform(function(result, value, key, callback) {
      result[key] = reverse(value);
      callback();
    }, testObject, function(err, transformed) {
      test.strictEqual(transformed.first, reverse(testObject.first), 'transform should be applied');
      test.strictEqual(transformed.second, reverse(testObject.second), 'transform should be applied');
      test.strictEqual(transformed.third, reverse(testObject.third), 'transform should be applied');
      test.strictEqual(transformed.fourth, reverse(testObject.fourth), 'transform should be applied');
      test.done();
    });
  }
};

exports['.transformSync'] = {
  'should be unaltered if used correctly': function(test) {
    test.expect(4);

    var transformed = obtr.transformSync(function(result, value, key) {
      result[key] = value;
    }, testObject);

    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
    test.done();
  },

  'should apply correct transform': function(test) {
    test.expect(4);

    var testObject = {
      first: 'hello',
      second: 'world',
      third: 'foo',
      fourth: 'bar'
    };

    var transformed = obtr.transformSync(function(result, value, key) {
      result[key] = reverse(value);
    }, testObject);

    test.strictEqual(transformed.first, reverse(testObject.first), 'transform should be applied');
    test.strictEqual(transformed.second, reverse(testObject.second), 'transform should be applied');
    test.strictEqual(transformed.third, reverse(testObject.third), 'transform should be applied');
    test.strictEqual(transformed.fourth, reverse(testObject.fourth), 'transform should be applied');
    test.done();
  }
};

exports['.deriveToSync'] = {
  'should copy an transform a field (single)': function(test) {
    test.expect(5);

    var transform = {
      newField: ['first', reverse]
    };

    var transformed = obtr.deriveToSync(transform, testObject);

    test.strictEqual(transformed.newField, reverse(testObject.first), 'new field should be correct with transform applied');
    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should copy and transform fields (multiple)': function(test) {
    test.expect(6);

    var transform = {
      newField: ['first', reverse],
      newField2: ['first', reverse]
    };

    var transformed = obtr.deriveToSync(transform, testObject);

    test.strictEqual(transformed.newField, reverse(testObject.first), 'new field should be correct with transform applied');
    test.strictEqual(transformed.newField2, reverse(testObject.first), 'new field should be correct with transform applied');
    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should copy and transform fields (multiple 3)': function(test) {
    test.expect(6);

    var transform = {
      first: ['first', reverse],
      newField: ['first', reverse],
      newField2: ['second', reverse]
    };

    var transformed = obtr.deriveToSync(transform, testObject);

    test.strictEqual(transformed.newField, reverse(testObject.first), 'new field should be correct');
    test.strictEqual(transformed.newField2, reverse(testObject.second), 'new field should be correct');
    test.strictEqual(transformed.first, reverse(testObject.first), 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should copy to nested field from non-nested (single) and transform': function(test) {
    test.expect(5);

    var transform = {
      newField: {
        newField2: ['first', reverse]
      }
    };

    var transformed = obtr.deriveToSync(transform, testObject);

    test.strictEqual(transformed.newField.newField2, reverse(testObject.first), 'new field should be correct and transformed');
    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should copy to nested field from nested (single) and transform': function(test) {
    test.expect(5);

    var transform = {
      newField: {
        newField2: ['third.fourth', reverse]
      }
    };

    var transformed = obtr.deriveToSync(transform, testObject);

    test.strictEqual(transformed.newField.newField2, reverse(testObject.third.fourth), 'new field should be correct');
    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should return unaltered if no derivatives applied': function(test) {
    test.expect(4);

    var transform = {};

    var transformed = obtr.deriveToSync(transform, testObject);

    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should return unaltered if invalid copy-specs (array)': function(test) {
    test.expect(4);

    var transform = [];

    var transformed = obtr.deriveToSync(transform, testObject);

    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should return unaltered if invalid copy-specs (number)': function(test) {
    test.expect(4);

    var transform = 500;

    var transformed = obtr.deriveToSync(transform, testObject);

    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  },

  'should return unaltered if invalid copy-specs (string)': function(test) {
    test.expect(4);

    var transform = 'goodbye';

    var transformed = obtr.deriveToSync(transform, testObject);

    test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
    test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
    test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
    test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');

    test.done();
  }
};

exports['.deriveTo'] = {
  'should copy an transform a field (single)': function(test) {
    test.expect(5);

    var transform = {
      newField: ['first', reverseAsync]
    };

    obtr.deriveTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.newField, reverse(testObject.first), 'new field should be correct with transform applied');
      test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  },

  'should copy and transform fields (multiple)': function(test) {
    test.expect(6);

    var transform = {
      newField: ['first', reverseAsync],
      newField2: ['first', reverseAsync]
    };

    obtr.deriveTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.newField, reverse(testObject.first), 'new field should be correct with transform applied');
      test.strictEqual(transformed.newField2, reverse(testObject.first), 'new field should be correct with transform applied');
      test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  },

  'should copy and transform fields (multiple 2)': function(test) {
    test.expect(6);

    var transform = {
      newField: ['first', reverseAsync],
      newField2: ['second', reverseAsync]
    };

    obtr.deriveTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.newField, reverse(testObject.first), 'new field should be correct');
      test.strictEqual(transformed.newField2, reverse(testObject.second), 'new field should be correct');
      test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  },

  'should copy and transform fields (multiple 3)': function(test) {
    test.expect(6);

    var transform = {
      first: ['first', reverseAsync],
      newField: ['first', reverseAsync],
      newField2: ['second', reverseAsync]
    };

    obtr.deriveTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.newField, reverse(testObject.first), 'new field should be correct');
      test.strictEqual(transformed.newField2, reverse(testObject.second), 'new field should be correct');
      test.strictEqual(transformed.first, reverse(testObject.first), 'original should not be altered');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  },

  'should copy to nested field from non-nested (single) and transform': function(test) {
    test.expect(5);

    var transform = {
      newField: {
        newField2: ['first', reverseAsync]
      }
    };

    obtr.deriveTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.newField.newField2, reverse(testObject.first), 'new field should be correct and transformed');
      test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  },

  'should copy to nested field from nested (single) and transform': function(test) {
    test.expect(5);

    var transform = {
      newField: {
        newField2: ['third.fourth', reverseAsync]
      }
    };

    obtr.deriveTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.newField.newField2, reverse(testObject.third.fourth), 'new field should be correct');
      test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  },

  'should return unaltered if no derivatives applied': function(test) {
    test.expect(4);

    var transform = {};

    var transformed = obtr.deriveTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  },

  'should return unaltered if invalid copy-specs (array)': function(test) {
    test.expect(4);

    var transform = [];

    obtr.deriveTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  },

  'should return unaltered if invalid copy-specs (number)': function(test) {
    test.expect(4);

    var transform = 500;

    var transformed = obtr.deriveTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
    });

    test.done();
  },

  'should return unaltered if invalid copy-specs (string)': function(test) {
    test.expect(4);

    var transform = 'goodbye';

    obtr.deriveTo(transform, testObject, function(err, transformed) {
      test.strictEqual(transformed.first, testObject.first, 'original should not be altered');
      test.strictEqual(transformed.second, testObject.second, 'original should not be altered');
      test.strictEqual(transformed.third.fourth, testObject.third.fourth, 'original should not be altered');
      test.strictEqual(transformed.third.fifth, testObject.third.fifth, 'original should not be altered');
      test.done();
    });
  }
};
