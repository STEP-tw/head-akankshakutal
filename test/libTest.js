const assert = require("assert");
const { execute, 
  getNLines,
  select,
  getCount,
  getFileNames,
  extractInput,
  format,
  addHeading,
  getNBytes } = require("../src/lib.js");

const add = num => num+10;

describe("execute",function() {
  it("should call function with one argument ",function() {
    assert.deepEqual(execute(add,[5]),[15]);
  });
  it("should call function with two arguments ",function() { 
      assert.deepEqual(execute(add,[10,5]),[20,15])
  });
});

describe("getNLines",function() {
  let contents = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ"

  it("should return 10 lines when number of lines is not specified ",function() {
    let expectedOutput = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST";
    assert.equal(getNLines(contents),expectedOutput);
  });

  it("should return specified number of lines when number of lines is given ",function() { 
    let expectedOutput = "AB\nCD\nEF";
    assert.equal(getNLines(contents,3),expectedOutput);
  });

  it("should return empty string when number of line is 0",function() { 
    let expectedOutput = "";
    assert.equal(getNLines(contents,0),expectedOutput);
  });
  
  it("should return empty string when contents is empty string ",function() {
    let contents = "";
    let expectedOutput = "";
    assert.equal(getNLines(contents,5),expectedOutput);
  });

});

describe("getNBytes",function() {
  let contents = "AB\nCD\nEF\nGH\nIJ\nKL\nMN\nOP\nQR\nST\nUV\nWX\nYZ"

  it("should return 10 bytes/characters when number of bytes is not specified",function() {
    let expectedOutput = "AB\nCD\nEF\nG";
    assert.equal(getNBytes(contents),expectedOutput);
  });

  it("should return specified number of bytes when number of bytes is given ",function() { 
    let expectedOutput = "AB\n";
    assert.equal(getNBytes(contents,3),expectedOutput);
  });

  it("should return empty string when number of bytes is 0",function() { 
    let expectedOutput = "";
    assert.equal(getNBytes(contents,0),expectedOutput);
  });
  
  it("should return empty string when contents is empty string ",function() {
    let contents = "";
    let expectedOutput = "";
    assert.equal(getNBytes(contents,5),expectedOutput);
  });

});

describe("extractInput",function() {

  describe("select",function() {

    it("should return getNBytes function when input is -c",function() {
      assert.equal(select("-c"),getNBytes);
      assert.equal(select("-c5"),getNBytes);
    });

    it("should return getNBytes function when input is rather than -c",function() {
      assert.equal(select("-n"),getNLines);
      assert.equal(select("-n5"),getNLines)
    });

  });

  describe("getCount",function() {

    it("should return 10 when -n/-c is not given ",function() {
      assert.equal(getCount(["-5","File1"]),10);
    });

    it("should return specified number from that string ",function() { 
      assert.equal(getCount(["-n20", "file1"]),20);
    });

    it("should return number that specified in 1 index",function() { 
      assert.equal(getCount(["-c","20"]),20);
    });

  });

  describe("getFileNames",function() {

    it("should return array slice by 1 when input contains /-[0-9]/ ",function() {
      assert.deepEqual(getFileNames(["-n4","File1","File2"]),["File1","File2"]);
    });

    it("should return array slice by 2 when input does not contains any number",function() { 
      assert.deepEqual(getFileNames(["-n","10","File1","File2"]),["File1","File2"]);
    });

    it("should return given array when input doesn't contains - and any number",function() { 
      assert.deepEqual(getFileNames(["Hello","Hiiii","Welcome"]),["Hello","Hiiii","Welcome"]);
    });

  });

  it("should return object that contains three keys", function () {
    assert.deepEqual(extractInput(["-n","4","File2","File3"]),{ option : getNLines, count : 4 , files : ["File2","File3"] });

    assert.deepEqual(extractInput(["-n4","File1","File2","File3"]),{ option : getNLines, count : 4 , files : ["File1","File2","File3"] });

  });
});

describe("format",function() {
  describe("addHeading",function() {
    it("should return first arg im between ==> <== and second on next line",function() {
      assert.equal(addHeading("Hello","How are you ? "),"==> Hello <==\nHow are you ? \n");
    });
  });
  it("should return only contents when first array contains only one element ",function() {
    assert.equal(format(["Hello"],["How are you ?"]),"How are you ?");
  });

  it("should return array elements alternatively when first array lenth is not equal to 1", function() { 
    let expectedOutput = "==> Hello <==\nHow are you ? \n\n==> Hiii <==\nHello....\n\n==> Thank You <==\nWelcome\n"
    assert.equal(format(["Hello","Hiii","Thank You"],["How are you ? ","Hello....","Welcome"]),expectedOutput);
  });

});
