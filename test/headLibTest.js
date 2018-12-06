const assert = require("assert");
const {
  getNLines,
  getContents,
  select,
  getCount,
  getFileNames,
  parse,
  isValid,
  addHeading,
  head,
  getNBytes
} = require("../src/headLib.js");

describe("getNLines", function() {
  let contents = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ";

  it("should return 10 lines when number of lines is not specified ", function() {
    let expectedOutput = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST";
    assert.equal(getNLines(contents), expectedOutput);
  });

  it("should return specified number of lines when number of lines is given ", function() {
    let expectedOutput = "AB\nCD\nEF";
    assert.equal(getNLines(contents, 3), expectedOutput);
  });

  it("should return empty string when number of line is 0", function() {
    let expectedOutput = "";
    assert.equal(getNLines(contents, 0), expectedOutput);
  });

  it("should return empty string when contents is empty string ", function() {
    let contents = "";
    let expectedOutput = "";
    assert.equal(getNLines(contents, 5), expectedOutput);
  });
});

describe("getNBytes", function() {
  let contents = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ";

  it("should return 10 bytes/characters when number of bytes is not specified", function() {
    let expectedOutput = "AB\nCD\nEF\nG";
    assert.equal(getNBytes(contents), expectedOutput);
  });

  it("should return specified number of bytes when number of bytes is given ", function() {
    let expectedOutput = "AB\n";
    assert.equal(getNBytes(contents, 3), expectedOutput);
  });

  it("should return empty string when number of bytes is 0", function() {
    let expectedOutput = "";
    assert.equal(getNBytes(contents, 0), expectedOutput);
  });

  it("should return empty string when contents is empty string ", function() {
    let contents = "";
    let expectedOutput = "";
    assert.equal(getNBytes(contents, 5), expectedOutput);
  });
});

describe("parse", function() {
  describe("select", function() {
    it("should return getNBytes function when input is -c", function() {
      assert.equal(select("-c"), getNBytes);
      assert.equal(select("-c5"), getNBytes);
    });

    it("should return getNBytes function when input is rather than -c", function() {
      assert.equal(select("-n"), getNLines);
      assert.equal(select("-n5"), getNLines);
    });
  });

  describe("getCount", function() {
    it("should return 10 when -n/-c is not given ", function() {
      assert.equal(getCount(["-d", "File1"]), 10);
    });

    it("should return specified number from that string ", function() {
      assert.equal(getCount(["-n20", "file1"]), 20);
    });

    it("should return number that specified in 1 index", function() {
      assert.equal(getCount(["-c", "20"]), 20);
    });

    it("should return number that specified in 0 index", function() {
      assert.equal(getCount(["-20", "File1"]), 20);
    });
  });

  describe("getFileNames", function() {
    it("should return array slice by 1 when input contains /-[0-9]/ ", function() {
      assert.deepEqual(getFileNames(["-n4", "File1", "File2"]), [
        "File1",
        "File2"
      ]);
    });

    it("should return array slice by 2 when input does not contains any number", function() {
      assert.deepEqual(getFileNames(["-n", "10", "File1", "File2"]), [
        "File1",
        "File2"
      ]);
    });

    it("should return given array when input doesn't contains - and any number", function() {
      assert.deepEqual(getFileNames(["Hello", "Hiiii", "Welcome"]), [
        "Hello",
        "Hiiii",
        "Welcome"
      ]);
    });
  });

  it("should return object that contains three keys", function() {
    assert.deepEqual(parse(["-n", "4", "File2", "File3"]), {
      option: getNLines,
      count: 4,
      files: ["File2", "File3"]
    });

    assert.deepEqual(parse(["-n4", "File1", "File2", "File3"]), {
      option: getNLines,
      count: 4,
      files: ["File1", "File2", "File3"]
    });
  });
});

describe("getContents", function() {
  let userInput = { option: getNLines, count: "1", files: ["file1"] };

  it("should return error message ", function() {
    let fileSystem = { readFileSync: () => "Hello", existsSync: () => false };
    let expectedOutput = "head: file1: No such file or directory";
    assert.equal(getContents(fileSystem, userInput, "file1"), expectedOutput);
  });

  it("should return Hello because file exists", function() {
    let fileSystem = { readFileSync: () => "Hello", existsSync: () => true };
    let expectedOutput = "Hello";
    assert.equal(getContents(fileSystem, userInput, "file1"), expectedOutput);
  });

  it("should return Hello twice because file exists", function() {
    let userInput = {
      option: getNLines,
      count: "1",
      files: ["file1", "file2"]
    };
    let fileSystem = { readFileSync: () => "Hello", existsSync: () => true };
    let expectedOutput = "==> file1 <==\nHello";
    assert.equal(getContents(fileSystem, userInput, "file1"), expectedOutput);
  });
});

describe("isValid", function() {
  let userInput = { option: getNLines, count: "1", files: ["file1"] };
  let fileSystem = { readFileSync: () => "Hello", existsSync: () => true };

  it("should return error message with usage message when option is invalid", function() {
    let expectedOutput =
      "head: illegal option -- -v\nusage: head [-n lines | -c bytes] [file ...]";
    assert.equal(
      isValid(["-v", "file1"], userInput, fileSystem),
      expectedOutput
    );
  });

  it("should return Hello message when option is valid", function() {
    let fileSystem = { readFileSync: () => "Hello", existsSync: () => true };
    let expectedOutput = "Hello";
    assert.equal(
      isValid(["-n", "file1"], userInput, fileSystem),
      expectedOutput
    );
  });

  it("should return Hello message when option is valid", function() {
    let fileSystem = { readFileSync: () => "Hello", existsSync: () => true };
    let expectedOutput = "Hello";
    assert.equal(
      isValid(["-c0", "file1"], userInput, fileSystem),
      expectedOutput
    );
  });
});

describe("head", function() {

  it("should return error message when input contains count as 0 ", function() {
    const fileSystem = { readFileSync: () => "Hello", existsSync: () => false };
    let expectedOutput = "head: illegal line count -- 0";
    assert.deepEqual(head(["-n0", "File1"], fileSystem), expectedOutput);
  });

  it("should return error message when input file is not present ", function() {
  const fileSystem = { readFileSync: () => "Hello", existsSync: () => true };
    let expectedOutput = "head: illegal line count -- File2";
    assert.deepEqual(head(["-n", "File2"], fileSystem), expectedOutput);
  });

  it("should return error message when input contains invalid file ", function() {
    const fileSystem = { readFileSync: () => "Hello", existsSync: () => false };
    let expectedOutput = 'head: File1: No such file or directory';
    assert.deepEqual(head(["-n", "5", "File1"], fileSystem), expectedOutput);
  });

  it("should return Hello message when all inputs are valid ", function() {
    const fileSystem = { readFileSync: () => "Hello", existsSync: () => true };
    let expectedOutput = 'Hello';
    assert.deepEqual(head(["File1"], fileSystem), expectedOutput);
  });
});
