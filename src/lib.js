const getNLines = function (content,context, numOfLines = 10) {
  if (context.match(/tail\.js/)) {
    return content
      .split('\n')
      .slice(content.split('\n').length - numOfLines)
      .join('\n');
  }
  return content
    .split("\n")
    .slice(0, numOfLines)
    .join("\n");
};

const getNBytes = function (content, context, numOfBytes = 10) {
  if (context.match(/tail\.js/)) {
    return content.slice(content.length - numOfBytes);
  }
  return content.slice(0, numOfBytes);
};

const isNumber = function (value) {
  return value.match(/^-[0-9]/g);
};

const isValidType = function (value) {
  return value.match(/^-[nc]/g);
};

const isOnlyType = function (value) {
  return value.match(/^-[a-z]/g);
};

const isValidOption = function (value) {
  return value.match(/^-[a-z][0-9]/g);
};

const isNotEqual = function (x, y) {
  return x != y;
};

const isNotTypeAndCount = function (x, y) {
  return !isValidType(x) && isNotEqual(x, y) && !isNumber(x);
};

const invalidCount = function (count, context) {
  return context .match(/head\.js/) && (count < 1 || isNaN(count));
};

const addHeading = function (fileName, content) {
  return "==> " + fileName + " <==\n" + content;
};

const invalidTailCount = function (context, count) {
   return (context.match(/tail\.js/) && isNaN(count)) || count < 0 ;
}

const createObject = function (option, count, files) {
  return { option, count, files };
}

const parse = function (args) {
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

const checkErrors = function (args, userInput, context) {
  const invalidLineCount = "head: illegal line count -- ";
  const invalidByteCount = "head: illegal byte count -- ";
  const errorMessage = "head: illegal option -- ";
  const usageMessage = "usage: head [-n lines | -c bytes] [file ...]";
  const errorStatments = {
    n: invalidLineCount,
    c: invalidByteCount
  };
  if(invalidTailCount(context,userInput.count)) {
    return "tail: illegal offset -- " + userInput.count;
  }
  if (isNotTypeAndCount(args[0], userInput.files[0])) {
    return errorMessage + args[0].slice(1) + "\n" + usageMessage;
  }
  if (invalidCount(userInput.count, context)) {
    return errorStatments[userInput.option] + userInput.count;
  }
};

const getContents = function (fileSystem, userInput, context, file) {
  if (!fileSystem.existsSync(file)) {
    return context.match(/....\.js/).join("").slice(0,4) + ": " + file + ": No such file or directory";
  }
  let contents = fileSystem.readFileSync(file, "utf8");
  let requiredContents = getNBytes(contents, context, userInput.count);
  if (userInput.option == "n") {
    requiredContents = getNLines(contents, context, userInput.count);
  }
  if (userInput.files.length == 1) {
    return requiredContents;
  }
  return addHeading(file, requiredContents);
};

const getFilteredContents = function (args, fileSystem, context) {
  let userInput = parse(args);
  let error = checkErrors(args, userInput, context);
  if (error) return error;
  let formatContents = getContents.bind(null, fileSystem, userInput,context) ;
  let formattedContents = userInput.files.map(formatContents);
  return formattedContents.join("\n\n");
};

module.exports = {
  getFilteredContents,
  getNLines,
  createObject,
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
  invalidCount,
  invalidTailCount
};


