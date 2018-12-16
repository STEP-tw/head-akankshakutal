const assert = require("assert");
const {
  getNLines,
  addHeading,
  getRequiredContents,
  getContents,
  formatContents,
  createObject,
  parse,
  errorForIllegalCount,
  errorForIllegalOption,
  checkErrors,
  getFilteredContents,
  getNBytes,
  isNumber,
  isNotTypeAndCount,
  isNotEqual,
  isOnlyType,
  isValidOption,
  isValidType,
  invalidCount,
  invalidTailCount
} = require("../src/lib.js");

describe("getNLines", function() {
  it("should return first 10 lines when range is 0-10", function() {
    let contents = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ";
    let expectedOutput = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST";
    assert.equal(getNLines(contents, [0, 10]), expectedOutput);
  });

  it("should return last 10 lines when range contains only -10", function() {
    let contents = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ";
    let expectedOutput = "GH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ";
    assert.equal(getNLines(contents, [-10]), expectedOutput);
  });

  it("should return empty string when contents are empty", function() {
    let contents = "";
    let expectedOutput = "";
    assert.equal(getNLines(contents, [0, 5]), expectedOutput);
  });

  it("should return whole contents when range is empty ", function() {
    let contents = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ";
    let expectedOutput = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ";
    assert.equal(getNLines(contents, []), expectedOutput);
  });
});

describe("getNBytes", function() {
  let contents = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ";

  it("should return first 10 bytes/characters when range is 0-10", function() {
    let expectedOutput = "AB\nCD\nEF\nG";
    assert.equal(getNBytes(contents, [0, 10]), expectedOutput);
  });

  it("should return last 10 bytes/characters when range contains -10", function() {
    let expectedOutput = "T\nUV\nWX\nYZ";
    assert.equal(getNBytes(contents, [-10]), expectedOutput);
  });

  it("should return whole contents when range is empty", function() {
    let expectedOutput = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ";
    assert.equal(getNBytes(contents, []), expectedOutput);
  });

  it("should return empty string when contents is empty string ", function() {
    let contents = "";
    let expectedOutput = "";
    assert.equal(getNBytes(contents, [0, 5]), expectedOutput);
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

describe("getContents", function() {
  it("should return error message file does not exists when context is head.js ", function() {
    let fileSystem = { readFileSync: () => "Hello", existsSync: () => false };
    let expectedOutput = "head: file1: No such file or directory";
    assert.equal(getContents(fileSystem, "head", "file1"), expectedOutput);
  });

  it("should return error message file does not exists when context is tail.js ", function() {
    let fileSystem = { readFileSync: () => "Hello", existsSync: () => false };
    let expectedOutput = "tail: file1: No such file or directory";
    assert.equal(getContents(fileSystem, "tail", "file1"), expectedOutput);
  });

  it("should return Hello because file exists", function() {
    let fileSystem = { readFileSync: () => "Hello", existsSync: () => true };
    let expectedOutput = "Hello";
    assert.equal(getContents(fileSystem, "head", "file1"), expectedOutput);
  });

  it("should return Hello when context is tail.js ", function() {
    let fileSystem = { readFileSync: () => "Hello", existsSync: () => true };
    let expectedOutput = "Hello";
    assert.equal(getContents(fileSystem, "tail", "file1"), expectedOutput);
  });
});

describe("errorForIllegalCount", function() {
  it("should give error message for illegal number of lines", function() {
    let expectedOutput = "head: illegal line count -- 0";
    assert.deepEqual(errorForIllegalCount("n", 0, "head"), expectedOutput);
  });

  it("should give error message for illegal number of bytes", function() {
    let expectedOutput = "head: illegal byte count -- 0";
    assert.deepEqual(errorForIllegalCount("c", 0, "head"), expectedOutput);
  });
});

describe("errorForIllegalOption", function() {
  it("should return error message for head", function() {
    let expectedOutput =
      "head: illegal option -- k\nusage: head [-n lines | -c bytes] [file ...]";
    assert.deepEqual(errorForIllegalOption("k", "head"), expectedOutput);
  });

  it("should return error message for tail", function() {
    let expectedOutput =
      "tail: illegal option -- k\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]";
    assert.deepEqual(errorForIllegalOption("k", "tail"), expectedOutput);
  });
});

describe("checkErrors", function() {
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

  it("should return error message when count is invalid and type is head ", function() {
    let userInput = { option: "c", count: "5x" };
    let expectedOutput = "head: illegal byte count -- 5x";
    assert.deepEqual(checkErrors(userInput, "head"), expectedOutput);
  });

  it("shouldn't return any error and usage message when option is invalid ", () => {
    let userInput = { option: "p", count: 7 };
    let expectedOutput =
      "tail: illegal option -- p\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]";
    assert.deepEqual(checkErrors(userInput, "tail"), expectedOutput);
  });

  it("should return error message when count is invalid and type is tail ", function() {
    let userInput = { option: "n", count: "5x" };
    let expectedOutput = "tail: illegal offset -- 5x";
    assert.equal(checkErrors(userInput, "tail"), expectedOutput);
  });

  it("should return empty string when count is 0", function() {
    let userInput = { option: "n", count: 0 };
    assert.deepEqual(checkErrors(userInput, "tail"), " ");
  });
});

describe("getFilteredContents", function() {
  it("should return error message when input contains count as 0 ", function() {
    const fileSystem = { readFileSync: () => "Hello", existsSync: () => false };
    let expectedOutput = "head: illegal line count -- 0";
    assert.deepEqual(
      getFilteredContents(["-n0", "File1", "head.js"], fileSystem, "head.js"),
      expectedOutput
    );
  });

  it("should return error message when count is invalid ", function() {
    const fileSystem = { readFileSync: () => "Hello", existsSync: () => true };
    let expectedOutput = "head: illegal line count -- File2";
    assert.deepEqual(
      getFilteredContents(["-n", "File2"], fileSystem, "head.js"),
      expectedOutput
    );
  });

  it("should return error message when input contains invalid file ", function() {
    const fileSystem = { readFileSync: () => "Hello", existsSync: () => false };
    let expectedOutput = "head: File1: No such file or directory";
    assert.deepEqual(
      getFilteredContents(["-n", "5", "File1"], fileSystem, "head.js"),
      expectedOutput
    );
  });

  it("should return Hello message when all inputs are valid ", function() {
    const fileSystem = { readFileSync: () => "Hello", existsSync: () => true };
    let expectedOutput = "Hello";
    assert.deepEqual(
      getFilteredContents(["File1"], fileSystem, "head.js"),
      expectedOutput
    );
  });

  it("should return lo message when operation is tail and option is c ", function() {
    const fileSystem = { readFileSync: () => "Hello", existsSync: () => true };
    let expectedOutput = "Hello";
    assert.deepEqual(
      getFilteredContents(["File1"], fileSystem, "tail.js"),
      expectedOutput
    );
  });

  it("should return contents with heading when files are more than 1", function() {
    const fileSystem = { readFileSync: () => "Hello", existsSync: () => true };
    let expectedOutput = "==> File1 <==\nHello\n\n==> File2 <==\nHello";
    assert.deepEqual(
      getFilteredContents(["File1", "File2"], fileSystem, "tail.js"),
      expectedOutput
    );
  });
});

describe("getRequiredContents", function() {
  it("should return first 2 character if range is 0-2 and option is c", function() {
    let userInput = { option: "c", count: "2", files: ["file1"] };
    assert.deepEqual(getRequiredContents(userInput, [0, 2], "Hello"), "He");
  });

  it("should return first 2 lines if range is 0-2 and option is n", function() {
    let userInput = { option: "n", count: "2", files: ["file1"] };
    let expectedOutput = "1\n2";
    let fileData = "1\n2\n3\n4";
    assert.deepEqual(
      getRequiredContents(userInput, [0, 2], fileData),
      expectedOutput
    );
  });

  it("should return last 2 lines if range is -2 and option is n", function() {
    let userInput = { option: "n", count: "2", files: ["file1"] };
    let expectedOutput = "3\n4";
    let fileData = "1\n2\n3\n4";
    assert.deepEqual(
      getRequiredContents(userInput, [-2], fileData),
      expectedOutput
    );
  });

  it("should return last 2 characters when range is -2 and option is c", function() {
    let userInput = { option: "c", count: "2", files: ["file1"] };
    let expectedOutput = "\n4";
    let fileData = "1\n2\n3\n4";
    assert.deepEqual(
      getRequiredContents(userInput, [-2], fileData),
      expectedOutput
    );
  });
});

describe("formatContents", function() {
  it("should return contents as it is if it is an error message", function() {
    let expectedOutput = "head: File1: No such file or directory";
    let fileNames = ["File1", "File2"];
    let content = "head: File1: No such file or directory";
    assert.deepEqual(formatContents(fileNames, content, 1), expectedOutput);
  });

  it("should return contents with heading", function() {
    let expectedOutput = "==> File2 <==\nHello";
    let fileNames = ["File1", "File2"];
    let content = "Hello";
    assert.deepEqual(formatContents(fileNames, content, 1), expectedOutput);
  });
});

describe("addHeading", function() {
  it("should return contents with heading", function() {
    let expectedOutput = "==> File1 <==\nHello";
    assert.equal(addHeading("File1", "Hello"), expectedOutput);
  });
});

describe("isNumber", function() {
  it("it Should return null if suplied argument is not number", function() {
    assert.deepEqual(isNumber("aa"), null);
    assert.deepEqual(isNumber("8"), null);
  });

  it("it should return array if supplied argument is -anyNumber", function() {
    assert.deepEqual(isNumber("-8"), ["-8"]);
  });
});

describe("isValidType", function() {
  it("it should return array if argument is only a type", function() {
    assert.deepEqual(isValidType("-n"), ["-n"]);
  });
  it("should return null if argument is only number", function() {
    assert.deepEqual(isValidType("-4"), null);
  });
  it("should return false if argument is only type w", function() {
    assert.deepEqual(isValidType("-t"), null);
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

describe("invalidCount", function() {
  it("it should return false if argument is 1", function() {
    assert.deepEqual(invalidCount(1, "head"), false);
  });
  it("should return true if argument is string", function() {
    assert.deepEqual(invalidCount("abc", "head"), true);
  });
  it("should return true if argument is less than 0", function() {
    assert.deepEqual(invalidCount("-8", "head"), true);
  });
  it("it should return false if argument is 0", function() {
    assert.deepEqual(invalidCount(0, "head"), true);
  });
  it("should return null if context is tail.js", function() {
    assert.deepEqual(invalidCount(-1, "tail"), false);
  });
  it("should return true if argument is less than 1", function() {
    assert.deepEqual(invalidCount("-8", "head"), true);
  });
});

describe("isNotTypeAndCount", function() {
  it("it should return false if argument is type and count", function() {
    assert.deepEqual(isNotTypeAndCount("-n5"), false);
  });
  it("should return true if argument is only number", function() {
    assert.deepEqual(isNotTypeAndCount("-4"), false);
  });
  it("should return true if argument is only type letter", function() {
    assert.deepEqual(isNotTypeAndCount("-t"), true);
  });
});

describe("isNotEqual", function() {
  it("it should return true if arguments are same", function() {
    assert.deepEqual(isNotEqual("-n", "-n"), false);
  });
  it("should return false if arguments are not same", function() {
    assert.deepEqual(isNotEqual("-n", "n"), true);
  });
});

describe("invalidTailCount", function() {
  it("it should return false if argument is 1 and context is tail.js", function() {
    assert.deepEqual(invalidTailCount("tail.js", 1), false);
  });
  it("should return true if context is head.js", function() {
    assert.deepEqual(invalidTailCount("head.js", 5), false);
  });
  it("should return true if argument is less than 0", function() {
    assert.deepEqual(invalidTailCount("tail.js", -1), true);
  });
});
