const mockUtf8Reader = function(expectedFilePaths, expectedEncoding) {
  return function(actualFilePath, actualEncoding) {
    if (expectedEncoding === actualEncoding) {
      return expectedFilePaths[actualFilePath];
    }
  };
};

const mockExistsSync = function(expectedFilePaths) {
  return function(actualFileName) {
    return actualFileName in expectedFilePaths;
  };
};

const mockReader = function(expectedFilePaths) {
  return {
    readFileSync: mockUtf8Reader(expectedFilePaths, "utf8"),
    existsSync: mockExistsSync(expectedFilePaths)
  };
};

exports.mockReader = mockReader;
