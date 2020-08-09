let query = 'age,gender,-a,b,c';
// query = query.split(',').join(' ');
query = query.replace(/,/g, ' ');

console.log( query );
