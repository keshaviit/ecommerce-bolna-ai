const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Configured to just print the verification link to the console in development
    // if real credentials are not provided.
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'yourgmail@gmail.com') {
        console.log('--- DEVELOPMENT MODE: MOCK EMAIL ---');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log('------------------------------------');
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Verify connection configuration before sending
        await new Promise((resolve, reject) => {
            transporter.verify(function (error, success) {
                if (error) {
                    console.error("SMTP Configuration Error:", error);
                    reject(error);
                } else {
                    console.log("Server is ready to take our messages");
                    resolve(success);
                }
            });
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        // Send email and explicitly await the callback
        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error("Send mail error:", err);
                    reject(err);
                } else {
                    console.log("Message sent:", info.response);
                    resolve(info);
                }
            });
        });
    } catch (error) {
        console.error("Error sending email in sendEmail utility:", error);
        throw error;
    }
};

module.exports = sendEmail;
