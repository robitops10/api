const logoutBtn = document.querySelector('#logoutBtn');



if( logoutBtn ) {
	logoutBtn.addEventListener('click', async function(e) {
		e.preventDefault();

		// access loginRouter.js > logout route
		const res = await fetch('http://localhost:3000/api/v1/logins/logout');
		const data = await res.json();
		if (data.status == 'success') {
			location.reload( true ); 													// true means load from server, not from browser cache
		}
		// console.log( data );
		// console.log( data.status );


	},false);
}
