const assert = require("assert");
const {
  getNLines,
  getContents,
  createObject,
  parse,
  checkErrors,
  getFilteredContents,
  getNBytes,
  isNumber,
  isNotTypeAndCount,
  isNotEqual,
  isOnlyType,
  isValidOption,
  isValidType,
  invalidCount
} = require("../src/lib.js");

describe("getNLines", function() {
  let contents = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ";

  it("should return first 10 lines when number of lines is not specified and context is head.js", function() {
    let expectedOutput = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST";
    assert.equal(getNLines(contents,"head.js"), expectedOutput);
  });

  it("should return last 10 lines when number of line is not specified and context is tail.js", function() {
    let expectedOutput = "GH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ";
    assert.equal(getNLines(contents, "tail.js"), expectedOutput);
  });

  it("should return last 3 lines when number of lines is 3 and context is tail.js ", function() {
    let expectedOutput = "UV\nWX\nYZ";
    assert.equal(getNLines(contents, "tail.js", 3), expectedOutput);
  });

  it("should return first 3 lines when number of lines is 3 and context is head.js ", function() {
    let expectedOutput = "AB\nCD\nEF";
    assert.equal(getNLines(contents, "head.js", 3), expectedOutput);
  });

  it("should return empty string when number of line is 0", function() {
    let expectedOutput = "";
    assert.equal(getNLines(contents, "head.js", 0), expectedOutput);
  });

  it("should return empty string when contents is empty string ", function() {
    let contents = "";
    let expectedOutput = "";
    assert.equal(getNLines(contents,"head.js", 5), expectedOutput);
  });

});

describe("getNBytes", function() {
  let contents = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ";

  it("should return first 10 bytes/characters when number of bytes is not specified and context is head.js", function() {
    let expectedOutput = "AB\nCD\nEF\nG";
    assert.equal(getNBytes(contents,"head.js"), expectedOutput);
  });

  it("should return last 10 bytes/characters when number of bytes is not specified and context is head.js", function() {
    let expectedOutput = "T\nUV\nWX\nYZ";
    assert.equal(getNBytes(contents,"tail.js"), expectedOutput);
  });

  it("should return first 3 bytes when number of bytes is 3 and context is head.js", function() {
    let expectedOutput = "AB\n";
    assert.equal(getNBytes(contents, "head.js", 3), expectedOutput);
  });

  it("should return 3 bytes when number of bytes is 3 and context is tail.js", function() {
    let expectedOutput = "\nYZ";
    assert.equal(getNBytes(contents, "tail.js", 3), expectedOutput);
  });

  it("should return empty string when number of bytes is 0", function() {
    let expectedOutput = "";
    assert.equal(getNBytes(contents, "head.js", 0), expectedOutput);
  });

  it("should return empty string when contents is empty string ", function() {
    let contents = "";
    let expectedOutput = "";
    assert.equal(getNBytes(contents,"head.js", 5), expectedOutput);
  });
});

describe("createObject",function() {
  it("should return object that contains three keys",function() {
    assert.deepEqual(createObject("n",5,["Hello","Hiii"]),{option : "n",count : 5, files : ["Hello","Hiii"]})
  });

  it("should return object with undefined when args are not given ",function() { 
    assert.deepEqual(createObject(),{option : undefined, count : undefined, files : undefined});
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
  let userInput = { option: "n", count: "1", files: ["file1"] };

  it("should return error message file does not exists when context is head.js ", function() {
    let fileSystem = { readFileSync: () => "Hello", existsSync: () => false };
    let expectedOutput = "head: file1: No such file or directory";
    assert.equal(getContents(fileSystem, userInput, "head.js", "file1"), expectedOutput);
  });

  it("should return error message file does not exists when context is tail.js ", function() {
    let fileSystem = { readFileSync: () => "Hello", existsSync: () => false };
    let expectedOutput = "tail: file1: No such file or directory";
    assert.equal(getContents(fileSystem, userInput, "tail.js", "file1"), expectedOutput);
  });

  it("should return Hello because file exists", function() {
    let fileSystem = { readFileSync: () => "Hello", existsSync: () => true };
    let expectedOutput = "Hello";
    assert.equal(getContents(fileSystem, userInput, "head.js", "file1"), expectedOutput);
  });

  it("should return first two character when context is head.js ", function() {
    let userInput = { option: "c", count: "2", files: ["file1", "file2"] };
    let fileSystem = { readFileSync: () => "Hello", existsSync: () => true };
    let expectedOutput = "==> file1 <==\nHe";
    assert.equal(getContents(fileSystem, userInput, "head.js", "file1"), expectedOutput);
  });

  it("should return last two character when context is tail.js ", function() {
    let userInput = { option: "c", count: "2", files: ["file1", "file2"] };
    let fileSystem = { readFileSync: () => "Hello", existsSync: () => true };
    let expectedOutput = "==> file1 <==\nlo";
    assert.equal(getContents(fileSystem, userInput, "tail.js", "file1"), expectedOutput);
  });

});

describe("checkErrors", function() {
  let userInput = { option: "n", count: "1", files: ["file1"] };

  it("should return error message with usage message when option is invalid", function() {
    let expectedOutput = "head: illegal option -- v\nusage: head [-n lines | -c bytes] [file ...]";
    let args = ["-v", "file1"];
    assert.equal(checkErrors(args, userInput, "head.js"), expectedOutput);
  });
  it("should return error message when count is invalid", function() {
    let userInput = { option: "n", count: "5x", files: ["file1"] };
    let expectedOutput = "tail: illegal offset -- 5x";
    let args = ["-n5x", "file1"];
    assert.equal(checkErrors(args, userInput, "tail.js"), expectedOutput);
  });

});

describe("getFilteredContents", function() {
  it("should return error message when input contains count as 0 ", function() {
    const fileSystem = { readFileSync: () => "Hello", existsSync: () => false };
    let expectedOutput = "head: illegal line count -- 0";
    assert.deepEqual(getFilteredContents(["-n0", "File1", "head.js"], fileSystem, "head.js"), expectedOutput);
  });

  it("should return error message when input file is not present ", function() {
    const fileSystem = { readFileSync: () => "Hello", existsSync: () => true };
    let expectedOutput = "head: illegal line count -- File2";
    assert.deepEqual(getFilteredContents(["-n", "File2"], fileSystem, "head.js"), expectedOutput);
  });

  it("should return error message when input contains invalid file ", function() {
    const fileSystem = { readFileSync: () => "Hello", existsSync: () => false };
    let expectedOutput = "head: File1: No such file or directory";
    assert.deepEqual(getFilteredContents(["-n", "5", "File1"], fileSystem, "head.js"), expectedOutput);
  });
  
  it("should return Hello message when all inputs are valid ", function() {
    const fileSystem = { readFileSync: () => "Hello", existsSync: () => true };
    let expectedOutput = "Hello";
    assert.deepEqual(getFilteredContents(["File1"], fileSystem, "head.js"), expectedOutput);
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
    assert.deepEqual(invalidCount(1), false);
  });
  it("should return true if argument is string", function() {
    assert.deepEqual(invalidCount("abc"), true);
  });
  it("should return true if argument is less than 1", function() {
    assert.deepEqual(invalidCount("-8"), true);
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
