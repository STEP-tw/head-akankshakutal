const { headOrTail } = require("./src/lib.js");
const { parse } = require("./src/parser.js");
const fs = require("fs");

const main = function() {
  let args = process.argv.slice(2);
  let parsedInput = parse(args);
  let result = headOrTail(parsedInput, "head", fs);
  console.log(result);
};

main();
