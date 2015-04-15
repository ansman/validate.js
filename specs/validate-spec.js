describe("validate", function() {
  var validators = validate.validators
    , fail
    , fail2
    , pass
    , pass2;

  beforeEach(function() {
    fail = jasmine.createSpy('failValidator').and.returnValue("my error");
    fail2 = jasmine.createSpy('failValidator2').and.returnValue("my error");
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
    delete validate.options;
  });

  it("raises an error if a promise is returned", function() {
    fail.and.returnValue(new validate.Promise(function() {}));
    var constraints = {name: {fail: true}};
    expect(function() { validate({}, constraints); }).toThrow();
  });

  it("runs as expected", function() {
    var attributes = {
      name: "Nicklas Ansman",
      email: "nicklas@ansman.se",
      addresses: {
        work: {
          street: "Drottninggatan 98",
          city: "Stockholm"
        }
      }
    };
    var constraints = {
      name: {
        pass: true
      },
      email: {
        pass: true,
        fail: true,
        fail2: true
      },
      "addresses.work.street": {
        pass: true,
        fail2: true,
      },
      "addresses.work.city": {
        pass: true
      },
    };

    fail.and.returnValue("must be a valid email address");
    fail2.and.returnValue("is simply not good enough");

    expect(validate(attributes, constraints)).toEqual({
      email: [
        "Email must be a valid email address",
        "Email is simply not good enough"
      ],
      "addresses.work.street": [
        "Addresses work street is simply not good enough"
      ]
    });

    expect(validate(attributes, constraints, {format: "flat"})).toEqual([
      "Email must be a valid email address",
      "Email is simply not good enough",
      "Addresses work street is simply not good enough"
    ]);
  });

  it("fails validation when nested objects is null", function() {
    var constraints = {
      "foo.bar": {
        presence: true
      }
    };
    expect(validate({foo: null}, constraints)).toBeDefined();
  });

  it("works with nested objects", function() {
    var constraints = {
      "foo.bar": {
        presence: true
      }
    };
    expect(validate({foo: {bar: "test"}}, constraints)).not.toBeDefined();
  });

  it("works with dotted notation", function() {
    var constraints = {
      "foo\\.bar": {
        presence: true
      }
    };
    expect(validate({"foo.bar": "test"}, constraints)).not.toBeDefined();
  });

  it("formats validation entries nicely on dotted notation", function() {
    var constraints = {
      "foo\\.bar": {
        presence: true
      }
    };
    expect(validate({"foo.bar": null}, constraints)).toEqual({
      "foo\\.bar": ["Foo bar can't be blank"]
    });
  });

  describe("runValidations", function() {
    it("throws an error when the validator is not found", function() {
      expect(function() {
        validate.runValidations({}, {name: {foobar: true}}, {});
      }).toThrow(new Error("Unknown validator foobar"));
    });

    it("calls the validator with the validator itself as context", function() {
      validate.runValidations({}, {name: {pass: true}}, {});
      expect(pass).toHaveBeenCalledWithContext(pass);
    });

    it("calls the validator with the val, opts, key and attributes", function() {
      var options = {someOption: true}
        , attributes = {someAttribute: 'some value'}
        , constraints = {someAttribute: {pass: options}};
      validate.runValidations(attributes, constraints, {});
      expect(pass).toHaveBeenCalledWith('some value',
                                        options,
                                        'someAttribute',
                                        attributes);
    });

    it("returns an array of results", function() {
      fail.and.returnValue("foobar");
      fail2.and.returnValue(["foo", "bar"]);
      pass.and.returnValue(null);

      var options = {someOption: true}
        , constraints = {name: {fail: options, fail2: true, pass: true}};
      var result = validate.runValidations({name: "test"}, constraints, {});

      expect(result).toHaveItems([{
        attribute: "name",
        value: "test",
        validator: "fail",
        options: options,
        error: "foobar"
      }, {
        attribute: "name",
        value: "test",
        validator: "fail2",
        options: true,
        error: ["foo", "bar"]
      }, {
        attribute: "name",
        value: "test",
        validator: "pass",
        options: true,
        error: null
      }]);
    });

    it("validates all attributes", function() {
      fail.and.returnValue("error");
      var constraints = {
        attr1: {pass: {foo: "bar"}},
        attr2: {fail: true},
        attr3: {fail: true}
      };
      expect(validate.runValidations({}, constraints, {})).toHaveItems([
        {
          attribute: "attr1",
          value: undefined,
          validator: "pass",
          options: {foo: "bar"},
          error: undefined
        }, {
          attribute: "attr2",
          value: undefined,
          validator: "fail",
          options: true,
          error: "error"
        }, {
          attribute: "attr3",
          value: undefined,
          validator: "fail",
          options: true,
          error: "error"
        }
      ]);
    });

    it("allows the options for an attribute to be a function", function() {
      var options = {pass: {option1: "value1"}}
        , attrs = {name: "Nicklas"}
        , spy = jasmine.createSpy("options").and.returnValue(options)
        , constraints = {name: spy}
        , globalOptions = {foo: "bar"};
      validate.runValidations(attrs, constraints, globalOptions);
      expect(spy).toHaveBeenCalledWith("Nicklas", attrs, "name", globalOptions, constraints);
      expect(pass).toHaveBeenCalledWith("Nicklas", options.pass, "name", attrs);
    });

    it("allows the options for a validator to be a function", function() {
      var options = {option1: "value1"}
        , attrs = {name: "Nicklas"}
        , spy = jasmine.createSpy("options").and.returnValue(options)
        , constraints = {name: {pass: spy}}
        , globalOptions = {foo: "bar"};
      validate.runValidations(attrs, constraints, globalOptions);
      expect(spy).toHaveBeenCalledWith("Nicklas", attrs, "name", globalOptions, constraints);
      expect(pass).toHaveBeenCalledWith("Nicklas", options, "name", attrs);
    });

    it("doesnt run the validations if the options are falsy", function() {
      validate.runValidations({}, {name: {pass: false}, email: {pass: null}}, {});
      expect(pass).not.toHaveBeenCalled();
    });

    it("calls collectFormValues if the attributes is a DOM element", function() {
      var form = document.createElement("div");
      form.innerHTML = '<input type="text" name="foo" value="bar">';
      spyOn(validate, "collectFormValues").and.callThrough();
      spyOn(validate.validators, "presence").and.callThrough();
      var constraints = {foo: {presence: true}};
      validate(form, constraints);

      expect(validate.collectFormValues).toHaveBeenCalledWith(form);
      expect(validate.validators.presence).toHaveBeenCalledWith(
        "bar",
        true,
        "foo",
        {foo: "bar"}
      );
    });
  });

  describe("format", function() {
    describe("flat", function() {
      it("returns a flat list of errors", function() {
        var c = {
          foo: {
            presence: true,
            numericality: true,
            length: {
              is: 23,
              wrongLength: "some error"
            }
          }
        };
        expect(validate({foo: "bar"}, c, {format: "flat"})).toHaveItems([
          "Foo some error",
          "Foo is not a number"
        ]);
      });

      it("fullMessages = false", function() {
        var constraints = {foo: {presence: true}}
          , options = {format: "flat", fullMessages: false};
        expect(validate({}, constraints, options)).toEqual(["can't be blank"]);
      });
    });

    describe("detailedErrors", function() {
      it("allows you to get more info about the errors", function() {
        var attributes = {
          foo: "foo",
          bar: 10
        };
        var c = {
          foo: {
            presence: true,
            length: {
              is: 15,
              message: "^foobar",
              someOption: "someValue"
            }
          },
          bar: {
            numericality: {
              lessThan: 5,
              greaterThan: 15
            }
          }
        };
        expect(validate(attributes, c, {format: "detailed"})).toHaveItems([{
            attribute: "foo",
            value: "foo",
            validator: "length",
            options: {
              is: 15,
              message: "^foobar",
              someOption: "someValue"
            },
            error: "foobar"
          }, {
            attribute: "bar",
            value: 10,
            validator: "numericality",
            options: {
              lessThan: 5,
              greaterThan: 15
            },
            error: "Bar must be greater than 15"
          }, {
            attribute: "bar",
            value: 10,
            validator: "numericality",
            options: {
              lessThan: 5,
              greaterThan: 15
            },
            error: "Bar must be less than 5"
        }]);
      });
    });
  });

  it("allows default options", function() {
    var constraints = {foo: {presence: true}}
      , options = {foo: "bar"};
    validate.options = {format: "flat"};
    expect(validate({}, constraints, options)).toEqual(["Foo can't be blank"]);
    expect(options).toEqual({foo: "bar"});
    expect(validate.options).toEqual({format: "flat"});
  });

  describe("single", function() {
    it("validates the single property", function() {
      var validators = {
        presence: {
          message: "example message"
        },
        length: {
          is: 6,
          message: "^It needs to be 6 characters long"
        }
      };

      expect(validate.single(null, validators)).toEqual(["example message"]);
      expect(validate.single("foo", validators)).toEqual(["It needs to be 6 characters long"]);
      expect(validate.single("foobar", validators)).not.toBeDefined();
    });

    it("doesn't support the format and fullMessages options", function() {
      var validators = {presence: true}
        , options = {format: "detailed", fullMessages: true};

      expect(validate.single(null, validators, options))
        .toEqual(["can't be blank"]);
    });
  });

  describe("version", function() {
    var metadata = validate.version.metadata;

    beforeEach(function() {
      validate.version.metadata = null;
    });

    afterEach(function() {
      validate.version.metadata = metadata;
    });

    it("contains major, minor and patch version", function() {
      expect(validate.version.major).toBeANumber();
      expect(validate.version.minor).toBeANumber();
      expect(validate.version.patch).toBeANumber();
    });

    it("can be converted to a string", function() {
      var version = validate.version.major + "." +
        validate.version.minor + "." +
        validate.version.patch;

      expect("" + validate.version).toEqual(version);
    });

    it("the string version can have metadata", function() {
      var version = validate.version.major + "." +
        validate.version.minor + "." +
        validate.version.patch + "+foobar";

      validate.version.metadata = "foobar";

      expect("" + validate.version).toEqual(version);
    });
  });
});
