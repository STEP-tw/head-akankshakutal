const illegalCountError = function(option, count, type) {
  let optionType = { n: "line", c: "byte" };
  let head = "head: illegal " + optionType[option] + " count -- " + count;
  let tail = "tail: illegal offset -- " + count;
  let types = { head, tail };
  return types[type];
};

const isValidForTail = function(type, count) {
  return count == 0 && type == "tail";
};

const illegalOptionError = function(option, type) {
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

const isOptionInvalid = function(option) {
  return option != "n" && option != "c";
};

const checkErrors = function(parsedInputs, type) {
  let { option, count } = parsedInputs;
  if (isOptionInvalid(option)) {
    return illegalOptionError(option, type);
  }
  if (isValidForTail(type, count)) {
    return " ";
  }
  if (!(count > 0)) {
    return illegalCountError(option, count, type);
  }
};
module.exports = {
  illegalCountError,
  illegalOptionError,
  isOptionInvalid,
  isValidForTail,
  checkErrors
};
