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

const isOnlyType = value => value.match(/^-[a-z]/g);

const isValidOption = value => value.match(/^-[a-z][0-9]/g);

const parse = function(args) {
  let parsedInput = { option: "n", count: 10, files: args.slice(0) };
  if (isOnlyType(args[0])) {
    parsedInput.option = args[0][1];
    parsedInput.count = args[1];
    parsedInput.files = args.slice(2);
  }
  if (isNumber(args[0])) {
    parsedInput.count = args[0].slice(1);
    parsedInput.files = args.slice(1);
  }
  if (isValidOption(args[0])) {
    parsedInput.option = args[0][1];
    parsedInput.count = args[0].slice(2);
    parsedInput.files = args.slice(1);
  }
  return parsedInput;
};

const addHeading = function(fileName, content) {
  return "==> " + fileName + " <==\n" + content;
};

const isValid = function(args, userInput, fileSystem) {
  const invalidLineCount = "head: illegal line count -- ";
  const invalidByteCount = "head: illegal byte count -- ";
  const errorMessage = "head: illegal option -- ";
  const usageMessage = "usage: head [-n lines | -c bytes] [file ...]";

  if ( !isValidType(args[0]) && args[0] != userInput.files[0] && !isNumber(args[0]) ) {
    return errorMessage + args[0].slice(1) + "\n" + usageMessage;
  }
  if (userInput.count < 1 || isNaN(userInput.count)) {
    return userInput.option == "c"
      ? invalidByteCount + userInput.count
      : invalidLineCount + userInput.count;
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
   let requiredContents = getNBytes(contents,userInput.count);
  if(userInput.option == "n") {
    requiredContents = getNLines(contents,userInput.count);
  }

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
  parse,
  addHeading,
  getContents,
  isValid,
  getNBytes
};
