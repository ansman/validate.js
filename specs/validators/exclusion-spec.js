describe("validators.exclusion", function() {
  var exclusion = validate.validators.exclusion
    , within = ["foo", "bar", "baz"];

  it("returns nothing if the value is not defined", function() {
    expect(exclusion(null, {})).not.toBeDefined();
    expect(exclusion(undefined, {})).not.toBeDefined();
  });

  it("returns nothing if the value is allowed", function() {
    var opts = {within: within};
    expect(exclusion("quux", opts)).not.toBeDefined();
    expect(exclusion(false, opts)).not.toBeDefined();
    expect(exclusion(1, opts)).not.toBeDefined();
  });

  it("returns an error if the value is not allowed", function() {
    var opts = {within: within};
    expect(exclusion("foo", opts)).toEqual("^foo is restricted");
    expect(exclusion("bar", opts)).toEqual("^bar is restricted");
    expect(exclusion("baz", opts)).toEqual("^baz is restricted");
  });

  it("allows you to customize the message", function() {
    var opts = {within: within, message: "^The value %{value} is not valid"};
    expect(exclusion("foo", opts)).toEqual("^The value foo is not valid");
  });

  it("uses the keys if the within value is an object", function() {
    expect(exclusion("foo", {within: {foo: true}})).toBeDefined();
    expect(exclusion("bar", {within: {foo: true}})).not.toBeDefined();
  });

  it("uses the options as the within list if the options is an array", function() {
    expect(exclusion("foo", ["foo", "bar"])).toBeDefined();
    expect(exclusion("baz", ["foo", "bar"])).not.toBeDefined();
  });
});
