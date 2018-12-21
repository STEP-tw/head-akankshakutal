const assert = require("assert");
let { mockReader } = require("./util.js");
const {
  getNLines,
  addHeading,
  getRequiredContents,
  getContents,
  formatContents,
  getFilteredContents,
  headOrTail,
  getNBytes
} = require("../src/lib.js");

let expectedFilePaths = {};
expectedFilePaths = {
  lines: "A\nB\nC\nD\nE\nF",
  digits: "1\n2\n3\n4\n5\n6\n7\n8\n9\n0",
  Numbers: "one\ntwo\nthree\nfour\nfive\nsix\nseven\neight\nnine\nten"
};

let fs = mockReader(expectedFilePaths);

describe("getNLines", function() {
  let alphabets = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ";
  it("should return first 4 lines when range is 0-4", function() {
    let expectedOutput = "AB\nCD\nEF\nGH";
    assert.equal(getNLines(alphabets, [0, 4]), expectedOutput);
  });

  it("should return last 4 lines when range contains only -4", function() {
    let expectedOutput = "ST\nUV\nWX\nYZ";
    assert.equal(getNLines(alphabets, [-4]), expectedOutput);
  });

  it("should return empty string when content is empty", function() {
    let emptyString = "";
    let expectedOutput = "";
    assert.equal(getNLines(emptyString, [0, 5]), expectedOutput);
  });

  it("should return whole contents when range is empty ", function() {
    let expectedOutput = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ";
    assert.equal(getNLines(alphabets, []), expectedOutput);
  });
});

describe("getNBytes", function() {
  let contents = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ";

  it("should return first 4 bytes/characters when range is 0-4", function() {
    let expectedOutput = "AB\nC";
    assert.equal(getNBytes(contents, [0, 4]), expectedOutput);
  });

  it("should return last 4 bytes/characters when range contains -4", function() {
    let expectedOutput = "X\nYZ";
    assert.equal(getNBytes(contents, [-4]), expectedOutput);
  });

  it("should return empty string when content is empty", function() {
    let contents = "";
    let expectedOutput = "";
    assert.equal(getNBytes(contents, [0, 5]), expectedOutput);
  });

  it("should return whole contents when range is empty", function() {
    let expectedOutput = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ";
    assert.equal(getNBytes(contents, []), expectedOutput);
  });
});

describe("getContents", function() {
  it("should return error message when file does not exists and operation is head ", function() {
    let expectedOutput = "head: file1: No such file or directory";
    assert.equal(getContents(fs, "head", "file1"), expectedOutput);
  });

  it("should return error message when file does not exists and operation is tail ", function() {
    let expectedOutput = "tail: file1: No such file or directory";
    assert.equal(getContents(fs, "tail", "file1"), expectedOutput);
  });

  it("should return whole contents of file because file exists and operation is head", function() {
    let expectedOutput = "A\nB\nC\nD\nE\nF";
    assert.equal(getContents(fs, "head", "lines"), expectedOutput);
  });

  it("should return whole contents of file because file exists and operation is tail", function() {
    let expectedOutput = "A\nB\nC\nD\nE\nF";
    assert.equal(getContents(fs, "tail", "lines"), expectedOutput);
  });
});

describe("getFilteredContents", function() {
  describe("for head", function() {
    it("should return first 5 lines of single file", function() {
      let userInput = { option: "n", count: 5, fileNames: ["lines"] };
      let expectedOutput = "A\nB\nC\nD\nE";
      assert.equal(getFilteredContents(userInput, "head", fs), expectedOutput);
    });

    it("should return first 5 lines of every file", function() {
      let userInput = { option: "n", count: 5, fileNames: ["lines", "digits"] };
      let expectedOutput =
        "==> lines <==\nA\nB\nC\nD\nE\n\n==> digits <==\n1\n2\n3\n4\n5";
      assert.equal(getFilteredContents(userInput, "head", fs), expectedOutput);
    });

    it("should return first 5 characters of single file", function() {
      let userInput = { option: "c", count: 5, fileNames: ["lines"] };
      let expectedOutput = "A\nB\nC";
      assert.equal(getFilteredContents(userInput, "head", fs), expectedOutput);
    });

    it("should return first 5 characters of every file", function() {
      let userInput = { option: "c", count: 5, fileNames: ["lines", "digits"] };
      let expectedOutput = "==> lines <==\nA\nB\nC\n\n==> digits <==\n1\n2\n3";
      assert.equal(getFilteredContents(userInput, "head", fs), expectedOutput);
    });
  });

  describe("for tail", function() {
    it("should return last 5 lines of single file", function() {
      let userInput = { option: "n", count: 5, fileNames: ["digits"] };
      let expectedOutput = "6\n7\n8\n9\n0";
      assert.equal(getFilteredContents(userInput, "tail", fs), expectedOutput);
    });

    it("should return last 5 lines of every file ", function() {
      let userInput = { option: "n", count: 5, fileNames: ["digits", "lines"] };
      let expectedOutput =
        "==> digits <==\n6\n7\n8\n9\n0\n\n==> lines <==\nB\nC\nD\nE\nF";
      assert.deepEqual(
        getFilteredContents(userInput, "tail", fs),
        expectedOutput
      );
    });

    it("should return last 5 characters of single file", function() {
      let userInput = { option: "c", count: 5, fileNames: ["digits"] };
      let expectedOutput = "8\n9\n0";
      assert.equal(getFilteredContents(userInput, "tail", fs), expectedOutput);
    });

    it("should return last 5 characters of every file ", function() {
      let userInput = { option: "c", count: 5, fileNames: ["digits", "lines"] };
      let expectedOutput = "==> digits <==\n8\n9\n0\n\n==> lines <==\nD\nE\nF";
      assert.deepEqual(
        getFilteredContents(userInput, "tail", fs),
        expectedOutput
      );
    });
  });
  describe("missing file", function() {
    it("should return error message file does not exists when operation is head ", function() {
      let expectedOutput = "head: file1: No such file or directory";
      assert.equal(getContents(fs, "head", "file1"), expectedOutput);
    });

    it("should return error message file does not exists when operation is tail ", function() {
      let expectedOutput = "tail: file1: No such file or directory";
      assert.equal(getContents(fs, "tail", "file1"), expectedOutput);
    });
  });
});

describe("headOrTail", function() {
  describe("for head", function() {
    it("should return first five lines of file when input contains valid file and count", function() {
      let userInput = { option: "n", count: 5, fileNames: ["lines"] };
      let expectedOutput = "A\nB\nC\nD\nE";
      assert.deepEqual(headOrTail(userInput, "head", fs), expectedOutput);
    });

    it("should return first 1o lines when all inputs are valid ", function() {
      let userInput = { option: "n", count: 10, fileNames: ["digits"] };
      let expectedOutput = "1\n2\n3\n4\n5\n6\n7\n8\n9\n0";
      assert.deepEqual(headOrTail(userInput, "head", fs), expectedOutput);
    });
  });
  describe("for tail", function() {
    it("should return last specified number of characters when operation is tail and option is c ", function() {
      let userInput = { option: "c", count: 2, fileNames: ["lines"] };
      let expectedOutput = "\nF";
      assert.deepEqual(headOrTail(userInput, "tail", fs), expectedOutput);
    });

    it("should return contents with heading when fileNames are more than 1", function() {
      let userInput = {
        option: "n",
        count: 10,
        fileNames: ["lines", "digits"]
      };
      let expectedOutput =
        "==> lines <==\nA\nB\nC\nD\nE\nF\n\n==> digits <==\n1\n2\n3\n4\n5\n6\n7\n8\n9\n0";
      assert.deepEqual(headOrTail(userInput, "tail", fs), expectedOutput);
    });
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
  let fileNames = ["File1", "File2"];
  let bindHeading = formatContents(fileNames);

  it("should return contents without adding heading if it is error ", function() {
    let content = "head: File1: No such file or directory";
    let expectedOutput = "head: File1: No such file or directory";
    assert.deepEqual(bindHeading(content), expectedOutput);
  });

  it("should return contents with heading", function() {
    let bindHeading = formatContents(fileNames);
    let expectedOutput = "==> File1 <==\nHello";
    let content = "Hello";
    assert.deepEqual(bindHeading(content), expectedOutput);
  });
});

describe("addHeading", function() {
  it("should return contents with heading", function() {
    let expectedOutput = "==> File1 <==\nHello";
    assert.equal(addHeading("File1", "Hello"), expectedOutput);
  });
});
