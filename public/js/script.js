'use strict';


const fetchFunc = async (email, password) => {
	// console.log( email, password ); 							// put outside of try & catch or may not work.
	try {
		// const res = await fetch('http://localhost:3000/handleLogin', {
		const res = await fetch('http://localhost:3000/api/v1/logins/login', {
			method: 'post',
			headers : {
				'Accept' 				: 'application/json',
				'Content-Type' 	: 'application/json'
			},
			body: JSON.stringify({
				email,
				password
			})
		});
		// return await res.json();

		const data = await res.json(); 							// We Set Cookie & Token response back if authenticate.
		console.log( data );

		if( data ) { 																	// check data.status == 'success'
			alert( 'Login is successfull' );
			setTimeout( () => {
				location.assign('/'); 										// redirect to Home page.
			}, 1500);
		}




	return data;

	} catch (err) {
		console.log( 'Opps Error' );
	}
};


document.querySelector('#loginBtn').addEventListener('click', async function(e) {
	e.preventDefault();
	let email = this.form.email.value;
	let password = this.form.password.value;

	const data = await fetchFunc(email, password);

	// if( !data ) return console.log('no Data Returns Back.');

	// document.querySelector('#output').innerText = ` Token : ${data.token}`;
	// console.log( data );


}, false);





