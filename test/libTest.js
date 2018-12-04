const assert = require("assert");
const { execute } = require("../src/lib.js");

const add = num => num+10;
const sub = (num1,num2) => num1-num2;

describe("execute",function() {
  it("should call function with one argument ",function() {
    assert.equal(execute(add,[5]),15);
  });
  it("should call function with two arguments ",function() { 
      assert.equal(execute(sub,[10,5]),5)
  });
});

