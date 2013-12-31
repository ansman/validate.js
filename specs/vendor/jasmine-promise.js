//     jasmine-promise 0.1.0
//     (c) 2014 Nicklas Ansman
//     jasmine-promise may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/ansman/jasmine-promise
(function() {
  it.promise = function(desc, func) {
    it(desc, function(done) {
      var promise = func.call(this);

      if (!promise || typeof promise.then !== "function")
        throw new Error("Got non promise back");

      if (!done) {
        var complete = false;
        done = function() { complete = true; };
        waitsFor(function() { return complete; });
      }

      promise.then(undefined, function(error) {
        expect(error || "Unknown error").not.toBeDefined();
      }).then(done);
    });
  };
})();
