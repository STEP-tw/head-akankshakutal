### code_review

```File : src/lib.js
8 : using map index
30 : not using standard abbrevation.
31 : destructure objects
32 : context can be modified
43 : contents should be modified to fileContent.
58 : match with regex

File : src/parser.js
1 : parseInt can be used instead of isNumber
9 : is valid option should be modified

File : src/errorLib.js
1,9 : modify function name
5 : change type to operation

File : test/libTest.js
25 : Modify existSync function.
30 : not using standard abbrevation.
33 : contents can be modified with the name alphabets
37 : use smaller numbers to test initially
93 : duplicate test case
245 : Modify description for test case
254 : Modify description for test case
308 : Modify description for test case

File : test/parserTest.js
2 : parse should modified to better function name.
11 : Modify test cases.
22 : Modify description for test case
67,108 : either modify description or remove describe block
141 : Modify description for test case

File : test/errorLibTest.js
36 : Modify function name
84 : Modify description for test case
```
