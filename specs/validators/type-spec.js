describe('validator.type', function() {
  
  var type = validate.validators.type.bind(validate.validators.type);

  afterEach(function() {
    delete validate.validators.type.message;
  });

  describe("accepts operands with matching types", function() {
    
    it("accepts valid numbers", function() {
      expect(type(0, "number")).not.toBeDefined();
      expect(type(24.601, "number")).not.toBeDefined();
    });
    it("accepts valid integers", function() {
      expect(type(0, "integer")).not.toBeDefined();
      expect(type(8675309, "integer")).not.toBeDefined();
    });
    it("accepts valid strings", function() {
      expect(type("one million", "string")).not.toBeDefined();
      expect(type("", "string")).not.toBeDefined();
    });
    it("accepts valid dates", function() {
      expect(type(new Date(), "date")).not.toBeDefined();
    });
    it("accepts valid arrays", function() {
      expect(type([], "array")).not.toBeDefined();
      expect(type([1,2,3], "array")).not.toBeDefined();
    });
    it("accepts valid objects", function() {
      expect(type({}, "object")).not.toBeDefined();
    });
    it("accepts valid functions", function() {
      expect(type(function(){}, "function")).not.toBeDefined();
    });
    it("accepts valid promises", function() {
      expect(type(new validate.Promise(function(){}), "promise")).not.toBeDefined();
    });
    
  });

  describe("rejects operands with non-matching types", function() {
    
    it("rejects non-numbers", function() {
      expect(type("seven", "number")).toBeDefined();
      expect(type("", "number")).toBeDefined();
    });
    it("rejects non-integers", function() {
      expect(type(0.1, "integer")).toBeDefined();
      expect(type("0.1", "integer")).toBeDefined();
    });
    it("rejects non-strings", function() {
      expect(type(0.1, "string")).toBeDefined();
      expect(type([], "string")).toBeDefined();
    });
    it("rejects non-dates", function() {
      expect(type(0.1, "date")).toBeDefined();
      expect(type([], "date")).toBeDefined();
      expect(type(String(new Date()), "date")).toBeDefined();
    });
    it("rejects non-arrays", function() {
      expect(type(0.1, "array")).toBeDefined();
      expect(type("array", "array")).toBeDefined();
    });
    it("rejects non-objects", function() {
      expect(type(0.1, "object")).toBeDefined();
      expect(type("0.1", "object")).toBeDefined();
    });
    it("rejects non-functions", function() {
      expect(type(0.1, "function")).toBeDefined();
      expect(type("0.1", "function")).toBeDefined();
    });
    it("rejects non-promises", function() {
      expect(type(0.1, "promise")).toBeDefined();
      expect(type("jquery.promise", "promise")).toBeDefined();
    });
    
  });

  describe("accepts configuration as string or object", function() {

    it("accepts configuration as a string", function() {
      expect(type(0, "number")).not.toBeDefined();
      expect(type("1", "number")).toBeDefined();
    });

    it("accepts configuration as an object", function() {
      expect(type(0, {type: "number"})).not.toBeDefined();
      expect(type("1", {type: "number"})).toBeDefined();
    });

  });

  describe("accepts a custom message", function() {

    it("respects 'message' configuration option", function(){
      expect(type(0, {type: "function", message: "foobar"})).toEqual("foobar");
    });

    it("respects a default custom message", function() {
      validate.validators.type.message = "foobar";
      expect(type(0, "string")).toEqual("foobar");
    });

  });
});
