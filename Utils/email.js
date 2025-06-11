const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
    // CREATE A TRANSPORTER 
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT === '465',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    //DEFINE EMAIL OPTIONS
    const emailOptions = {
        from: 'mohran support <mohamed01098187312@gmail.com>',
        to: option.email,
        subject: option.subject,
        text: option.message
    }
    await transporter.sendMail(emailOptions);
}

module.exports = sendEmail; 