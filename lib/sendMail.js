require('dotenv').config()
const nodemailer = require('nodemailer');
module.exports = async function sendMail(receiver, subject, html) {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.PORT,
        secure: true,
        auth: {
          user: process.env.AUTH_USER,
          pass: process.env.AUTH_PASSWORD,
        },
    });

    return transporter.sendMail({
        from: process.env.MAIL_FROM, // sender address
        to: receiver, // list of receivers
        subject: subject, // Subject line
        html: html, // html body
        replyTo: process.env.MAIL_REPLY_TO
    });

}
