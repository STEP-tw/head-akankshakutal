#! /bin/bash

  node ./head.js file1
  node ./head.js -n5 file1
  node ./head.js -n 5 file1
  node ./head.js -5 file1
  node ./head.js file1 file2
  node ./head.js -n 5 file1 file2
  node ./head.js -n5 file1 file2
  node ./head.js -5 file1 file2
  node ./head.js -c5 file1
  node ./head.js -c 5 file1
  node ./head.js -c5 file1 file2
  node ./head.js -c 5 file1 file2
  node ./head.js -c0 file1
  node ./head.js -0 file1
  node ./head.js -n0 file1 
  node ./head.js -c 0 file1
  node ./head.js -n 0 file1
  node ./head.js -c0 file1 file2
  
