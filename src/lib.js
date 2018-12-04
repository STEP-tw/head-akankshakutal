const execute = function(functionName, args) { 
  return functionName(args[0],args[1]);
}

const getNLines = function(content,numOfLines=10) { 
  return content.split("\n").slice(0,numOfLines).join("\n");
}

const getNBytes = function(contents,numOfBytes=10) { 
  return contents.slice(0,numOfBytes);
}

module.exports = { execute,
getNLines,
getNBytes };
