
// import axios from 'axios'; 							// if used axios module after install
// import '@babel/polyfill'; 									// support some javascript features for older browser
import { login } from './login.js'; 					// $ pwd == /js

const loginBtn = document.querySelector('#loginBtn');
if( loginBtn ) {
	loginBtn.addEventListener('click', function(e) {

		e.preventDefault();
		let email = this.form.email.value;
		let password = this.form.password.value;

		login(email, password);
		// console.log(email, password);

	}, false);

} // end of loginBtn condition


