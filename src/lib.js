const execute = function(functionName, files) { 
  return files.map( function(element) {
    return functionName(element,"utf8");
  });
}

const getNLines = function(content,numOfLines=10) { 
  return content.split("\n").slice(0,numOfLines).join("\n");
}

const getNBytes = function(contents,numOfBytes=10) { 
  return contents.slice(0,numOfBytes);
}

const select = function(option) { 
  return (/-n/).test(option) ? getNLines : getNBytes;
}

module.exports = { execute,
  getNLines,
  select,
  getNBytes };
