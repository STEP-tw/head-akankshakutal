const { parse , 
  createObject, 
  isNumber,
  isOnlyType,
  isValidOption }  = require("../src/parser.js");

const assert = require("assert");

describe("isNumber", function() {
  it("it Should return null if suplied argument is not number", function() {
    assert.deepEqual(isNumber("aa"), null);
    assert.deepEqual(isNumber("8"), null);
  });

  it("it should return array if supplied argument is -anyNumber", function() {
    assert.deepEqual(isNumber("-8"), ["-8"]);
  });
});

describe("isOnlyType", function() {
  it("should return null if the arguments are not alphabate", function() {
    assert.deepEqual(isOnlyType("-e"), ["-e"]);
  });

  it("should return array of alphabate if the arguments are alphabate and value", function() {
    assert.deepEqual(isOnlyType("-r4"), ["-r"]);
  });
});

describe("isValidOption", function() {
  it("should return null if number is not given ", function() {
    assert.deepEqual(isValidOption("-n"), null);
  });

  it("should return null if arguments are only numbers", function() {
    assert.deepEqual(isValidOption("-4"), null);
  });

  it("should return array if arguments are both type and values", function() {
    assert.deepEqual(isValidOption("-n4"), ["-n4"]);
  });
});

describe("createObject", function() {
  it("should return object that contains three keys", function() {
    assert.deepEqual(createObject("n", 5, ["Hello", "Hiii"]), {
      option: "n",
      count: 5,
      files: ["Hello", "Hiii"]
    });
  });

  it("should return object with undefined when args are not given ", function() {
    assert.deepEqual(createObject(), {
      option: undefined,
      count: undefined,
      files: undefined
    });
  });
});

describe("parse", function() {
  it("should return object when count is with option", function() {
    let input = ["-n4", "File1", "File2", "File3"];
    let expectedOutput = {
      option: "n",
      count: 4,
      files: ["File1", "File2", "File3"]
    };
    assert.deepEqual(parse(input), expectedOutput);
  });

  it("should return object when count is on second index ", function() {
    let input = ["-n", "4", "File2", "File3"];
    let expectedOutput = { option: "n", count: 4, files: ["File2", "File3"] };
    assert.deepEqual(parse(input), expectedOutput);
  });

  it("should return object which contains string in count", function() {
    let input = ["-n", "File1", "File2", "File3"];
    let expectedOutput = {
      option: "n",
      count: "File1",
      files: ["File2", "File3"]
    };
    assert.deepEqual(parse(input), expectedOutput);
  });

  it("should return object which contains n as a default option ", function() {
    let input = ["-20", "File1", "File2", "File3"];
    let expectedOutput = {
      option: "n",
      count: "20",
      files: ["File1", "File2", "File3"]
    };
    assert.deepEqual(parse(input), expectedOutput);
  });

  it("should return type n, range 10 and given input in files if there is no type or range specified", function() {
    let input = ["file1", "file2"];
    let expectedOutput = { option: "n", count: 10, files: ["file1", "file2"] };
    assert.deepEqual(parse(input), expectedOutput);
  });
});


