describe('validators.datetime', function() {
  var datetime = validate.validators.datetime.bind(validate.validators.datetime);

  it("allows non defined values", function() {
    expect(datetime(null, {})).not.toBeDefined();
    expect(datetime(undefined, {})).not.toBeDefined();
  });

  describe("parse", function() {
    var parse = validate.validators.datetime.parse;

    it("returns the millis since epoch for valid strings", function() {
      // 2013-10-25 00:00:00 UTC
      expect(parse("2013-10-26", {})).toEqual(1382745600000);

      // 1000-01-01 00:00:00 UTC
      expect(parse("1000-01-01", {})).toEqual(-30610224000000);

      // UTC
      expect(parse("2013-10-26T10:35:24", {})).toEqual(1382783724000);
      // PDT
      expect(parse("2013-10-26T10:35:24-0700", {})).toEqual(1382808924000);
    });

    it("returns NaN for invalid dates", function() {
      expect(parse("foobar", {})).toBeNaN();
    });
  });

  describe("format", function() {
    var format = validate.validators.datetime.format;

    it("formats as ISO8601 in errors", function() {
      var expected = "2013-10-26T17:35:24Z";
      expect(format(1382808924000, {})).toBe(expected);
    });

    it("only includes the date part it dateOnly is set", function() {
      var expected = "2013-10-26";
      expect(format(1382745600000, {dateOnly: true})).toBe(expected);
    });

    it("allows you to override the format string", function() {
      var expected = "10/26/13";
      expect(format(1382808924000, {dateFormat: "MM/dd/yy"})).toBe(expected);
    });
  });

  it("allows valid dates", function() {
    expect(datetime("2013-10-26 13:47:00", {})).not.toBeDefined();
  });

  it("doesn't allow invalid dates", function() {
    var expected = "must be a valid date";
    expect(datetime("foobar", {})).toEqual(expected);
  });

  it("uses the parse function to validate dates", function() {
    var spy = spyOn(validate.validators.datetime, 'parse').andReturn(NaN)
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
    var opts = {message: "my message"};
    expect(datetime("foobar", opts)).toEqual("my message");
  });

  describe("earliest", function() {
    it("doesn't allow earlier dates", function() {
      var options = {earliest: '2013-10-26 00:00:00'}
        , value = "2013-10-25 23:59:59"
        , expected = ["must be no earlier than 2013-10-26T00:00:00Z"];

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
        , spy = spyOn(validate.validators.datetime, 'format').andReturn("foobar")
        , expected = ["must be no earlier than foobar"];
      expect(datetime(value, options)).toEqual(expected);
    });

    it("parses the earliest value using the parse function", function() {
      var options = {earliest: 'foobar'}
        , value = XDate.today()
        , spy = spyOn(validate.validators.datetime, 'parse').andReturn(value);
      datetime(value, options);
      expect(spy).toHaveBeenCalledWith('foobar', options);
    });
  });

  describe("latest", function() {
    it("doesn't allow later dates", function() {
      var options = {latest: '2013-10-26 00:00:00'}
        , value = "2013-10-26 00:00:01"
        , expected = ["must be no later than 2013-10-26T00:00:00Z"];

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
        , spy = spyOn(validate.validators.datetime, 'format').andReturn("foobar")
        , expected = ["must be no later than foobar"];
      expect(datetime(value, options)).toEqual(expected);
    });

    it("parses the latest value using the parse function", function() {
      var options = {latest: 'foobar'}
        , value = XDate.today()
        , spy = spyOn(validate.validators.datetime, 'parse').andReturn(value);
      datetime(value, options);
      expect(spy).toHaveBeenCalledWith('foobar', options);
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
});

describe('validators.date', function() {
  it("calls the datetime validator with onlyDate set to true", function() {
    var errors = ["my error"]
      , value = "my value"
      , options = {foo: "bar"}
      , spy = spyOn(validate.validators, 'datetime').andReturn(errors);
    expect(validate.validators.date(value, options)).toBe(errors);
    expect(spy).toHaveBeenCalledWith(value, {foo: "bar", onlyDate: true});
  });

  it("doesn't modify the options argument", function() {
    var options = {}
      , spy = spyOn(validate.validators, 'datetime');
    validate.validators.date("value", options);
    expect(options).toEqual({});
  });
});
