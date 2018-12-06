const getNLines = function(content, numOfLines = 10) {
  return content
    .split("\n")
    .slice(0, numOfLines)
    .join("\n");
};

const getNBytes = function(contents, numOfBytes = 10) {
  return contents.slice(0, numOfBytes);
};

const select = function(option) {
  return /-c/.test(option) ? getNBytes : getNLines;
};

const isNumber = value => value.match(/^-[0-9]/g);

const isValidType = value => value.match(/^-[nc]/g);

const isValidOption = value => value.match(/^-[nc][0-9]/g);

const getCount = function(args) {
  if (!isValidType(args[0]) && !isNumber(args[0])) {
    return 10;
  }
  if (isNumber(args[0])) {
    return args[0].slice(1, args[0].length);
  }
  if (isValidOption(args[0])) {
    return args[0].slice(2, args[0].length);
  }
  return args[1];
};

const getFileNames = function(args) {
  let sliceCount = 0;
  if (args[0][0] == "-") {
    sliceCount = 1;
  }
  if (isFinite(args[1])) {
    sliceCount = 2;
  }
  return args.slice(sliceCount);
};

const parse = function(args) {
  return {
    option: select(args[0]),
    count: getCount(args.slice(0, 2)),
    files: getFileNames(args)
  };
};

const addHeading = function(fileName, content) {
  return "==> " + fileName + " <==\n" + content;
};

const isValid = function(args, userInput, fileSystem) {
  const invalidLineCount = "head: illegal line count -- ";
  const invalidByteCount = "head: illegal byte count -- ";
  const errorMessage = "head: illegal option -- ";
  const usageMessage = "usage: head [-n lines | -c bytes] [file ...]";

  if (userInput.count < 1 || isNaN(userInput.count)) {
    return userInput.option == getNBytes
      ? invalidByteCount + userInput.count
      : invalidLineCount + userInput.count;
  }
  if (
    !isValidType(args[0]) &&
    args[0] != userInput.files[0] &&
    !isNumber(args[0])
  ) {
    return errorMessage + args[0].slice(0) + "\n" + usageMessage;
  }
  let formatContents = getContents.bind(null, fileSystem, userInput);
  let formattedContents = userInput.files.map(formatContents);
  return formattedContents.join("\n\n");
};

const getContents = function(fileSystem, userInput, file) {
  if (!fileSystem.existsSync(file)) {
    return "head: " + file + ": No such file or directory";
  }
  let contents = fileSystem.readFileSync(file, "utf8");
  let requiredContents = userInput.option(contents, userInput.count);
  if (userInput.files.length == 1) {
    return requiredContents;
  }
  return addHeading(file, requiredContents);
};

const head = function(args, fileSystem) {
  let userInput = parse(args);
  let contents = isValid(args, userInput, fileSystem);
  return contents;
};

module.exports = {
  head,
  getNLines,
  select,
  getCount,
  getFileNames,
  parse,
  format,
  addHeading,
  getContents,
  isValid,
  getNBytes
};
