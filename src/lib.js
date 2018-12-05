const execute = function(functionName, files, encoding ) { 
  return files.map( function(element) {
    return functionName(element,encoding);
  });
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
    return "==> "+ fileName + " <==\n"+ content+"\n";
}

const format = function(fileNames,contents) { 
  if( fileNames.length == 1 ) {
    return contents.join("");
  }
  return contents.map((content,index) => addHeading(fileNames[index],content)).join("\n");
}

const head = function(userInputs,reader,validater) { 
  let parameters = extractInput(userInputs);
  if(parameters.count < 1 ) {
    return parameters.option == getNLines ? "head: illegal line count -- 0" : "head: illegal byte count -- 0";
  }
  if(!userInputs[0].startsWith("-n") && !userInputs[0].startsWith("-c") && parameters.files[0] != userInputs[0]) {
   return "head: illegal option -- "+ userInputs[0][1] +"\nusage: head [-n lines | -c bytes] [file ...]";
  }
  let contents = execute(reader, parameters.files , "utf8"); 
  let requiredContents = execute(parameters.option, contents , parameters.count );
  let result = format(parameters.files, requiredContents);
  return result;
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
