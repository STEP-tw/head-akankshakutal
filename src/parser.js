const isNumber = function(value) {
  return value.match(/^-[0-9]/g);
};

const isOnlyType = function(value) {
  return value.match(/^-[a-z]/g);
};

const isValidOption = function(value) {
  return value.match(/^-[a-z][0-9]/g);
};

const createObject = function(option, count, fileNames) {
  return { option, count, fileNames };
};

const parse = function(args) {
  let parsedInput = { option: "n", count: 10, fileNames: args.slice(0) };
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

module.exports = {
  isNumber,
  isOnlyType,
  isValidOption,
  createObject,
  parse
};
