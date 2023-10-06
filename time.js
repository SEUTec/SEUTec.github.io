/* 

Run: node time.js

Return:

new Date().toUTCString()
Fri, 06 Oct 2023 06:01:19 GMT

new Date().toISOString()
2023-10-06T06:01:19.446Z

new Date().toJSON()
2023-10-06T06:01:19.469Z

new Date().toDateString()
Fri Oct 06 2023

new Date().toLocaleString()
6/10/2023, 8:01:19

new Date().toLocaleDateString()
6/10/2023

new Date().toLocaleTimeString()
8:01:19

new Date().toString()
Fri Oct 06 2023 08:01:19 GMT+0200 (hora de verano de Europa central)

new Date().toTimeString()
08:01:19 GMT+0200 (hora de verano de Europa central)

*/

console.log("new Date().toUTCString()");
console.log(new Date().toUTCString());
console.log("");

console.log("new Date().toISOString()");
console.log(new Date().toISOString());
console.log("");

console.log("new Date().toDateString()");
console.log(new Date().toDateString());
console.log("");

console.log("new Date().toLocaleString()");
console.log(new Date().toLocaleString());
console.log("");

console.log("new Date().toLocaleDateString()");
console.log(new Date().toLocaleDateString());
console.log("");

console.log("new Date().toLocaleTimeString()");
console.log(new Date().toLocaleTimeString());
console.log("");

console.log("new Date().toJSON()")
console.log(new Date().toJSON())
console.log("");

console.log("new Date().toString()")
console.log(new Date().toString())
console.log("");

console.log("new Date().toTimeString()")
console.log(new Date().toTimeString())
console.log("");
