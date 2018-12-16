const getNLines = function(content, range) {
  return content
    .split("\n")
    .slice(range[0], range[1])
    .join("\n");
};

const getNBytes = function(content, range) {
  return content.slice(range[0], range[1]);
};

const isNumber = function(value) {
  return value.match(/^-[0-9]/g);
};

const isValidType = function(value) {
  return value.match(/^-[nc]/g);
};

const isOnlyType = function(value) {
  return value.match(/^-[a-z]/g);
};

const isValidOption = function(value) {
  return value.match(/^-[a-z][0-9]/g);
};

const isNotEqual = function(x, y) {
  return x != y;
};

const isNotTypeAndCount = function(x, y) {
  return !isValidType(x) && isNotEqual(x, y) && !isNumber(x);
};

const invalidCount = function(count, context) {
  return context === "head" && (count < 1 || isNaN(count));
};

const addHeading = function(fileName, content) {
  return "==> " + fileName + " <==\n" + content;
};

const invalidTailCount = function(context, count) {
  return (context === "tail" && isNaN(count)) || count < 0;
};

const createObject = function(option, count, files) {
  return { option, count, files };
};

const parse = function(args) {
  let parsedInput = { option: "n", count: 10, files: args.slice(0) };
  if (isOnlyType(args[0])) {
    parsedInput = createObject(args[0][1], args[1], args.slice(2));
  }
  if (isNumber(args[0])) {
    parsedInput = createObject("n", args[0].slice(1), args.slice(1));
  }
  if (isValidOption(args[0])) {
    parsedInput = createObject(args[0][1], args[0].slice(2), args.slice(1));
  }
  return parsedInput;
};

const errorForIllegalCount = function(option, count, type) {
  let optionType = { n: "line", c: "byte" };
  let head = "head: illegal " + optionType[option] + " count -- " + count;
  let tail = "tail: illegal offset -- " + count;
  let types = { head, tail };
  return types[type];
};

const errorForIllegalOption = function(option, type) {
  let head =
    "head: illegal option -- " +
    option +
    "\nusage: head [-n lines | -c bytes] [file ...]";
  let tail =
    "tail: illegal option -- " +
    option +
    "\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]";
  types = { head, tail };
  return types[type];
};

const checkErrors = function(parsedInputs, type) {
  let { option, count } = parsedInputs;
  if (option != "n" && option != "c") {
    return errorForIllegalOption(option, type);
  }
  if (count == 0 && type == "tail") {
    return " ";
  }
  if (!(count > 0)) {
    return errorForIllegalCount(option, count, type);
  }
};

const getContents = function(fileSystem, context, file) {
  if (!fileSystem.existsSync(file)) {
    return context + ": " + file + ": No such file or directory";
  }
  let contents = fileSystem.readFileSync(file, "utf8");
  return contents;
};

const getRequiredContents = function(userInput, range, contents) {
  if (userInput.option == "n") {
    return getNLines(contents, range);
  }
  return getNBytes(contents, range);
};

const formatContents = function(files, content, index) {
  if (content.match(/: No such file or directory/)) return content;
  return addHeading(files[index], content);
};

const getFilteredContents = function(args, fileSystem, operation) {
  let userInput = parse(args);
  let context = operation
    .match(/....\.js/)
    .join("")
    .slice(0, 4);
  let error = checkErrors(userInput, context);
  let range = [0, userInput.count];
  if (context === "tail") {
    range = [-userInput.count];
  }
  if (error) return error;
  let contents = userInput.files.map(
    getContents.bind(null, fileSystem, context)
  );
  let requiredContents = contents.map(
    getRequiredContents.bind(null, userInput, range)
  );
  if (requiredContents.length == 1) return requiredContents.join("\n\n");
  let formattedContents = requiredContents.map(
    formatContents.bind(null, userInput.files)
  );
  return formattedContents.join("\n\n");
};

module.exports = {
  getFilteredContents,
  getNLines,
  createObject,
  parse,
  addHeading,
  getContents,
  getRequiredContents,
  formatContents,
  errorForIllegalCount,
  errorForIllegalOption,
  checkErrors,
  getNBytes,
  isNumber,
  isNotTypeAndCount,
  isValidOption,
  isOnlyType,
  isNotEqual,
  isValidType,
  invalidCount,
  invalidTailCount
};
