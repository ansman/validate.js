describe("validate.async", function() {
  var error = null
    , success = null;

  beforeEach(function() {
    success = jasmine.createSpy("success");
    error = jasmine.createSpy("error");

    validate.validators.asyncFail = function() {
      return validate.Promise(function(resolve, reject) {
        setTimeout(function() {
          reject("failz");
        }, 1);
      });
    };

    validate.validators.asyncSuccess = function() {
      return validate.Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve();
        }, 1);
      });
    };
  });

  afterEach(function() {
    delete validate.validators.asyncFail;
    delete validate.validators.asyncSuccess;
  });

  it("makes validate return a promise", function() {
    var promise = validate.async({}, {});
    expect(promise).toBeAPromise();
  });

  it.promise("resolves the promise if all constraints pass", function() {
    return validate.async({}, {});
  });

  it.promise("rejects the promise if any constraint fails", function() {
    var c = {name: {presence: true}};
    return validate.async({}, c).then(success, error).then(function() {
      expect(success).not.toHaveBeenCalled();
      expect(error).toHaveBeenCalled();
    });
  });

  it.promise("handles validators returning an promise", function() {
    var c = {
      name: {
        asyncFail: true,
        asyncSuccess: true
      }
    };
    return validate.async({}, c).then(success, error).then(function() {
      expect(success).not.toHaveBeenCalled();
      expect(error).toHaveBeenCalledWith({
        name: ["Name failz"]
      });
    });
  });

  describe("Promise", function() {
    var globals = ["Promise", "Q", "when", "RSVP"]
      , store = {};

    globals.forEach(function(name) { store[name] = window[name]; });

    beforeEach(function() {
      globals.forEach(function(name) { window[name] = undefined; });
    });

    afterEach(function() {
      globals.forEach(function(name) { window[name] = store[name]; });
    });

    it("throws an error if no promise can be detected", function() {
      expect(function() { new validate.Promise(); }).toThrow();
    });

    it("tries to import each promise", function() {
      spyOn(validate, "tryRequire").andReturn(null);
      expect(function() { new validate.Promise(); }).toThrow();
      expect(validate.tryRequire).toHaveBeenCalledWith("es6-promise");
      expect(validate.tryRequire).toHaveBeenCalledWith("rsvp");
      expect(validate.tryRequire).toHaveBeenCalledWith("when");
      expect(validate.tryRequire).toHaveBeenCalledWith("q");
      console.log(validate.tryRequire.calls);
    });

    it("supports native promises", function() {
      var callback = jasmine.createSpy("callback");
      window.Promise = store.Promise;
      promise = new validate.Promise(callback);
      expect(promise).toBeInstanceOf(Promise);
      expect(callback).toHaveBeenCalled();
    });

    it("tries to import the native promised polyfill", function() {
      spyOn(validate, "tryRequire").andCallFake(function(module) {
        if (module === "es6-promise") return {Promise: store.Promise};
        else return null;
      });
      expect(validate.Promise(function() {})).toBeAPromise();
    });

    it("supports RSVP promises", function() {
      var callback = jasmine.createSpy("callback");
      window.RSVP = store.RSVP;
      promise = new validate.Promise(callback);
      expect(promise).toBeInstanceOf(RSVP.Promise);
      expect(callback).toHaveBeenCalled();
    });

    it("tries to import the RSVP module", function() {
      spyOn(validate, "tryRequire").andCallFake(function(module) {
        if (module === "rsvp") return store.RSVP;
        else return null;
      });
      expect(validate.Promise(function() {})).toBeAPromise();
    });

    it("supports when.js promises", function() {
      var callback = jasmine.createSpy("callback");
      window.when = store.when;
      promise = new validate.Promise(callback);
      expect(when.isPromiseLike(promise)).toBe(true);
      expect(callback).toHaveBeenCalled();
    });

    it("tries to import the when.js module", function() {
      spyOn(validate, "tryRequire").andCallFake(function(module) {
        console.log(module);
        if (module === "when") return store.when;
        else return null;
      });
      expect(validate.Promise(function() {})).toBeAPromise();
    });

    it("supports Q promises", function() {
      var callback = jasmine.createSpy("callback");
      window.Q = store.Q;
      promise = new validate.Promise(callback);
      expect(Q.isPromise(promise)).toBe(true);
      expect(callback).toHaveBeenCalled();
    });

    it("tries to import the q module", function() {
      spyOn(validate, "tryRequire").andCallFake(function(module) {
        if (module === "q") return store.Q;
        else return null;
      });
      expect(validate.Promise(function() {})).toBeAPromise();
    });
  });

  describe("waitForResults", function() {
    var error, success;

    beforeEach(function() {
      error = jasmine.createSpy("error handler");
      success = jasmine.createSpy("success handler");
    });

    it.promise("handles no results", function() {
      return validate.waitForResults([]);
    });

    it.promise("handles results with no promises", function() {
      var results = [{attribute: "foo", error: "bar"}];
      return validate.waitForResults(results).then(function() {
        expect(results).toEqual([{attribute: "foo", error: "bar"}]);
      });
    });

    it.promise("handles results with no promises", function() {
      var results = [{
        attribute: "foo",
        error: validate.Promise(function(resolve, reject) {
          setTimeout(resolve, 1);
        })
      }, {
        attribute: "bar",
        error: validate.Promise(function(resolve, reject) {
          setTimeout(reject.bind(this, "My error"), 1);
        })
      }, {
        attribute: "baz",
        error: 4711
      }];

      return validate.waitForResults(results).then(function() {
        expect(results).toEqual([{
          attribute: "foo",
          error: null
        }, {
          attribute: "bar",
          error: "My error"
        }, {
          attribute: "baz",
          error: 4711
        }]);
      });
    });

    it.promise("warns if a promise is rejected without an error", function() {
      spyOn(validate, "warn");

      var results = [{
        attribute: "foo",
        error: validate.Promise(function(resolve, reject) { reject(); })
      }];

      return validate.waitForResults(results).then(function() {
        expect(results).toEqual([{
          attribute: "foo",
          error: undefined
        }]);
        expect(validate.warn).toHaveBeenCalled();
      });
    });
  });
});
