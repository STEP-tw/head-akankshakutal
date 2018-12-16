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

const isOptionInvalid = function(option) {
  return option != "n" && option != "c";
};

const isValidForTail = function(type, count) {
  return count == 0 && type == "tail";
};

const checkErrors = function(parsedInputs, type) {
  let { option, count } = parsedInputs;
  if (isOptionInvalid(option)) {
    return errorForIllegalOption(option, type);
  }
  if (isValidForTail(type, count)) {
    return " ";
  }
  if (!(count > 0)) {
    return errorForIllegalCount(option, count, type);
  }
};
module.exports = {
  errorForIllegalCount,
  errorForIllegalOption,
  isOptionInvalid,
  isValidForTail,
  checkErrors
};
