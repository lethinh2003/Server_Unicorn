const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const { USER_MESSAGES } = require("../configs/config.user.messages");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("./app_error");

const sendEmail = async (options) => {
  try {
    //SENDGRID
    const transport = nodemailer.createTransport(
      sgTransport({
        auth: {
          api_key: process.env.SENDGRID_APIKEY,
        },
      })
    );
    const mailOptions = {
      from: process.env.SENDGRID_MAILFROM,
      to: options.email,
      subject: options.subject,
      text: options.text,
      html: options.message,
    };

    await transport.sendMail(mailOptions);
  } catch (err) {
    throw new BadRequestError(`${USER_MESSAGES.SEND_MAIL_FAILED}: ${err.message}`);
  }
};
module.exports = sendEmail;
