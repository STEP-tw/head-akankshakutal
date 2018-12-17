const illegalCountError = function(option, count, operation) {
  let optionoperation = { n: "line", c: "byte" };
  let head = "head: illegal " + optionoperation[option] + " count -- " + count;
  let tail = "tail: illegal offset -- " + count;
  let operations = { head, tail };
  return operations[operation];
};

const isValidForTail = function(operation, count) {
  return count == 0 && operation == "tail";
};

const illegalOptionError = function(option, operation) {
  let head =
    "head: illegal option -- " +
    option +
    "\nusage: head [-n lines | -c bytes] [file ...]";
  let tail =
    "tail: illegal option -- " +
    option +
    "\nusage: tail [-F | -f | -r] [-q] [-b # | -c # | -n #] [file ...]";
  operations = { head, tail };
  return operations[operation];
};

const isOptionInvalid = function(option) {
  return option != "n" && option != "c";
};

const checkErrors = function(parsedInputs, operation) {
  let { option, count } = parsedInputs;
  if (isOptionInvalid(option)) {
    return illegalOptionError(option, operation);
  }
  if (isValidForTail(operation, count)) {
    return " ";
  }
  if (!(count > 0)) {
    return illegalCountError(option, count, operation);
  }
};
module.exports = {
  illegalCountError,
  illegalOptionError,
  isOptionInvalid,
  isValidForTail,
  checkErrors
};
