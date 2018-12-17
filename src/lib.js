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

const getContents = function(fileSystem, context, file) {
  if (!fileSystem.existsSync(file)) {
    return context + ": " + file + ": No such file or directory";
  }
  let contents = fileSystem.readFileSync(file, "utf8");
  return contents;
};

const getFilteredContents = function(userInput, context, fileSystem) {
  let range = [0, userInput.count];
  if (context === "tail") {
    range = [-userInput.count];
  }
  let contents = userInput.fileNames.map(
    getContents.bind(null, fileSystem, context)
  );
  let requiredContents = contents.map(
    getRequiredContents.bind(null, userInput, range)
  );
  if (requiredContents.length == 1) return requiredContents.join("\n\n");
  let formattedContents = requiredContents.map(
    formatContents.bind(null, userInput.fileNames)
  );
  return formattedContents.join("\n\n");
};

const headOrTail = function(userInput, operation, fileSystem) {
  let context = operation
    .match(/....\.js/)
    .join("")
    .slice(0, 4);
  let error = checkErrors(userInput, context);
  if (error) return error;
  return getFilteredContents(userInput, context, fileSystem);
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
