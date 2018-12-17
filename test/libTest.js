const assert = require("assert");
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

const readFileSync = function(fileName) {
  let files = {
    lines:
      "There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\nPerpendicular Lines.",
    numbers: "One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen",
    lineData:
      "There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\nPerpendicular Lines.",
    digits: "0\n1\n2\n3\n4\n5\n6\n7\n8\n9"
  };
  return files[fileName];
};

const existsSync = function(fileName) {
  let files = ["lines", "numbers", "lineData", "digits"];
  return files.includes(fileName);
};

let fs = { readFileSync, existsSync };

describe("getNLines", function() {
  let alphabets = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ";

  it("should return first 10 lines when range is 0-10", function() {
    let expectedOutput = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST";
    assert.equal(getNLines(alphabets, [0, 10]), expectedOutput);
  });

  it("should return last 10 lines when range contains only -10", function() {
    let expectedOutput = "GH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ";
    assert.equal(getNLines(alphabets, [-10]), expectedOutput);
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

  it("should return first 10 bytes/characters when range is 0-10", function() {
    let expectedOutput = "AB\nCD\nEF\nG";
    assert.equal(getNBytes(contents, [0, 10]), expectedOutput);
  });

  it("should return last 10 bytes/characters when range contains -10", function() {
    let expectedOutput = "T\nUV\nWX\nYZ";
    assert.equal(getNBytes(contents, [-10]), expectedOutput);
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
  it("should return error message file does not exists when operation is head ", function() {
    let expectedOutput = "head: file1: No such file or directory";
    assert.equal(getContents(fs, "head", "file1"), expectedOutput);
  });

  it("should return error message file does not exists when operation is tail ", function() {
    let expectedOutput = "tail: file1: No such file or directory";
    assert.equal(getContents(fs, "tail", "file1"), expectedOutput);
  });

  it("should return whole contents of file because file exists", function() {
    let expectedOutput =
      "There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\nPerpendicular Lines.";
    assert.equal(getContents(fs, "head", "lines"), expectedOutput);
  });

  it("should return whole contents of file because file exists", function() {
    let expectedOutput =
      "One\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen";
    assert.equal(getContents(fs, "tail", "numbers"), expectedOutput);
  });
});

describe("getFilteredContents", function() {
  describe("for head", function() {
    it("should return first 5 lines of single file", function() {
      let userInput = { option: "n", count: 5, fileNames: ["lines"] };
      let expectedOutput =
        "There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.";
      assert.equal(getFilteredContents(userInput, "head", fs), expectedOutput);
    });

    it("should return first 5 lines of every file", function() {
      let userInput = { option: "n", count: 5, fileNames: ["lines", "digits"] };
      let expectedOutput =
        "==> lines <==\nThere are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\n\n==> digits <==\n0\n1\n2\n3\n4";
      assert.equal(getFilteredContents(userInput, "head", fs), expectedOutput);
    });

    it("should return first 5 characters of single file", function() {
      let userInput = { option: "c", count: 5, fileNames: ["lines"] };
      let expectedOutput = "There";
      assert.equal(getFilteredContents(userInput, "head", fs), expectedOutput);
    });

    it("should return first 5 characters of every file", function() {
      let userInput = { option: "c", count: 5, fileNames: ["lines", "digits"] };
      let expectedOutput = "==> lines <==\nThere\n\n==> digits <==\n0\n1\n2";
      assert.equal(getFilteredContents(userInput, "head", fs), expectedOutput);
    });
  });

  describe("for tail", function() {
    it("should return last 5 lines of single file", function() {
      let userInput = { option: "n", count: 5, fileNames: ["digits"] };
      let expectedOutput = "5\n6\n7\n8\n9";
      assert.equal(getFilteredContents(userInput, "tail", fs), expectedOutput);
    });

    it("should return last 5 lines of every file ", function() {
      let userInput = { option: "n", count: 5, fileNames: ["digits", "lines"] };
      let expectedOutput =
        "==> digits <==\n5\n6\n7\n8\n9\n\n==> lines <==\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.\nPerpendicular Lines.";
      assert.deepEqual(
        getFilteredContents(userInput, "tail", fs),
        expectedOutput
      );
    });

    it("should return last 5 characters of single file", function() {
      let userInput = { option: "c", count: 5, fileNames: ["digits"] };
      let expectedOutput = "7\n8\n9";
      assert.equal(getFilteredContents(userInput, "tail", fs), expectedOutput);
    });

    it("should return last 5 characters of every file ", function() {
      let userInput = { option: "c", count: 5, fileNames: ["digits", "lines"] };
      let expectedOutput = "==> digits <==\n7\n8\n9\n\n==> lines <==\nines.";
      assert.deepEqual(
        getFilteredContents(userInput, "tail", fs),
        expectedOutput
      );
    });
  });
});

describe("headOrTail", function() {
  describe("for head", function() {
    it("should return error message when input contains count as 0 ", function() {
      let userInput = { option: "n", count: 0, fileNames: ["digits"] };
      let expectedOutput = "head: illegal line count -- 0";
      assert.deepEqual(headOrTail(userInput, "head", fs), expectedOutput);
    });

    it("should return error message when count is invalid ", function() {
      let userInput = { option: "n", count: "X", fileNames: ["numbers"] };
      let expectedOutput = "head: illegal line count -- X";
      assert.deepEqual(headOrTail(userInput, "head", fs), expectedOutput);
    });

    it("should return first five lines of file when input contains valid file and count", function() {
      let userInput = { option: "n", count: 5, fileNames: ["lines"] };
      let expectedOutput =
        "There are 5 types of lines:\nHorizontal line.\nVertical line.\nSkew Lines.\nParallel Lines.";
      assert.deepEqual(headOrTail(userInput, "head", fs), expectedOutput);
    });

    it("should return first 1o lines when all inputs are valid ", function() {
      let userInput = { option: "n", count: 10, fileNames: ["digits"] };
      let expectedOutput = "0\n1\n2\n3\n4\n5\n6\n7\n8\n9";
      assert.deepEqual(headOrTail(userInput, "head", fs), expectedOutput);
    });
  });
  describe("for tail", function() {
    it("should return emptyString when input contains count as 0 and operation is tail", function() {
      let userInput = { option: "n", count: 0, fileNames: ["digits"] };
      let expectedOutput = " ";
      assert.deepEqual(headOrTail(userInput, "tail", fs), expectedOutput);
    });

    it("should return error message when count is invalid ", function() {
      let userInput = { option: "n", count: "X", fileNames: ["numbers"] };
      let expectedOutput = "tail: illegal offset -- X";
      assert.deepEqual(headOrTail(userInput, "tail", fs), expectedOutput);
    });

    it("should return last two characters when operation is tail and option is c ", function() {
      let userInput = { option: "c", count: 2, fileNames: ["lines"] };
      let expectedOutput = "s.";
      assert.deepEqual(headOrTail(userInput, "tail", fs), expectedOutput);
    });

    it("should return contents with heading when fileNames are more than 1", function() {
      let userInput = {
        option: "n",
        count: 10,
        fileNames: ["numbers", "digits"]
      };
      let expectedOutput =
        "==> numbers <==\nOne\nTwo\nThree\nFour\nFive\nSix\nSeven\nEight\nNine\nTen\n\n==> digits <==\n0\n1\n2\n3\n4\n5\n6\n7\n8\n9";
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
