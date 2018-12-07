const getNLines = function(content, numOfLines = 10) {
  return content
    .split("\n")
    .slice(0, numOfLines)
    .join("\n");
};

const getNBytes = function(contents, numOfBytes = 10) {
  return contents.slice(0, numOfBytes);
};

const isNumber = function (value) {
  return value.match(/^-[0-9]/g);
}

const isValidType = function (value) {
  return value.match(/^-[nc]/g);
}

const isOnlyType = function (value) {
  return value.match(/^-[a-z]/g);
}

const isValidOption = function (value) {
  return value.match(/^-[a-z][0-9]/g);
}

const isNotEqual = function(x, y) {
  return x != y;
}

const isNotTypeAndCount = function (x, y) {
  return !isValidType(x) && isNotEqual(x, y) && !isNumber(x);
}

const invalidCount = function (count) {
  return count < 1 || isNaN(count);
}

const addHeading = function(fileName, content) {
  return "==> " + fileName + " <==\n" + content;
};

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

const checkErrors = function(args, userInput) {
  const invalidLineCount = "head: illegal line count -- ";
  const invalidByteCount = "head: illegal byte count -- ";
  const errorMessage = "head: illegal option -- ";
  const usageMessage = "usage: head [-n lines | -c bytes] [file ...]";

  if (isNotTypeAndCount(args[0], userInput.files[0])) {
    return errorMessage + args[0].slice(1) + "\n" + usageMessage;
  }
  if (invalidCount(userInput.count)) {
    return userInput.option == "c"
      ? invalidByteCount + userInput.count
      : invalidLineCount + userInput.count;
  }
};

const getContents = function(fileSystem, userInput, file) {
  if (!fileSystem.existsSync(file)) {
    return "head: " + file + ": No such file or directory";
  }
  let contents = fileSystem.readFileSync(file, "utf8");
  let requiredContents = getNBytes(contents, userInput.count);
  if (userInput.option == "n") {
    requiredContents = getNLines(contents, userInput.count);
  }

  if (userInput.files.length == 1) {
    return requiredContents;
  }
  return addHeading(file, requiredContents);
};

const head = function(args, fileSystem) {
  let userInput = parse(args);
  let error = checkErrors(args, userInput);
  if (error) return error;
  let formatContents = getContents.bind(null, fileSystem, userInput);
  let formattedContents = userInput.files.map(formatContents);
  return formattedContents.join("\n\n");
};

module.exports = {
  head,
  getNLines,
  parse,
  addHeading,
  getContents,
  checkErrors,
  getNBytes,
  isNumber,
  isNotTypeAndCount,
  isValidOption,
  isOnlyType,
  isNotEqual,
  isValidType,
  invalidCount
};
