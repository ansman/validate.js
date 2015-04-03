beforeEach(function() {
  jasmine.addMatchers({
    toHaveLength: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          return {
            pass: actual.length === expected
          };
        }
      };
    },
    toHaveBeenCalledWithContext: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          return {
            pass: actual.calls.any(function(call) {
              return call.object === expected;
            })
          };
        }
      };
    },
    toHaveItems: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          if (actual.length != expected.length) {
            return {pass: false};
          }
          return {
            pass: actual.every(function(a) {
              return expected.some(function(item) {
                return JSON.stringify(item) === JSON.stringify(a);
              });
            })
          };
        }
      };
    },
    toBeInstanceOf: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          return {
            pass: actual instanceof expected
          };
        }
      };
    },
    toBeAPromise: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          return {
            pass: actual && typeof actual.then === "function"
          };
        }
      };
    },
    toBeANumber: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          return {
            pass: typeof actual === 'number' && !isNaN(actual)
          };
        }
      };
    }
  });
});
