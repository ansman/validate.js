describe('validators.each', function() {
  var each = validate.validators.each.bind(validate.validators.each);

  var isPositive = function(number) {
    if (number > 0) {
      return undefined;
    } else {
      return 'negative';
    }
  };

  afterEach(function() {
    delete validate.validators.each.message;
    delete validate.validators.each.options;
  });

  it("allows undefined values", function() {
    expect(each(null, {})).not.toBeDefined();
    expect(each(undefined, {})).not.toBeDefined();
  });

  it("does not allow values that aren't arrays", function() {
    expect(each({}, {})).toBeDefined();
    expect(each(function () {}, {})).toBeDefined();
    expect(each("", {})).toBeDefined();
    expect(each(1, {})).toBeDefined();
    expect(each(true, {})).toBeDefined();
  });

  it("has a default error message", function() {
    expect(each({}, {})).toEqual("must be an array");
  });

  it("allows for a message to be attached to the validator", function() {
    var validatorMessage = "validatorMessage";
    validate.validators.each.message = validatorMessage;
    expect(each({}, {})).toEqual(validatorMessage);
  });

  it("allows for a message to be passed as an option to override ", function() {
    var optionMessage = "optionMessage";
    validate.validators.each.message = "validatorMessage";
    expect(each({}, {message : optionMessage})).toEqual(optionMessage);
  });

  it("accepts the value if no validator function is provided", function () {
    expect(each([], {})).not.toBeDefined();
    expect(each([], {validator : {}})).not.toBeDefined();
    expect(each([], {validator : ""})).not.toBeDefined();
    expect(each([], {validator : 1})).not.toBeDefined();
    expect(each([], {validator : []})).not.toBeDefined();
    expect(each([], {validator : true})).not.toBeDefined();
    expect(each([], {validator : null})).not.toBeDefined();
  });

  it("accepts an empty array", function () {
    expect(each([], {validator : function () {}})).not.toBeDefined();
    expect(each([], {validator : function () {return 'error';}})).not.toBeDefined();
  });

  it("accepts a valid array", function () {
    var array = [1, 2, 3, 4, 5];
    expect(each(array, {validator : isPositive})).not.toBeDefined();
  });

  it("returns an array of errors if anything fails", function () {
    var array = [-1, 2, 3, 4, 5];
    expect(each(array, {validator : isPositive})).toEqual(['negative', undefined, undefined, undefined, undefined]);
  });

});
