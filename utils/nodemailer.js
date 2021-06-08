const nodemailer = require("nodemailer");
const config = require("config");
const winston = require("../utils/winston");

module.exports = async ({ output, mailTo, mailSubject, filename, cc }) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.get("smtp.user"),
      pass: config.get("smtp.pass"),
    },
  });

  let info = await transporter.sendMail({
    from: `"Digital Service Report" <${config.get("smtp.user")}>`,
    to: mailTo,
    subject: mailSubject,
    text: mailSubject,
    cc,
    html: output,
    attachments: filename
      ? [
          {
            filename: `${filename}.pdf`,
            path: `./tmp/${filename}.pdf`,
          },
        ]
      : null,
  });

  winston.info(`Message send: %s ${info.messageId}`);
  winston.info(`Preview URL: %s ${nodemailer.getTestMessageUrl(info)}`);
};
