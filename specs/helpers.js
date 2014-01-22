beforeEach(function() {
  this.addMatchers({
    toHaveLength: function(expected) {
      return this.actual.length === expected;
    },
    toHaveBeenCalledWithContext: function(context) {
      return this.actual.calls.some(function(call) {
        return call.object === context;
      });
    },
    toHaveItems: function(items) {
      if (this.actual.length != items.length) return false;
      return this.actual.every(function(a) {
        return items.some(function(item) {
          return JSON.stringify(item) === JSON.stringify(a);
        });
      });
    },
    toBeInstanceOf: function(constructor) {
      return this.actual instanceof constructor;
    },
    toBeAPromise: function() {
      return this.actual && typeof this.actual.then === "function";
    }
  });
});
