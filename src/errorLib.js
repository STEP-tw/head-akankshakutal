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
module.exports = {
  errorForIllegalCount,
  errorForIllegalOption,
  checkErrors
};
