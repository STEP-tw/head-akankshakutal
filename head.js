const { head } = require("./src/lib.js");
const { parse } = require("./src/parser.js");
const { checkErrors } = require("./src/errorLib.js");
const fs = require("fs");

const main = function() {
  let args = process.argv.slice(2);
  let parsedInput = parse(args);
  let result = checkErrors(parsedInput, "head");
  if (!result) {
    result = head(parsedInput, fs);
  }
  console.log(result);
};

main();
