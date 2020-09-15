'use strict';


export const login = async (email, password) => {
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

		const data = await res.json(); 							// We Set Cookie & Token response back if authenticate.
		console.log( data );

		if( data ) { 																	// check data.status == 'success'
			alert( 'Login is successfull' );

			// const el = document.createElement('h2');
			// el.classList.add('success');
			// el.textContent = 'Login is successfull';
			// document.body.appendChild(el);

			setTimeout( () => {
				location.assign('/'); 										// redirect to Home page.
			}, 500);
		}

	} catch (err) { console.log( 'Opps Error' ); }
};







