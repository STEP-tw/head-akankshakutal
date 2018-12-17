const assert = require("assert");
const {
  illegalCountError,
  illegalOptionError,
  isOptionInvalid,
  isValidForTail,
  checkErrors
} = require("../src/errorLib.js");

describe("illegalCountError", function() {
  it("should give error message for illegal number of lines", function() {
    let expectedOutput = "head: illegal line count -- 0";
    assert.deepEqual(illegalCountError("n", 0, "head"), expectedOutput);
  });

  it("should give error message for illegal number of bytes", function() {
    let expectedOutput = "head: illegal byte count -- 0";
    assert.deepEqual(illegalCountError("c", 0, "head"), expectedOutput);
  });
});

describe("illegalOptionError", function() {
  it("should return error message for head", function() {
    let expectedOutput =
      "head: illegal option -- k\nusage: head [-n lines | -c bytes] [file ...]";
    assert.deepEqual(illegalOptionError("k", "head"), expectedOutput);
  });

  it("should return error message for tail", function() {
    let expectedOutput =
      "tail: illegal option -- k\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]";
    assert.deepEqual(illegalOptionError("k", "tail"), expectedOutput);
  });
});

describe("isOptionInvalid", function() {
  it("should return false when option is n", function() {
    assert.equal(isOptionInvalid("n"), false);
  });
  it("should return false when option is c", function() {
    assert.equal(isOptionInvalid("c"), false);
  });
  it("should return true when option is other than c,n", function() {
    assert.equal(isOptionInvalid("p"), true);
    assert.equal(isOptionInvalid("v"), true);
  });
});

describe("isValidForTail", function() {
  it("should return true if type is tail and count is 0", function() {
    assert.equal(isValidForTail("tail", 0), true);
  });

  it("should return false if type is other tahn tail ", function() {
    assert.equal(isValidForTail("head", 0), false);
  });
  it("should return false if count is other than 0", function() {
    assert.equal(isValidForTail("tail", 8), false);
  });
});

describe("checkErrors", function() {
  describe("for head", function() {
    it("should return error message with usage message when option is invalid", function() {
      let userInput = { option: "v", count: "1" };
      let expectedOutput =
        "head: illegal option -- v\nusage: head [-n lines | -c bytes] [file ...]";
      assert.equal(checkErrors(userInput, "head"), expectedOutput);
    });

    it("should return error mssage when count is 0 and type is head", function() {
      let userInput = { option: "c", count: 0 };
      let expectedOutput = "head: illegal byte count -- 0";
      assert.deepEqual(checkErrors(userInput, "head"), expectedOutput);
    });

    it("should return error message when count is invalid", function() {
      let userInput = { option: "c", count: "5x" };
      let expectedOutput = "head: illegal byte count -- 5x";
      assert.deepEqual(checkErrors(userInput, "head"), expectedOutput);
    });
  });
  describe("for tail", function() {
    it("shouldn't return any error and usage message when option is invalid ", () => {
      let userInput = { option: "p", count: 7 };
      let expectedOutput =
        "tail: illegal option -- p\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]";
      assert.deepEqual(checkErrors(userInput, "tail"), expectedOutput);
    });

    it("should return empty string when count is 0", function() {
      let userInput = { option: "n", count: 0 };
      assert.deepEqual(checkErrors(userInput, "tail"), " ");
    });

    it("should return error message when count is invalid", function() {
      let userInput = { option: "n", count: "5x" };
      let expectedOutput = "tail: illegal offset -- 5x";
      assert.equal(checkErrors(userInput, "tail"), expectedOutput);
    });
  });
});
