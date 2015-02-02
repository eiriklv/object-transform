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

    var transformed = obtr.transformToSync(transform, testObject);

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
}
