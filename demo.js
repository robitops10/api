
let value = "E11000 duplicate key error collection: api2.users index: name_1 dup key: { name: \"Riajul Islam\" }";
// value = value;
value = value.match(/".*?"/)[0].trim('\\')
console.log( value );

// value = value.match(/(["|'])(?:(?=(\\?))\2.)*?\1/);



