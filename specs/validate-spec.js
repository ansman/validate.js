describe("validate", function() {
  var validators = validate.validators
    , fail
    , fail2
    , pass
    , pass2;

  beforeEach(function() {
    fail = jasmine.createSpy('failValidator').andReturn("my error");
    fail2 = jasmine.createSpy('failValidator2').andReturn("my error");
    pass = jasmine.createSpy('passValidator');
    pass2 = jasmine.createSpy('passValidator2');
    validators.pass = pass;
    validators.pass2 = pass2;
    validators.fail = fail;
    validators.fail2 = fail2;
  });

  afterEach(function() {
    delete validators.fail;
    delete validators.fail2;
    delete validators.pass;
    delete validators.pass2;
  });

  it("throws an error when the validator is not found", function() {
    expect(function() {
      validate({}, {name: {foobar: true}});
    }).toThrow("Unknown validator foobar");
  });

  it("calls the validator with the validator itself as context", function() {
    validate({}, {name: {pass: true}});
    expect(pass).toHaveBeenCalledWithContext(pass);
  });

  it("calls the validator with the val, opts, key and attributes", function() {
    var options = {someOption: true}
      , attributes = {someAttribute: 'some value'}
      , constraints = {someAttribute: {pass: options}};
    validate(attributes, constraints);
    expect(pass).toHaveBeenCalledWith('some value',
                                      options,
                                      'someAttribute',
                                      attributes);
  });

  it("allows the validator to return a string", function() {
    fail.andReturn("foobar");
    var constraints = {name: {fail: true}};
    expect(validate({}, constraints)).toEqual({name: ["Name foobar"]});
  });

  it("allows the validator to return an array", function() {
    fail.andReturn(["foo", "bar"]);
    var constraints = {name: {fail: true}};
    expect(validate({}, constraints)).toEqual({name: ["Name foo", "Name bar"]});
  });

  it("validates all attributes", function() {
    fail.andReturn("error");
    var constraints = {
      attr1: {pass: true},
      attr2: {fail: true},
      attr3: {fail: true}
    };
    expect(validate({}, constraints)).toEqual({
      attr2: ["Attr2 error"],
      attr3: ["Attr3 error"]
    });
  });

  it("handles the case where the same attribute has multiple errors", function() {
    fail.andReturn("error");
    fail2.andReturn(["err", "or"]);
    var constraints = {
      attr: {
        fail: true,
        fail2: true
      }
    };

    var actual = validate({}, constraints).attr.sort();
    expect(actual).toEqual(["Attr err", "Attr error", "Attr or"]);
  });

  it("allows the options for an attribute to be a function", function() {
    var options = {pass: {option1: "value1"}}
      , attrs = {name: "Nicklas"}
      , spy = jasmine.createSpy("options").andReturn(options)
      , constraints = {name: spy};
    validate(attrs, constraints);
    expect(spy).toHaveBeenCalledWith("Nicklas", attrs, "name");
    expect(pass).toHaveBeenCalledWith("Nicklas", options.pass, "name", attrs);
  });

  it("allows the options for a validator to be a function", function() {
    var options = {option1: "value1"}
      , attrs = {name: "Nicklas"}
      , spy = jasmine.createSpy("options").andReturn(options)
      , constraints = {name: {pass: spy}};
    validate(attrs, constraints);
    expect(spy).toHaveBeenCalledWith("Nicklas", attrs, "name");
    expect(pass).toHaveBeenCalledWith("Nicklas", options, "name", attrs);
  });

  it("doesnt run the validations if the options are falsy", function() {
    validate({}, {name: {pass: false}, email: {pass: null}});
    expect(pass).not.toHaveBeenCalled();
  });

  describe("fullMessages", function() {
    it("calls fullMessages regardless of the fullMessages option", function() {
      spyOn(validate, 'fullMessages');
      var options = {option1: "value1", fullMessages: false}
        , constraints = {name: {fail: true}};

      validate({}, constraints, options);
      expect(validate.fullMessages).toHaveBeenCalledWith(
        {name: ["my error"]},
        options
      );

      options.fullMessages = true;
      validate({}, constraints, options);
      expect(validate.fullMessages).toHaveBeenCalledWith(
        {name: ["my error"]},
        options
      );
    });
  });
});
