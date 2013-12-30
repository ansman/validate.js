beforeEach(function() {
  this.addMatchers({
    toHaveLength: function(expected) {
      return this.actual.length === expected;
    },
    toHaveBeenCalledWithContext: function(context) {
      return this.actual.calls.some(function(call) {
        return call.object === context;
      });
    }
  });
});
