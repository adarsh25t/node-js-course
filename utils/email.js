const nodemailer = require('nodemailer');

const sendEmail = async (option) => {

    // 1. CREATE A TRANSPORT
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_USERPASSWORD
        }
    });

    // 2. DEFINE THE EMAIL OPTIONS
    const mailOptions = {
        from: "the fake email <adarshoffice25t@gmail.com>",
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    // 3. SEND EMAIL
   await transport.sendMail(mailOptions)
}

module.exports = sendEmail