const assert = require("assert");
const {
  getNLines,
  addHeading,
  getRequiredContents,
  getContents,
  formatContents,
  getFilteredContents,
  getNBytes
} = require("../src/lib.js");

describe("getNLines", function() {
  let contents = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ";

  it("should return first 10 lines when range is 0-10", function() {
    let expectedOutput = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST";
    assert.equal(getNLines(contents, [0, 10]), expectedOutput);
  });

  it("should return last 10 lines when range contains only -10", function() {
    let expectedOutput = "GH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ";
    assert.equal(getNLines(contents, [-10]), expectedOutput);
  });

  it("should return empty string when contents are empty", function() {
    let contents = "";
    let expectedOutput = "";
    assert.equal(getNLines(contents, [0, 5]), expectedOutput);
  });

  it("should return whole contents when range is empty ", function() {
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

describe("getContents", function() {
  it("should return error message file does not exists when context is head.js ", function() {
    let fileNamesystem = {
      readfileSync: () => "Hello",
      existsSync: () => false
    };
    let expectedOutput = "head: file1: No such file or directory";
    assert.equal(getContents(fileNamesystem, "head", "file1"), expectedOutput);
  });

  it("should return error message file does not exists when context is tail.js ", function() {
    let fileNamesystem = {
      readfileSync: () => "Hello",
      existsSync: () => false
    };
    let expectedOutput = "tail: file1: No such file or directory";
    assert.equal(getContents(fileNamesystem, "tail", "file1"), expectedOutput);
  });

  it("should return Hello because file exists", function() {
    let fileNamesystem = {
      readFileSync: () => "Hello",
      existsSync: () => true
    };
    let expectedOutput = "Hello";
    assert.equal(getContents(fileNamesystem, "head", "file1"), expectedOutput);
  });

  it("should return Hello when context is tail.js ", function() {
    let fileNamesystem = {
      readFileSync: () => "Hello",
      existsSync: () => true
    };
    let expectedOutput = "Hello";
    assert.equal(getContents(fileNamesystem, "tail", "file1"), expectedOutput);
  });
});

describe("getFilteredContents", function() {
  it("should return error message when input contains count as 0 ", function() {
    let userInput = { option: "n", count: 0, fileNames: ["file1"] };
    const fileNamesystem = {
      readfileSync: () => "Hello",
      existsSync: () => false
    };
    let expectedOutput = "head: illegal line count -- 0";
    assert.deepEqual(
      getFilteredContents(userInput, "head.js", fileNamesystem),
      expectedOutput
    );
  });

  it("should return error message when count is invalid ", function() {
    let userInput = { option: "n", count: "X", fileNames: ["file1"] };
    const fileNamesystem = {
      readFileSync: () => "Hello",
      existsSync: () => true
    };
    let expectedOutput = "head: illegal line count -- X";
    assert.deepEqual(
      getFilteredContents(userInput, "head.js", fileNamesystem),
      expectedOutput
    );
  });

  it("should return error message when input contains invalid file ", function() {
    let userInput = { option: "n", count: 5, fileNames: ["file1"] };
    const fileNamesystem = {
      readFileSync: () => "Hello",
      existsSync: () => false
    };
    let expectedOutput = "head: file1: No such file or directory";
    assert.deepEqual(
      getFilteredContents(userInput, "head.js", fileNamesystem),
      expectedOutput
    );
  });

  it("should return Hello message when all inputs are valid ", function() {
    let userInput = { option: "n", count: 10, fileNames: ["file1"] };
    const fileNamesystem = {
      readFileSync: () => "Hello",
      existsSync: () => true
    };
    let expectedOutput = "Hello";
    assert.deepEqual(
      getFilteredContents(userInput, "head.js", fileNamesystem),
      expectedOutput
    );
  });

  it("should return lo message when operation is tail and option is c ", function() {
    let userInput = { option: "c", count: 2, fileNames: ["file1"] };
    const fileNamesystem = {
      readFileSync: () => "Hello",
      existsSync: () => true
    };
    let expectedOutput = "lo";
    assert.deepEqual(
      getFilteredContents(userInput, "tail.js", fileNamesystem),
      expectedOutput
    );
  });

  it("should return contents with heading when fileNames are more than 1", function() {
    let userInput = { option: "n", count: 10, fileNames: ["File1", "File2"] };
    const fileNamesystem = {
      readFileSync: () => "Hello",
      existsSync: () => true
    };
    let expectedOutput = "==> File1 <==\nHello\n\n==> File2 <==\nHello";
    assert.deepEqual(
      getFilteredContents(userInput, "tail.js", fileNamesystem),
      expectedOutput
    );
  });
});

describe("getRequiredContents", function() {
  it("should return first 2 character if range is 0-2 and option is c", function() {
    let userInput = { option: "c", count: "2", fileNames: ["file1"] };
    assert.deepEqual(getRequiredContents(userInput, [0, 2], "Hello"), "He");
  });

  it("should return first 2 lines if range is 0-2 and option is n", function() {
    let userInput = { option: "n", count: "2", fileNames: ["file1"] };
    let expectedOutput = "1\n2";
    let fileData = "1\n2\n3\n4";
    assert.deepEqual(
      getRequiredContents(userInput, [0, 2], fileData),
      expectedOutput
    );
  });

  it("should return last 2 lines if range is -2 and option is n", function() {
    let userInput = { option: "n", count: "2", fileNames: ["file1"] };
    let expectedOutput = "3\n4";
    let fileData = "1\n2\n3\n4";
    assert.deepEqual(
      getRequiredContents(userInput, [-2], fileData),
      expectedOutput
    );
  });

  it("should return last 2 characters when range is -2 and option is c", function() {
    let userInput = { option: "c", count: "2", fileNames: ["file1"] };
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
