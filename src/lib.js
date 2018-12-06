const getNLines = function(content,numOfLines=10) { 
  return content.split("\n").slice(0,numOfLines).join("\n");
}

const getNBytes = function(contents,numOfBytes=10) { 
  return contents.slice(0,numOfBytes);
}

const select = function(option) { 
  return ( (/-c/).test(option) ) ? getNBytes : getNLines;
}

const getCount = function(args) { 
  if( !args[0].match(/^-[nc]/g) &&  !args[0].match(/^-[0-9]/g) ) {
    return 10;
  }
  let match1 =  args[0].match(/^-[0-9]/g); 
  if(match1) {
    return args[0].slice(1,args[0].length);
  }
  let match2 =  args[0].match(/^-[nc][0-9]/g); 
  if(match2) {
    return args[0].slice(2,args[0].length);
  }
  return args[1]; 
}

const getFileNames = function(args) { 
  if( args[0].match(/^-/) && args[0].match(/[0-9]/) ) {
    return args.slice(1);
  }
  if( args[0].match(/^-/) && ! args[0].match(/[0-9]/) ) {
    return args.slice(2);
  }
  return args;
}

const parse = function(args) { 
  return { option : select(args[0]),
    count : getCount(args.slice(0,2)),
    files : getFileNames(args)
  }
}

const addHeading = function(fileName,content) { 
    return "==> "+ fileName + " <==\n"+ content;
}

const format = function(fileName,contents) { 
  return  addHeading(fileName,contents);
}

const validateInput  = function(args,userInput) { 
  if( userInput.count < 1 || isNaN(userInput.count)) {
    return (userInput.option == getNBytes ) ? "head: illegal byte count -- "+userInput.count : "head: illegal line count -- " + userInput.count;
  }
  if( !args[0].match(/^-[nc]/) && args[0] != userInput.files[0] && !args[0].match(/^-[0-9]/) ) {
    return "head: illegal option -- "+ args[0].slice(0) +"\nusage: head [-n lines | -c bytes] [file ...]";
  }
  return "1";
}

const head = function(args,fileSystem) { 
  let userInput = parse(args);
  let validInput = validateInput(args,userInput);
  if( validInput != 1) {
    return validInput;
  }
  return userInput.files.map(function (file) {
    if( !fileSystem.existsSync(file) ) {
      return 'head: '+file+': No such file or directory';
    }
    let contents = fileSystem.readFileSync(file,"utf8"); 
    let requiredContents = userInput.option(contents,userInput.count);
    if( userInput.files.length == 1) {
      return requiredContents;
    }
    let result = format(file, requiredContents);
    return result;
  }).join("\n\n");
}

module.exports = { head,
  getNLines,
  select,
  getCount,
  getFileNames,
  parse,
  format,
  addHeading,
  getNBytes,
};
