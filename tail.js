const { headOrTail } = require("./src/lib.js");
const { parse } = require("./src/parser.js");
const { checkErrors } = require("./src/errorLib");
const fs = require("fs");

const main = function() {
  let args = process.argv.slice(2);
  let parsedInput = parse(args);
  let result = checkErrors(parsedInput, "tail");
  if (!result) {
    result = headOrTail(parsedInput, "tail", fs);
  }
  console.log(result);
};

main();
