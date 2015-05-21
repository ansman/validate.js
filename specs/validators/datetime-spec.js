describe('validators.datetime', function() {
  var datetime = validate.validators.datetime.bind(validate.validators.datetime)
    , XDate = validate.XDate
    , moment = validate.moment;

  afterEach(function() {
    delete validate.validators.datetime.notValid;
    delete validate.validators.datetime.tooEarly;
    delete validate.validators.datetime.tooLate;
    delete validate.validators.datetime.options;
    validate.XDate = XDate;
    validate.moment = moment;
  });

  it("allows empty values", function() {
    expect(datetime(null, {})).not.toBeDefined();
    expect(datetime(undefined, {})).not.toBeDefined();
    expect(datetime("", {})).not.toBeDefined();
    expect(datetime("  ", {})).not.toBeDefined();
  });

  describe("parse", function() {
    var parse = validate.validators.datetime.parse;

    beforeEach(function() {
      delete validate.XDate;
      delete validate.moment;
    });

    it("throws an error if neither XDate or moment.js is found", function() {
      expect(function() {
        parse("2014-09-02");
      }).toThrow();
    });

    function runParseTestsForValidDates() {
        // 2013-10-25 00:00:00 UTC
        expect(parse("2013-10-26", {})).toEqual(1382745600000);

        // 1000-01-01 00:00:00 UTC
        expect(parse("1000-01-01", {})).toEqual(-30610224000000);

        // UTC
        expect(parse("2013-10-26T10:35:24", {})).toEqual(1382783724000);
        // PDT
        expect(parse("2013-10-26T10:35:24-0700", {})).toEqual(1382808924000);

        // PDT
        var date = new Date("2013-10-26T10:35:24-0700");
        expect(parse(date, {})).toEqual(date.getTime());
    }

    function runNaNTests() {
      expect(parse("foobar", {})).toBeNaN();
    }

    describe("with XDate", function() {
      beforeEach(function() {
        validate.XDate = XDate;
      });

      it("returns the millis since epoch for valid strings", function() {
        runParseTestsForValidDates();
      });

      it("returns NaN for invalid dates", function() {
        runNaNTests();
      });
    });

    describe("with moment.js", function() {
      beforeEach(function() {
        validate.moment = moment;
        spyOn(moment, "utc").and.callThrough();
      });

      it("returns the millis since epoch for valid strings", function() {
        runParseTestsForValidDates();
        expect(moment.utc).toHaveBeenCalled();
      });

      it("returns NaN for invalid dates", function() {
        runNaNTests();
        expect(moment.utc).toHaveBeenCalled();
      });
    });
  });

  describe("format", function() {
    var format = validate.validators.datetime.format;

    beforeEach(function() {
      delete validate.XDate;
      delete validate.moment;
    });

    it("throws and error if neither XDate or moment.js is found", function() {
      expect(function() {
        format(1382808924000, {});
      }).toThrow();
    });

    function runDatetimeTest() {
      var expected = "2013-10-26 17:35:24";
      expect(format(1382808924000, {})).toBe(expected);
    }

    function runDateTest() {
      var expected = "2013-10-26";
      expect(format(1382745600000, {dateOnly: true})).toBe(expected);
    }

    function runOverrideTest(dateFormat) {
      var expected = "10/26/13";
      expect(format(1382808924000, {dateFormat: dateFormat})).toBe(expected);
    }

    describe("with XDate", function() {
      beforeEach(function() {
        validate.XDate = XDate;
      });

      it("formats as ISO8601 in errors", function() {
        runDatetimeTest();
      });

      it("only includes the date part it dateOnly is set", function() {
        runDateTest();
      });

      it("allows you to override the format string", function() {
        runOverrideTest("MM/dd/yy");
      });
    });

    describe("with moment.js", function() {
      beforeEach(function() {
        validate.moment = moment;
        spyOn(moment, "utc").and.callThrough();
      });

      it("formats as ISO8601 in errors", function() {
        runDatetimeTest();
        expect(moment.utc).toHaveBeenCalled();
      });

      it("only includes the date part it dateOnly is set", function() {
        runDateTest();
        expect(moment.utc).toHaveBeenCalled();
      });

      it("allows you to override the format string", function() {
        runOverrideTest("MM/DD/YY");
        expect(moment.utc).toHaveBeenCalled();
      });
    });
  });

  it("allows valid dates", function() {
    expect(datetime("2013-10-26 13:47:00", {})).not.toBeDefined();
  });

  it("allows date objects", function() {
    expect(datetime(new Date(), {})).not.toBeDefined();
  });

  it("doesn't allow invalid dates", function() {
    var expected = "must be a valid date";
    expect(datetime("foobar", {})).toEqual(expected);
  });

  it("uses the parse function to validate dates", function() {
    var spy = spyOn(validate.validators.datetime, 'parse').and.returnValue(NaN)
      , options = {foo: "bar"};
    expect(datetime("2013-06-27", options)).toBeDefined();
    expect(spy).toHaveBeenCalledWith("2013-06-27", options);
  });

  it("doesn't allow h, m or s when dateOnly is true", function() {
    var expected = "must be a valid date"
      , opts = {dateOnly: true};
    expect(datetime("2013-10-26 13:47:00", opts)).toEqual(expected);
    expect(datetime("2013-10-26", opts)).not.toBeDefined();
  });

  it("returns the message if specified for invalid dates", function() {
    validate.validators.datetime.notValid = "notValid";
    expect(datetime("foobar", {})).toEqual("notValid");

    var opts = {message: "my other message"};
    expect(datetime("foobar", opts)).toEqual("my other message");
  });

  describe("earliest", function() {
    it("doesn't allow earlier dates", function() {
      var options = {earliest: '2013-10-26 00:00:00'}
        , value = "2013-10-25 23:59:59"
        , expected = ["must be no earlier than 2013-10-26 00:00:00"];

      expect(datetime(value, options)).toEqual(expected);
    });

    it("allows earlier or equal dates", function() {
      var options = {earliest: '2013-10-26 00:00:00'}
        , value = "2013-10-26 00:00:00";
      expect(datetime(value, options)).not.toBeDefined();
      value = "2013-10-27 00:00:00";
      expect(datetime(value, options)).not.toBeDefined();
    });

    it("formats the error using the format function", function() {
      var options = {earliest: '2013-10-26 00:00:00'}
        , value = "2013-10-25 00:00:00"
        , spy = spyOn(validate.validators.datetime, 'format').and.returnValue("foobar")
        , expected = ["must be no earlier than foobar"];
      expect(datetime(value, options)).toEqual(expected);
    });

    it("parses the earliest value using the parse function", function() {
      var options = {earliest: 'foobar'}
        , value = XDate.today()
        , spy = spyOn(validate.validators.datetime, 'parse').and.returnValue(value);
      datetime(value, options);
      expect(spy).toHaveBeenCalledWith('foobar', options);
    });

    it("uses the default message if available", function() {
      var options = {earliest: '2013-10-26 00:00:00'}
        , value = "2013-10-25 23:59:59";

      validate.validators.datetime.tooEarly = "default message";
      expect(datetime(value, options)).toEqual(["default message"]);

      options.message = "overridden";
      expect(datetime(value, options)).toEqual("overridden");
    });
  });

  describe("latest", function() {
    it("doesn't allow later dates", function() {
      var options = {latest: '2013-10-26 00:00:00'}
        , value = "2013-10-26 00:00:01"
        , expected = ["must be no later than 2013-10-26 00:00:00"];

      expect(datetime(value, options)).toEqual(expected);
    });

    it("allows later or equal dates", function() {
      var options = {latest: '2013-10-26 00:00:00'}
        , value = "2013-10-26 00:00:00";
      expect(datetime(value, options)).not.toBeDefined();
      value = "2013-10-25 00:00:00";
      expect(datetime(value, options)).not.toBeDefined();
    });

    it("formats the error using the format function", function() {
      var options = {latest: '2013-10-26 00:00:00'}
        , value = "2013-10-27 00:00:00"
        , spy = spyOn(validate.validators.datetime, 'format').and.returnValue("foobar")
        , expected = ["must be no later than foobar"];
      expect(datetime(value, options)).toEqual(expected);
    });

    it("parses the latest value using the parse function", function() {
      var options = {latest: 'foobar'}
        , value = XDate.today()
        , spy = spyOn(validate.validators.datetime, 'parse').and.returnValue(value);
      datetime(value, options);
      expect(spy).toHaveBeenCalledWith('foobar', options);
    });

    it("uses the default message if available", function() {
      var options = {latest: '2013-10-26 00:00:00'}
        , value = "2013-10-26 00:00:01";

      validate.validators.datetime.tooLate = "default message";
      expect(datetime(value, options)).toEqual(["default message"]);

      options.message = "overridden";
      expect(datetime(value, options)).toEqual("overridden");
    });
  });

  it("can return multiple errors", function() {
    var options = {
          earliest: '2013-10-26 00:00:00',
          latest: '2013-10-24 00:00:00'
        }
      , value = "2013-10-25 00:00:00";
    expect(datetime(value, options)).toHaveLength(2);
  });

  it("returns the user defined message only once", function() {
    var options = {
          earliest: '2013-10-26 00:00:00',
          latest: '2013-10-24 00:00:00',
          message: 'foobar'
        }
      , value = "2013-10-25 00:00:00";
    expect(datetime(value, options)).toEqual('foobar');
  });

  it("supports default options", function() {
    validate.validators.datetime.options =
      {message: "barfoo", earliest: "2013-10-26 00:00:00"};
    var options = {message: 'foobar'}
      , value = "2013-10-25 00:00:00";
    expect(datetime(value, options)).toEqual('foobar');
    expect(datetime(value, {})).toEqual('barfoo');
    expect(validate.validators.datetime.options)
      .toEqual({message: "barfoo", earliest: "2013-10-26 00:00:00"});
    expect(options).toEqual({message: "foobar"});
  });
});

describe('validators.date', function() {
  it("calls the datetime validator with dateOnly set to true", function() {
    var errors = ["my error"]
      , value = "my value"
      , options = {foo: "bar"}
      , spy = spyOn(validate.validators, 'datetime').and.returnValue(errors);
    expect(validate.validators.date(value, options)).toBe(errors);
    expect(spy).toHaveBeenCalledWith(value, {foo: "bar", dateOnly: true});
  });

  it("doesn't modify the options argument", function() {
    var options = {}
      , spy = spyOn(validate.validators, 'datetime');
    validate.validators.date("value", options);
    expect(options).toEqual({});
  });

  it("calls the datetime validator with the right context", function() {
    spyOn(validate.validators, 'datetime');
    validate.validators.date("foo", {});
    expect(validate.validators.datetime).toHaveBeenCalledWithContext(validate.validators.datetime);
  });
});
