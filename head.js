/* 
  Usage:
  node ./head.js file1
  node ./head.js -n5 file1
  node ./head.js -n 5 file1
  node ./head.js -5 file1
  node ./head.js file1 file2
  node ./head.js -n 5 file1 file2
  node ./head.js -n5 file1 file2
  node ./head.js -5 file1 file2 
  node ./head.js -c5 file1
  node ./head.js -c 5 file1
  node ./head.js -c5 file1 file2
  node ./head.js -c 5 file1 file2
*/
const { extractInput,execute,format } = require("./src/lib.js");
const { readFileSync } = require("fs");

const main = function() { 
  let userInputs = process.argv.slice(2);
  let parameters = extractInput(userInputs);
  let contents = execute(readFileSync, parameters.files , "utf8"); 
  let requiredContents = execute(parameters.option, contents , parameters.count );
  let result = format(parameters.files, requiredContents);
  console.log(result);
}

main();

