describe('validators.type', function() {
  var type = validate.validators.type;
  type = type.bind(type);

  afterEach(function() {
    delete validate.validators.type.message;
    delete validate.validators.type.options;
    delete validate.validators.type.types.custom;
  });

  it("allows empty values", function() {
    expect(type(null, "string", "foo", {})).not.toBeDefined();
    expect(type(undefined, "string", "foo", {})).not.toBeDefined();
  });

  it("allows the correct type", function() {
    expect(type("", {type: "string"}, "foo", {})).not.toBeDefined();
    expect(type({}, {type: "object"}, "foo", {})).not.toBeDefined();
    expect(type([], {type: "array"}, "foo", {})).not.toBeDefined();
    expect(type(1, {type: "number"}, "foo", {})).not.toBeDefined();
    expect(type(1.1, {type: "number"}, "foo", {})).not.toBeDefined();
    expect(type(1, {type: "integer"}, "foo", {})).not.toBeDefined();
    expect(type(true, {type: "boolean"}, "foo", {})).not.toBeDefined();
    expect(type(new Date(), {type: "date"}, "foo", {})).not.toBeDefined();
  });

  it("doesn't allow the incorrect type", function() {
    expect(type(new Date(), {type: "string"}, "foo", {})).toBeDefined();
    expect(type("", {type: "object"}, "foo", {})).toBeDefined();
    expect(type([], {type: "object"}, "foo", {})).toBeDefined();
    expect(type({}, {type: "array"}, "foo", {})).toBeDefined();
    expect(type([], {type: "number"}, "foo", {})).toBeDefined();
    expect(type(1.1, {type: "integer"}, "foo", {})).toBeDefined();
    expect(type(1, {type: "boolean"}, "foo", {})).toBeDefined();
    expect(type(true, {type: "date"}, "foo", {})).toBeDefined();
  });

  it("has a nice default message", function() {
    expect(type(new Date(), {type: "string"}, "foo", {})).toBe("must be of type string");
    expect(type("", {type: "object"}, "foo", {})).toBe("must be of type object");
    expect(type({}, {type: "array"}, "foo", {})).toBe("must be of type array");
    expect(type([], {type: "number"}, "foo", {})).toBe("must be of type number");
    expect(type(1.1, {type: "integer"}, "foo", {})).toBe("must be of type integer");
    expect(type(1, {type: "boolean"}, "foo", {})).toBe("must be of type boolean");
    expect(type(true, {type: "date"}, "foo", {})).toBe("must be of type date");
  });

  it("allows you to customize the error message", function() {
    validate.validators.type.message = "some message %{attribute}";
    expect(type("", {type: "object"}, "foo", {})).toBe("some message foo");
    var options = {type: "object", message: "some other message %{attribute}"};
    expect(type("", options, "foo", {})).toBe("some other message foo");
  });

  it("allows functions as messages", function() {
    var message = function() { return "foo"; };
    var options = {type: "object", message: message};
    expect(type("", options, "foo", {})).toBe("foo");
  });

  it("allows custom checks", function() {
    var globalOptions = {"globalOption": "globalValue"};
    var attributes = {"attr": "value"};
    var options = {type: "custom"};
    var ret = false;
    validate.validators.type.types.custom = function(value, opts, attr, attrs, gopts) {
      expect(value).toBe("value");
      expect(opts).toEqual(options);
      expect(attr).toBe("foo");
      expect(attrs).toBe(attributes);
      expect(gopts).toBe(globalOptions);
      return ret;
    };
    expect(type("value", options, "foo", attributes, globalOptions)).toEqual("must be of type custom");
    ret = true;
    expect(type("value", options, "foo", attributes, globalOptions)).not.toBeDefined();
  });

  it("allows inline checks", function() {
    var globalOptions = {"globalOption": "globalValue"};
    var attributes = {"attr": "value"};
    var value = "value";
    var options = {
      type: function(v, opts, attr, attrs, gopts) {
        expect(v).toBe(value);
        expect(opts).toEqual(options);
        expect(attr).toBe("foo");
        expect(attrs).toBe(attributes);
        expect(gopts).toBe(globalOptions);
        return value === "other";
      }
    };
    expect(type(value, options, "foo", attributes, globalOptions)).toEqual("must be of the correct type");
    value = "other";
    expect(type(value, options, "foo", attributes, globalOptions)).not.toBeDefined();
  });

  it("allows custom messages per check", function() {
    var globalOptions = {"globalOption": "globalValue"};
    var attributes = {"attr": "value"};
    var options = {type: "custom"};
    validate.validators.type.types.custom = function() { return false; };
    validate.validators.type.messages.custom = "my custom message";
    expect(type("value", options, "foo", globalOptions)).toEqual("my custom message");
    validate.validators.type.messages.custom = function(value, opts, attr, attrs, gopts) {
      expect(value).toBe("value");
      expect(opts).toEqual(options);
      expect(attr).toBe("foo");
      expect(attrs).toBe(attributes);
      expect(gopts).toBe(globalOptions);
      return "my other custom message";
    };
    expect(type("value", options, "foo", attributes, globalOptions)).toEqual("my other custom message");
  });

  it("throws if the type isn't valid", function() {
    expect(function() { type("", {}, "foo", {}); }).toThrow();
      expect(function() { type("", "invalid", "foo", {}); }).toThrow();
  });
});
