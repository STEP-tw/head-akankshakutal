const { head } = require("./src/headLib.js");
const fs = require("fs");

const main = function() { 
  let args = process.argv.slice(2);
  let result = head(args,fs,process.argv[1]);
  console.log(result);
}

main();

