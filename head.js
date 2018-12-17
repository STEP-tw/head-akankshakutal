const { headOrTail } = require("./src/lib.js");
const { parse } = require("./src/parser.js");
const fileSystem = require("fs");

const main = function() {
  let args = process.argv.slice(2);
  let parsedInput = parse(args);
  let result = headOrTail(parsedInput, process.argv[1], fileSystem);
  console.log(result);
};

main();
