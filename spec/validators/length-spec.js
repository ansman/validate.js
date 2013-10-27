describe('validator.length', function() {
  var length = validate.validators.length;

  describe("is", function() {
    it("allows you to specify a fixed length the object has to be", function() {
      var value = {length: 10}
        , options = {is: 10};
      expect(length(value, options)).not.toBeDefined();

      options.is = 11;
      var expected = ["is the wrong length (should be 11 characters)"];
      expect(length(value, options)).toEqual(expected);
    });

    it("allows a custom message", function() {
      var value = {length: 10}
        , options = {
            is: 11,
            wrongLength: "wrongLength %{count}"
        };
      expect(length(value, options)).toEqual(["wrongLength 11"]);
    });
  });

  describe("minimum", function() {
    it("allows you to specify a minimum value", function() {
      var value = {length: 10}
        , options = {minimum: 10};
      expect(length(value, options)).not.toBeDefined();

      options.minimum = 11;
      var expected = ["is too short (minimum is 11 characters)"];
      expect(length(value, options)).toEqual(expected);
    });

    it("allows a custom message", function() {
      var value = {length: 10}
        , options = {
            minimum: 11,
            tooShort: "tooShort %{count}"
        };
      expect(length(value, options)).toEqual(["tooShort 11"]);
    });
  });

  describe("maximum", function() {
    it("allows you to specify a maximum value", function() {
      var value = {length: 11}
        , options = {maximum: 11};
      expect(length(value, options)).not.toBeDefined();

      options.maximum = 10;
      var expected = ["is too long (maximum is 10 characters)"];
      expect(length(value, options)).toEqual(expected);
    });

    it("allows a custom message", function() {
      var value = {length: 11}
        , options = {
            maximum: 10,
            tooLong: "tooLong %{count}"
        };
      expect(length(value, options)).toEqual(["tooLong 10"]);
    });
  });

  it("allows non defined values", function() {
    var options = {is: 10, minimum: 20, maximum: 5};
    expect(length(null, options)).not.toBeDefined();
    expect(length(undefined, options)).not.toBeDefined();
  });

  // This test is not a real life example, specifying is with anything else
  // is just weird but hey.
  it("allows you to specify is, minimum and maximum", function() {
    var value = {length: 9}
      , options = {
          is: 10,
          minimum: 20,
          maximum: 5
      };
      expect(length(value, options)).toHaveLength(3);
  });

  it("return the message only once if specified", function() {
    var value = {length: 9}
      , options = {
          message: "my message",
          is: 10,
          minimum: 20,
          maximum: 5
        };
      expect(length(value, options)).toBe("my message");
  });

  describe("tokenizer", function() {
    it("allows you to count words for example", function() {
      var options = {
        maximum: 2,
        tokenizer: function(value) { return value.split(/\s+/g); }
      };

      expect(length("foo bar", options)).not.toBeDefined();
      expect(length("foo bar baz", options)).toBeDefined();
    });
  });
});
