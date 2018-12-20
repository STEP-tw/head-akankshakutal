const isOnlyType = function(value) {
  return value.match(/^-[a-z]/g);
};

const hasOptionAndCount = function(value) {
  return value.match(/^-[a-z][0-9]/g);
};

const createObject = function(option, count, fileNames) {
  return { option, count, fileNames };
};

const parse = function(args) {
  let firstArg = args[0];
  let parsedInput = { option: "n", count: 10, fileNames: args.slice(0) };
  if (isOnlyType(firstArg)) {
    parsedInput = createObject(firstArg[1], args[1], args.slice(2));
  }
  if (parseInt(firstArg)) {
    parsedInput = createObject("n", firstArg.slice(1), args.slice(1));
  }
  if (hasOptionAndCount(firstArg)) {
    parsedInput = createObject(firstArg[1], firstArg.slice(2), args.slice(1));
  }
  return parsedInput;
};

module.exports = {
  isOnlyType,
  hasOptionAndCount,
  createObject,
  parse
};
