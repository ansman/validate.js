describe("validate", function() {
  describe('extend', function() {
    it("extends the first argument with the remaining arguments", function() {
      var obj = {};
      validate.extend(obj, {foo: "foo"}, {bar: "bar"});
      expect(obj).toEqual({foo: "foo", bar: "bar"});
    });

    it("returns the first argument", function() {
      var obj = {};
      expect(validate.extend(obj)).toBe(obj);
    });

    it("extends with the seconds argument first", function() {
      var actual = validate.extend({}, {foo: "foo"}, {foo: "bar"});
      expect(actual).toEqual({foo: "bar"});
    });
  });

  describe('result', function() {
    it("returns the first argument if it's not a function", function() {
      var obj = {};
      expect(validate.result(obj)).toBe(obj);
    });

    it("calls the argument if it's a function and returns the result", function() {
      var obj = jasmine.createSpy().and.returnValue("some return value");
      expect(validate.result(obj)).toEqual("some return value");
    });

    it("accepts additional arguments as arguments to the function", function() {
      var obj = jasmine.createSpy();
      validate.result(obj, "foo", "bar", "baz");
      expect(obj).toHaveBeenCalledWith("foo", "bar", "baz");
    });
  });

  describe('isNumber', function() {
    it("returns true for numbers", function() {
      expect(validate.isNumber(0)).toBe(true);
      expect(validate.isNumber(1)).toBe(true);
      expect(validate.isNumber(Math.PI)).toBe(true);
    });

    it("returns false for non numbers", function() {
      expect(validate.isNumber(null)).toBe(false);
      expect(validate.isNumber(true)).toBe(false);
      expect(validate.isNumber("1")).toBe(false);
    });
  });

  describe('isInteger', function() {
    it("returns true for integers", function() {
      expect(validate.isInteger(0)).toBe(true);
      expect(validate.isInteger(1)).toBe(true);
    });

    it("returns false for floats and other types ", function() {
      expect(validate.isInteger(Math.PI)).toBe(false);
      expect(validate.isInteger(null)).toBe(false);
      expect(validate.isInteger("1")).toBe(false);
    });
  });

  describe('isObject', function() {
    it("returns true for objects", function() {
      expect(validate.isObject({})).toBe(true);
      expect(validate.isObject({foo: "bar"})).toBe(true);
      expect(validate.isObject([])).toBe(true);
      expect(validate.isObject(function() {})).toBe(true);
    });

    it("returns false for non objects", function() {
      expect(validate.isObject(null)).toBe(false);
      expect(validate.isObject(1)).toBe(false);
      expect(validate.isObject("")).toBe(false);
      expect(validate.isObject(false)).toBe(false);
    });
  });

  describe('isDefined', function() {
    it("returns false for null and undefined", function() {
      expect(validate.isDefined(null)).toBe(false);
      expect(validate.isDefined(undefined)).toBe(false);
    });

    it("returns true for other values", function() {
      expect(validate.isDefined(true)).toBe(true);
      expect(validate.isDefined(0)).toBe(true);
      expect(validate.isDefined("")).toBe(true);
    });
  });

  describe("isPromise", function() {
    it("returns false for null and undefined", function() {
      expect(validate.isPromise(null)).toBe(false);
      expect(validate.isPromise(undefined)).toBe(false);
    });

    it("returns false for objects", function() {
      expect(validate.isPromise({})).toBe(false);
    });

    it("returns true for objects with a then function", function() {
      expect(validate.isPromise({then: "that"})).toBe(false);
      expect(validate.isPromise({then: function() {}})).toBe(true);
    });
  });

  describe('format', function() {
    it("replaces %{...} with the correct value", function() {
      var actual = validate.format("Foo is %{foo}, bar is %{bar}", {
        foo: "foo",
        bar: "bar"
      });
      expect(actual).toEqual("Foo is foo, bar is bar");
    });

    it("can replace the same value multiple times", function() {
      var actual = validate.format("%{foo} %{foo}", {foo: "foo"});
      expect(actual).toEqual("foo foo");
    });

    it("supports escaping %", function() {
      var actual = validate.format("Foo is %%{foo}", {foo: "foo"});
      expect(actual).toEqual("Foo is %{foo}");
    });
  });

  describe('prettify', function() {
    it("lower cases the entire string", function() {
      expect(validate.prettify("FOO BAR")).toEqual("foo bar");
    });

    it("replaces underscores with spaces", function() {
      expect(validate.prettify("foo_bar_baz")).toEqual("foo bar baz");
    });

    it("replaces dashes with spaces", function() {
      expect(validate.prettify("foo-bar-baz")).toEqual("foo bar baz");
    });

    it("splits camel cased words", function() {
      expect(validate.prettify("fooBar")).toEqual("foo bar");
    });

    it("replaces periods with spaces if no space follows", function() {
      expect(validate.prettify("foo.bar.baz")).toEqual("foo bar baz");
      expect(validate.prettify("foo. bar")).toEqual("foo. bar");
      expect(validate.prettify("foo .bar")).toEqual("foo .bar");
      expect(validate.prettify("foo.bar.")).toEqual("foo bar.");
    });

    it("replaces backslashes with nothing", function() {
      expect(validate.prettify("foo\\.bar\\.baz")).toEqual("foo bar baz");
      expect(validate.prettify("foo\\\\.bar")).toEqual("foo bar");
    });
  });

  describe('isString', function() {
    it("returns true for strings", function() {
      expect(validate.isString("foobar")).toBe(true);
      expect(validate.isString("")).toBe(true);
    });

    it("returns false for non strings", function() {
      var obj = {toString: function() { return "foobar"; }};
      expect(validate.isString(obj)).toBe(false);
      expect(validate.isString(null)).toBe(false);
      expect(validate.isString(true)).toBe(false);
    });
  });

  describe('isArray', function() {
    var isArray = validate.isArray;

    it("returns true for arrays", function() {
      expect(isArray([])).toBe(true);
      expect(isArray([1])).toBe(true);
      expect(isArray([1, 2])).toBe(true);
    });

    it("returns false for non arrays", function() {
      expect(isArray({})).toBe(false);
      expect(isArray(null)).toBe(false);
      expect(isArray(1)).toBe(false);
      expect(isArray(true)).toBe(false);
    });
  });

  describe('contains', function() {
    var contains = validate.contains;

    it("returns false when not passing in a target object", function() {
      expect(contains(null, "foo")).toBe(false);
      expect(contains(undefined, "foo")).toBe(false);
    });

    describe("arrays", function() {
      it("returns true if the value is in the specified array", function() {
        expect(contains(["foo", "bar", "baz"], "foo")).toBe(true);
        expect(contains(["foo", "bar", "baz"], "bar")).toBe(true);
        expect(contains(["foo", "bar", "baz"], "baz")).toBe(true);
      });

      it("returns false if the value is not in the specified array", function() {
        expect(contains(["foo", "bar", "baz"], "quux")).toBe(false);
        expect(contains(["foo", "bar", "baz"], false)).toBe(false);
        expect(contains(["foo", "bar", "baz"], 0)).toBe(false);
        expect(contains(["foo", "bar", "baz"], null)).toBe(false);
      });

      it("works with empty arrays", function() {
        expect(contains([], "foo")).toBe(false);
      });
    });

    describe("objects", function() {
      it("returns true if the value is a key in the object", function() {
        expect(contains({foo: false, bar: "bar"}, "foo")).toBe(true);
        expect(contains({foo: false, bar: "bar"}, "bar")).toBe(true);
      });

      it("returns false if the value is not a key in the object", function() {
        expect(contains({foo: false, bar: "bar"}, "quux")).toBe(false);
        expect(contains({foo: false, bar: "bar"}, null)).toBe(false);
        expect(contains({foo: false, bar: "bar"}, 1)).toBe(false);
        expect(contains({foo: false, bar: "bar"}, true)).toBe(false);
      });

      it("works with empty objects", function() {
        expect(contains({}, "foo")).toBe(false);
      });
    });
  });

  describe('capitalize', function() {
    var capitalize = validate.capitalize;

    it("captializes the first word", function() {
      expect(capitalize("foo")).toEqual("Foo");
      expect(capitalize("foo bar")).toEqual("Foo bar");
      expect(capitalize("foo bar baz")).toEqual("Foo bar baz");
    });

    it("returns the value for non strings", function() {
      var o = {foo: "bar"};
      expect(capitalize(o)).toEqual(o);
    });
  });

  describe('fullMessages', function() {
    var fullMessages = validate.fullMessages;

    it("prettyfies and prepends the attribute", function() {
      var errors = {
        foo: ["can't be blank", "is too short"],
        foo_bar: ["is simply not good enough"]
      };

      expect(fullMessages(errors)).toEqual({
        foo: ["Foo can't be blank", "Foo is too short"],
        foo_bar: ["Foo bar is simply not good enough"]
      });
    });

    it("doesn't modify the input", function() {
      var errors = {foo: ["can't be blank"]};
      fullMessages(errors);
      expect(errors).toEqual({foo: ["can't be blank"]});
    });

    it("returns an empty object if there are no errors", function() {
      expect(fullMessages()).toEqual({});
    });

    it("accepts a flatten option", function() {
      var errors = {
        foo: ["can't be blank", "is too short"],
        foo_bar: ["is simply not good enough"]
      };

      var actual = fullMessages(errors, {flatten: true});
      expect(actual.sort()).toEqual([
        "Foo bar is simply not good enough",
        "Foo can't be blank",
        "Foo is too short"
      ]);
    });

    it("returns an array if there are no errors and flatten is true", function() {
      expect(fullMessages(null, {flatten: true})).toEqual([]);
    });

    it("doesn't prepend the attribute name if the message starts with a ^", function() {
      var errors = {foo: ["^Please don't do that"]};
      expect(fullMessages(errors)).toEqual({foo: ["Please don't do that"]});
    });

    it("handles an escaped ^", function() {
      var errors = {foo: ["\\^ weird error"]};
      expect(fullMessages(errors)).toEqual({foo: ["Foo ^ weird error"]});
    });

    it("doesn't prepend the attribute name if fullMessages is false", function() {
      var errors = {
        foo: ["can't be blank", "is too short"],
        foo_bar: ["is simply not good enough"]
      };

      expect(fullMessages(errors, {fullMessages: false})).toEqual({
        foo: ["can't be blank", "is too short"],
        foo_bar: ["is simply not good enough"]
      });
    });

    it("still strips the leading ^ even if fullmessages if false", function() {
      var errors = {foo: ["^Please don't do that"]}
        , expected = {foo: ["Please don't do that"]};
      expect(fullMessages(errors, {fullMessages: false})).toEqual(expected);
    });
  });

  describe('isFunction', function() {
    var isFunction = validate.isFunction;

    it("returns true for functions", function() {
      expect(isFunction(function() {})).toBe(true);
    });

    it("returns false for non functions", function() {
      expect(isFunction({})).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction(1)).toBe(false);
      expect(isFunction(true)).toBe(false);
    });
  });

  describe('exposeModule', function() {
    var exposeModule = validate.exposeModule;

    it("supports simple browser inclusion", function() {
      var root = {};
      exposeModule(validate, root, null, null, null);
      expect(root.validate).toBe(validate);
    });

    it("supports AMD", function() {
      var root = {}
        , define = function(name, deps, func) {
          expect(name).toEqual("validate");
          expect(deps).toEqual([]);
          expect(typeof func).toBe('function');
          expect(func()).toBe(validate);
        };

      var defineSpy = jasmine.createSpy('define').and.callFake(define);

      exposeModule(validate, root, null, null, defineSpy);
      expect(defineSpy).not.toHaveBeenCalled();

      defineSpy.amd = true;

      exposeModule(validate, root, null, null, defineSpy);

      expect(defineSpy).toHaveBeenCalled();

      // It should still expose it through the root
      expect(root.validate).toBe(validate);
    });

    it("supports exports", function() {
      var root = {}
        , exports = {};

      exposeModule(validate, root, exports, null, null);

      expect(root).toEqual({});
      expect(exports.validate).toBe(validate);
    });

    it("supports module.exports", function() {
      var root = {}
        , exports = {}
        , module = {exports: true};

      exposeModule(validate, root, exports, module, null);

      expect(root).toEqual({});
      expect(module.exports).toEqual(validate);
      expect(module.exports.validate).toEqual(validate);
    });
  });

  describe("warn", function() {
    var console = window.console;

    beforeEach(function() {
      window.console = undefined;
    });

    afterEach(function() {
      window.console = console;
    });

    it("does nothing if the console isn't defined", function() {
      expect(function() { validate.warn("Msg"); }).not.toThrow();
    });

    it("calls console.warn if defined", function() {
      window.console = {
        warn: jasmine.createSpy("warn")
      };
      validate.warn("Msg");
      expect(window.console.warn).toHaveBeenCalledWith("Msg");
    });
  });

  describe("error", function() {
    var console = window.console;

    beforeEach(function() { window.console = undefined; });
    afterEach(function() { window.console = console; });

    it("does nothing if the console isn't defined", function() {
      validate.error("Msg");
      expect(function() { validate.error("Msg"); }).not.toThrow();
    });

    it("calls console.error if defined", function() {
      window.console = {
        error: jasmine.createSpy("error")
      };
      validate.error("Msg");
      expect(window.console.error).toHaveBeenCalledWith("Msg");
    });
  });

  describe("getDeepObjectValue", function() {
    it("supports multiple keys separated using a period", function() {
      var attributes = {
        foo: {
          bar: {
            baz: 3
          }
        }
      };

      expect(validate.getDeepObjectValue(attributes, "foo.bar.baz")).toBe(3);
    });

    it("returns undefined if any key is not found", function() {
      var attributes = {
        foo: {
          bar: {
            baz: 3
          }
        }
      };

      expect(validate.getDeepObjectValue(attributes, "bar.foo")).toBe(undefined);
      expect(validate.getDeepObjectValue(attributes, "foo.baz")).toBe(undefined);
    });

    it("handles the object being non objects", function() {
      expect(validate.getDeepObjectValue(null, "foo")).toBe(undefined);
      expect(validate.getDeepObjectValue("foo", "foo")).toBe(undefined);
      expect(validate.getDeepObjectValue(3, "foo")).toBe(undefined);
      expect(validate.getDeepObjectValue([], "foo")).toBe(undefined);
      expect(validate.getDeepObjectValue(true, "foo")).toBe(undefined);
    });

    it("handles the keypath being non strings", function() {
      expect(validate.getDeepObjectValue({}, null)).toBe(undefined);
      expect(validate.getDeepObjectValue({}, 3)).toBe(undefined);
      expect(validate.getDeepObjectValue({}, {})).toBe(undefined);
      expect(validate.getDeepObjectValue({}, [])).toBe(undefined);
      expect(validate.getDeepObjectValue({}, true)).toBe(undefined);
    });

    it("handles escapes properly", function() {
      var attributes = {
        "foo.bar": {
          baz: 3
        },
        "foo\\": {
          bar: {
            baz: 5
          }
        }
      };

      expect(validate.getDeepObjectValue(attributes, "foo.bar.baz"))
        .toBe(undefined);

      expect(validate.getDeepObjectValue(attributes, "foo\\.bar.baz"))
        .toBe(3);

      expect(validate.getDeepObjectValue(attributes, "foo\\\\.bar.baz"))
        .toBe(5);

      expect(validate.getDeepObjectValue(attributes, "\\foo\\\\.bar.baz"))
        .toBe(5);
    });
  });

  describe("isEmpty", function() {
    it("considers null and undefined values empty", function() {
      expect(validate.isEmpty(null)).toBe(true);
      expect(validate.isEmpty(undefined)).toBe(true);
    });

    it("considers functions non empty", function() {
      expect(validate.isEmpty(function(){})).toBe(false);
    });

    it("considers whitespace only strings empty", function() {
      expect(validate.isEmpty("")).toBe(true);
      expect(validate.isEmpty(" ")).toBe(true);
      expect(validate.isEmpty("         ")).toBe(true);
      expect(validate.isEmpty("foo")).toBe(false);
    });

    it("considers empty arrays empty", function() {
      expect(validate.isEmpty([])).toBe(true);
      expect(validate.isEmpty([1])).toBe(false);
    });

    it("considers empty objects empty", function() {
      expect(validate.isEmpty({})).toBe(true);
      expect(validate.isEmpty({foo: "bar"})).toBe(false);
    });

    it("considers false and 0 non empty", function() {
      expect(validate.isEmpty(false)).toBe(false);
      expect(validate.isEmpty(0)).toBe(false);
    });
  });

  describe("collectFormValues", function() {
    it("handles empty input", function() {
      expect(validate.collectFormValues()).toEqual({});
    });

    it("handles simple forms", function() {
      var form = document.createElement("form");
      form.innerHTML = '' +
        '<input type="text" name="text" value="example text">' +
        '<input type="text" name="empty-text">' +
        '<input type="email" name="email" value="example@email.com">' +
        '<input type="password" name="password" value="password!">' +
        '<input type="checkbox" name="selected-checkbox" value="checkbox" checked>' +
        '<input type="checkbox" name="deselected-checkbox" value="checkbox">' +
        '<input type="date" name="date" value="2015-03-08">' +
        '<input type="hidden" name="hidden" value="hidden">' +
        '<input type="number" name="number" value="4711">' +
        '<input type="url" name="url" value="http://validatejs.org">' +
        '<input type="radio" name="single-checked-radio" value="radio" checked>' +
        '<input type="radio" name="single-unchecked-radio" value="radio">' +
        '<radiogroup>' +
        '  <input type="radio" name="checked-radio" value="radio1">' +
        '  <input type="radio" name="checked-radio" value="radio2" checked>' +
        '  <input type="radio" name="checked-radio" value="radio3">' +
        '</radiogroup>' +
        '<radiogroup>' +
        '  <input type="radio" name="unchecked-radio" value="radio1">' +
        '  <input type="radio" name="unchecked-radio" value="radio2">' +
        '  <input type="radio" name="unchecked-radio" value="radio3">' +
        '</radiogroup>' +
        '<select name="selected-dropdown">' +
        '  <option>' +
        '  <option value="option1">' +
        '  <option value="option2" selected>' +
        '</select>' +
        '<select name="unselected-dropdown">' +
        '  <option>' +
        '  <option value="option1">' +
        '  <option value="option2">' +
        '</select>';

      expect(validate.collectFormValues(form)).toEqual({
        text: "example text",
        "empty-text": null,
        email: "example@email.com",
        password: "password!",
        "selected-checkbox": "checkbox",
        "deselected-checkbox": null,
        date: "2015-03-08",
        hidden: "hidden",
        number: 4711,
        url: "http://validatejs.org",
        "single-checked-radio": "radio",
        "single-unchecked-radio": null,
        "checked-radio": "radio2",
        "unchecked-radio": null,
        "selected-dropdown": "option2",
        "unselected-dropdown": null
      });
    });

    it("has an option to nullify empty and trim strings", function() {
      var form = document.createElement("form");
      form.innerHTML = '' +
        '<input type="text" name="normal" value="normal">' +
        '<input type="text" name="empty">' +
        '<input type="text" name="whitespace" value=" ">' +
        '<input type="text" name="trimmed" value=" foo ">';

      var options = {nullify: false};
      expect(validate.collectFormValues(form, options)).toEqual({
        normal: "normal",
        empty: "",
        whitespace: " ",
        trimmed: " foo "
      });

      options = {nullify: true};
      expect(validate.collectFormValues(form, options)).toEqual({
        normal: "normal",
        empty: null,
        whitespace: " ",
        trimmed: " foo "
      });

      options = {trim: true};
      expect(validate.collectFormValues(form, options)).toEqual({
        normal: "normal",
        empty: null,
        whitespace: null,
        trimmed: "foo"
      });
    });

    it("has a way to ignore elements", function() {
      var form = document.createElement("form");
      form.innerHTML = '<input type="text" name="ignored" value="ignored" data-ignored>';
      expect(validate.collectFormValues(form)).toEqual({});
    });

    it("uses true/false for checkboxes without a value", function() {
      var form = document.createElement("form");
      form.innerHTML = '' +
        '<input type="checkbox" name="checked" checked>' +
        '<input type="checkbox" name="unchecked">';

      expect(validate.collectFormValues(form)).toEqual({
        checked: true,
        unchecked: false
      });
    });
  });

  describe("isDomElement", function() {
    it("returns true of DOM elements", function() {
      var form = document.createElement("form")
        , div = document.createElement("div")
        , a = document.createElement("a");

      expect(validate.isDomElement(form)).toBe(true);
      expect(validate.isDomElement(div)).toBe(true);
      expect(validate.isDomElement(a)).toBe(true);
      expect(validate.isDomElement(document)).toBe(true);
    });

    it("returns false for other objects", function() {
      expect(validate.isDomElement({})).toBe(false);
      expect(validate.isDomElement(0)).toBe(false);
      expect(validate.isDomElement(true)).toBe(false);
      expect(validate.isDomElement("foo")).toBe(false);
      expect(validate.isDomElement("")).toBe(false);
      expect(validate.isDomElement([])).toBe(false);
    });
  });
});
