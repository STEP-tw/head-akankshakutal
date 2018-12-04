const execute = function(functionName, args) { 
  return functionName(args[0],args[1]);
}

module.exports = { execute };
