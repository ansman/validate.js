describe('validator.values', function() {
  
  var values = validate.validators.values.bind(validate.validators.values);

  describe("propegates options as sub-validations", function() {
    it("applies equality and inclusion validations to interior attributes", function() {
      var schema = {
        inclusion: {
          within: ["foo", "bar", "baz"],
          message: "%{value} is not in the list!"
        }
      };
      var val = ["foo", "bar", "three"];
      var res = values(val, schema);
      expect(res).toBeDefined();
      expect(res.length).toEqual(1);
      expect(res).toEqual(["2 three is not in the list!"]);
    });
  });

  describe("supports multiple layers of nesting", function() {
    it("supports two layers of value constraints", function() {
      var schema = {
        "some.array": {
          values: {
            values: {
              inclusion: {
                within: ["validVal"]
              }
            }
          }
        }
      };
      var validCase = {
        some: {
          array: [["validVal"], []]
        }
      };
      var invalidCase = {
        some: {
          array: [["invalidVal", "validVal", "two"], []]
        }
      };
      expect(validate(validCase, schema)).not.toBeDefined();
      expect(validate(invalidCase, schema)).toBeDefined();
      expect(validate(invalidCase, schema, {format: "flat"}).length).toEqual(2);
    });
  });

  describe("handles values inside arrays", function() {
    it("allows value specification targeting arrays", function() {
      var schema = {
        inclusion: {
          within: ["validVal"]
        }
      };
      expect(values(["validVal"], schema)).not.toBeDefined();
      expect(values(["invalidVal"], schema)).toBeDefined();
    });
  });

  describe("handles values inside objects", function() {
    it("allows value specification targeting objects", function() {
      var schema = {
        inclusion: {
          within: ["validVal"]
        }
      };
      expect(values({someKey: "validVal"}, schema)).not.toBeDefined();
      expect(values({someKey: "invalidVal"}, schema)).toBeDefined();
    });
  });

  describe("rejects things that are not arrays or objects", function() {
    it("rejects things that are not arrays or objects", function() {
      var schema = {
        inclusion: {
          within: ["validVal"]
        }
      };
      expect(values("notAnArray", schema)).toBeDefined();
      expect(values("notAnArray", schema)).toEqual("is not an array or object");
    });
  });

});
