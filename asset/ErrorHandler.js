
class ErrorHandler extends Error {
	constructor(message,statusCode) {
		super(message);
		this.name = this.constructor.name; 					// override inherited name 		Error =>  ErrorHandler
		// add .stack property to this Object,
		Error.captureStackTrace(this, this.constructor); 			// (Optional) Because already inherited from Error

		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'error';
		this.isOperational = true; 						// Will be used to handle Error is it make by user or server.

	}
}

module.exports = ErrorHandler;
