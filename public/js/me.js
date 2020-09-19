

let user = '';
if( document.querySelector('#user') ) {
 	user = document.querySelector('#user').innerHTML;
}
// console.log( user );

const output = document.querySelector('#output');
const submit = document.querySelector('#submit');
const userPhoto = document.querySelector('#userPhoto');
if(output) output.textContent = user;


if( submit ) submit.addEventListener('click', async function(e) {
	e.preventDefault();

	const formData = new FormData( this.form );

	const url = 'http://localhost:3000/me';
	const res = await fetch(url, {
		method: 'PATCH',
		body 	: formData
	});

	if ( res.status !== 200 ) return '';
	const data = await res.json();

	if( data.status == 'success' ) {
		// if(output) output.textContent = JSON.stringify(data.data);
		// if(output) output.textContent = `Photo [ ${data.data.photo} ] successfully uploaded !!!`;
		if(userPhoto) userPhoto.src = `/images/${data.data.photo}`;
	}
	console.log( data.data )



}, false);
