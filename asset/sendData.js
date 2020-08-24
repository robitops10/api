module.exports = (res, statusCode, user) => {
	res.status(statusCode).json({
		status 	: 'success',
		count 	: user.length > 1 ? user.length : undefined,
		user
	});
};
