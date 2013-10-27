describe("validators.numericality", function() {
  var numericality = validate.validators.numericality;

  it("allows non defined values", function() {
    expect(numericality(null, {})).not.toBeDefined();
    expect(numericality(undefined, {})).not.toBeDefined();
  });

  it("allows numbers", function() {
    expect(numericality(3.14, {})).not.toBeDefined();
    expect(numericality("3.14", {})).not.toBeDefined();
  });

  it("doesn't allow non numbers", function() {
    var e = "is not a number";
    expect(numericality("foo", {})).toEqual(e);
    expect(numericality(NaN, {})).toEqual(e);
    expect(numericality(false, {})).toEqual(e);
    expect(numericality([], {})).toEqual(e);
    expect(numericality({}, {})).toEqual(e);
  });

  it("doesn't allow strings if noStrings is true", function() {
    expect(numericality("3.14", {noStrings: true})).toBeDefined();
  });

  it("uses the message if specified", function() {
    expect(numericality("foo", {message: "my message"})).toEqual("my message");
  });

  describe("onlyInteger", function() {
    it("allows integers", function() {
      expect(numericality(1, {onlyInteger: true})).not.toBeDefined();
    });

    it("doesn't allow real numbers", function() {
      var expected = "must be an integer";
      expect(numericality(3.14, {onlyInteger: true})).toEqual(expected);
    });

    it("uses the message if specified", function() {
      var opts = {message: "my message", onlyInteger: true};
      expect(numericality("foo", opts)).toEqual("my message");
    });
  });

  describe("greaterThan", function() {
    it("allows numbers that are greater than", function() {
      expect(numericality(3.14, {greaterThan: 2.72})).not.toBeDefined();
    });

    it("doesn't allow numbers that are smaller than or equal to", function() {
      var expected = ["must be greater than 3.14"];
      expect(numericality(3.14, {greaterThan: 3.14})).toEqual(expected);
      expect(numericality(2.72, {greaterThan: 3.14})).toEqual(expected);
    });
  });

  describe("greaterThanOrEqualTo", function() {
    it("allows numbers that are greater than or equal to", function() {
      expect(numericality(3.14, {greaterThanOrEqualTo: 2.72})).not.toBeDefined();
      expect(numericality(2.72, {greaterThanOrEqualTo: 2.72})).not.toBeDefined();
    });

    it("doesn't allow numbers that are smaller than", function() {
      var expected = ["must be greater than or equal to 3.14"];
      expect(numericality(2.72, {greaterThanOrEqualTo: 3.14})).toEqual(expected);
    });
  });

  describe("equalTo", function() {
    it("allows numbers that are equal to", function() {
      expect(numericality(2.72, {equalTo: 2.72})).not.toBeDefined();
    });

    it("doesn't allow numbers that are not equal", function() {
      var expected = ["must be equal to 2.72"];
      expect(numericality(3.14, {equalTo: 2.72})).toEqual(expected);
    });
  });

  describe("lessThan", function() {
    it("allows numbers that are less than", function() {
      expect(numericality(2.72, {lessThan: 3.14})).not.toBeDefined();
    });

    it("doesn't allow numbers that are greater than or equal to", function() {
      var expected = ["must be less than 2.72"];
      expect(numericality(2.72, {lessThan: 2.72})).toEqual(expected);
      expect(numericality(3.14, {lessThan: 2.72})).toEqual(expected);
    });
  });

  describe("lessThanOrEqualTo", function() {
    it("allows numbers that are less than or equal to", function() {
      expect(numericality(2.72, {lessThanOrEqualTo: 3.14})).not.toBeDefined();
      expect(numericality(3.14, {lessThanOrEqualTo: 3.14})).not.toBeDefined();
    });

    it("doesn't allow numbers that are greater than", function() {
      var expected = ["must be less than or equal to 2.72"];
      expect(numericality(3.14, {lessThanOrEqualTo: 2.72})).toEqual(expected);
    });
  });

  describe("odd", function() {
    it("allows odd numbers", function() {
      expect(numericality(1, {odd: true})).not.toBeDefined();
      expect(numericality(3, {odd: true})).not.toBeDefined();
      expect(numericality(5, {odd: true})).not.toBeDefined();
    });

    it("disallows even numbers", function() {
      var expected = ["must be odd"];
      expect(numericality(0, {odd: true})).toEqual(expected);
      expect(numericality(2, {odd: true})).toEqual(expected);
      expect(numericality(4, {odd: true})).toEqual(expected);
    });
  });

  describe("even", function() {
    it("allows even numbers", function() {
      expect(numericality(0, {even: true})).not.toBeDefined();
      expect(numericality(2, {even: true})).not.toBeDefined();
      expect(numericality(4, {even: true})).not.toBeDefined();
    });

    it("disallows odd numbers", function() {
      var expected = ["must be even"];
      expect(numericality(1, {even: true})).toEqual(expected);
      expect(numericality(3, {even: true})).toEqual(expected);
      expect(numericality(5, {even: true})).toEqual(expected);
    });
  });

  it("can return multiple errors", function() {
    var options = {
      greaterThan: 10,
      greaterThanOrEqualTo: 10,
      lessThan: 5,
      lessThanOrEqualTo: 5,
      equalTo: 20,
      odd: true,
      even: true
    };
    expect(numericality(7.2, options)).toHaveLength(7);
  });

  it("returns options.message only once", function() {
    var options = {
      greaterThan: 10,
      greaterThanOrEqualTo: 10,
      lessThan: 5,
      lessThanOrEqualTo: 5,
      equalTo: 20,
      odd: true,
      even: true,
      message: 'my message'
    };
    expect(numericality(7.2, options)).toEqual("my message");
  });
});
