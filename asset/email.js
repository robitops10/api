const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
	const transporter = await nodemailer.createTransport({
		// service : 'Gmail', 			// == host + port 	=> Well known service
		host : process.env.EMAIL_HOST,
		port : process.env.EMAIL_PORT,
		auth : {
			user : process.env.EMAIL_USERNAME,
			pass : process.env.EMAIL_PASSWORD
		}
	});

	await transporter.sendMail({
		from 		: 'MD. Riajul Islam <abc@gmail.com>',
		to 			: options.email,
		subject : options.subject,
		text 	 	: options.message
	});

	return true; 		// added by me
};

module.exports = sendEmail;
