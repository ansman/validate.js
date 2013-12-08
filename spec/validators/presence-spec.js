describe('validator.presence', function() {
  var presence = validate.validators.presence;

  it("doesn't allow empty values", function() {
    expect(presence('', {})).toBeDefined();
    expect(presence('  ', {})).toBeDefined();
    expect(presence(null, {})).toBeDefined();
    expect(presence(undefined, {})).toBeDefined();
    expect(presence([], {})).toBeDefined();
    expect(presence({}, {})).toBeDefined();
  });

  it("allows non empty values", function() {
    expect(presence('foo', {})).not.toBeDefined();
    expect(presence(0, {})).not.toBeDefined();
    expect(presence(false, {})).not.toBeDefined();
    expect(presence([null], {})).not.toBeDefined();
    expect(presence({foo: null}, {})).not.toBeDefined();
    expect(presence(function(){return null;}, {})).not.toBeDefined();
  });

  it("has a nice default message", function() {
    var msg = presence(null, {});
    expect(msg).toEqual("can't be blank");
  });

  it("also allows to specify your own nice message", function() {
    var options = {message: "my message"};
    var msg = presence(null, options);
    expect(msg).toEqual(options.message);
  });
});
