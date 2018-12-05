const execute = function(functionName, file, encoding ) { 
    return functionName(file,encoding);
}

const getNLines = function(content,numOfLines=10) { 
  return content.split("\n").slice(0,numOfLines).join("\n");
}

const getNBytes = function(contents,numOfBytes=10) { 
  return contents.slice(0,numOfBytes);
}

const select = function(option) { 
  return ( (/-c/).test(option) ) ? getNBytes : getNLines;
}

const getCount = function(userInputs) { 
  if( !userInputs[0].match(/^-[nc]/g) &&  !userInputs[0].match(/^-[0-9]/g) ) {
    return 10;
  }
  let match1 =  userInputs[0].match(/[0-9]/g); 
  if(match1) {
    return +match1.join("");
  }
  return +userInputs[1].match(/[0-9]/g).join(""); 
}

const getFileNames = function(userInputs) { 
  if( userInputs[0].match(/^-/) && userInputs[0].match(/[0-9]/) ) {
    return userInputs.slice(1);
  }
  if( userInputs[0].match(/^-/) && ! userInputs[0].match(/[0-9]/) ) {
    return userInputs.slice(2);
  }
  return userInputs;
}

const extractInput = function(userInputs) { 
  return { option : select(userInputs[0]),
    count : getCount(userInputs.slice(0,2)),
    files : getFileNames(userInputs)
  }
}

const addHeading = function(fileName,content) { 
    return "==> "+ fileName + " <==\n"+ content;
}

const format = function(fileName,contents) { 
  return  addHeading(fileName,contents);
}

const head = function(userInputs,reader,validater) { 
  let parameters = extractInput(userInputs);
  return parameters.files.map(function (file) {
    if( !validater(file) ) {
      return 'head: '+file+': No such file or directory';
    }
    let contents = execute(reader, file , "utf8"); 
    let requiredContents = parameters.option(contents,parameters.count);
    if( parameters.files.length == 1) {
      return requiredContents;
    }
    let result = format(file, requiredContents);
    return result;
  }).join("\n\n");
}

module.exports = { head,
  execute, 
  getNLines,
  select,
  getCount,
  getFileNames,
  extractInput,
  format,
  addHeading,
  getNBytes,
};
