const { checkErrors } = require("./errorLib.js");

const addHeading = function(fileName, content) {
  return "==> " + fileName + " <==\n" + content;
};

const formatContents = function(fileNames, content, index) {
  if (content.match(/: No such file or directory/)) return content;
  return addHeading(fileNames[index], content);
};

const getNBytes = function(content, range) {
  return content.slice(range[0], range[1]);
};

const getNLines = function(content, range) {
  return content
    .split("\n")
    .slice(range[0], range[1])
    .join("\n");
};

const getRequiredContents = function(userInput, range, contents) {
  if (userInput.option == "n") {
    return getNLines(contents, range);
  }
  return getNBytes(contents, range);
};

const getContents = function(fs, operation, file) {
  let { readFileSync, existsSync } = fs;
  if (!existsSync(file)) {
    return operation + ": " + file + ": No such file or directory";
  }
  let contents = readFileSync(file, "utf8");
  return contents;
};

const getFilteredContents = function(userInput, operation, fs) {
  let { count, fileNames } = userInput;
  let range = [0, count];
  if (operation === "tail") {
    range = [-count];
  }
  let fileContents = fileNames.map(getContents.bind(null, fs, operation));
  let requiredContents = fileContents.map(
    getRequiredContents.bind(null, userInput, range)
  );
  if (requiredContents.length == 1) return requiredContents.join("\n\n");
  let formattedContents = requiredContents.map(
    formatContents.bind(null, fileNames)
  );
  return formattedContents.join("\n\n");
};

const headOrTail = function(userInput, operation, fs) {
  let error = checkErrors(userInput, operation);
  if (error) return error;
  return getFilteredContents(userInput, operation, fs);
};

module.exports = {
  getFilteredContents,
  getNLines,
  addHeading,
  getContents,
  getRequiredContents,
  formatContents,
  getNBytes,
  headOrTail
};
