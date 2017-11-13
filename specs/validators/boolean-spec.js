describe('validator.boolean', function() {
  var boolean = validate.validators.boolean.bind(validate.validators.boolean);

  afterEach(function() {
    delete validate.validators.boolean.message;
    delete validate.validators.boolean.options;
  });

  it("doesn't allow empty values", function() {
    expect(boolean('', {})).toBeDefined();
    expect(boolean('  ', {})).toBeDefined();
    expect((null, {})).toBeDefined();
    expect(boolean(undefined, {})).toBeDefined();
    expect(boolean([], {})).toBeDefined();
    expect(boolean({}, {})).toBeDefined();
  });

  it("doesn't allow string values", function() {
    expect(boolean("1234", {})).toBeDefined();
  });

  it("doesn't allow numeric values", function() {
    expect(boolean(1234, {})).toBeDefined();
  });

  it("doesn't allow array values", function() {
    expect(boolean([1, 2], {})).toBeDefined();
  });

  it("allows boolean values", function() {
    expect(boolean(true, true)).not.toBeDefined();
    expect(boolean(true, false)).not.toBeDefined();
  });

  it("has a nice default message", function() {
    var msg = boolean("abcd");
    expect(msg).toEqual("is not a boolean");
  });
});
