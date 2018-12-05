const { head } = require("./src/lib.js");
const { readFileSync,existsSync } = require("fs");

const main = function() { 
  let userInputs = process.argv.slice(2);
  let result = head(userInputs,readFileSync,existsSync);
  console.log(result);
}

main();

