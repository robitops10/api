
module.exports = (fn) => {
	return (req, res, next) => {
		// fn(req, res, next).catch( err => next(err) );			// catch require callback & pass one argument
		fn(req, res, next).catch( next ); 										// Here passed callback
	};
}
