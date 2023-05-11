const {
  transporterEthereal,
  transporterGmail,
} = require("../../services/modules/emailService");
const { emailHTML, newUserEmailContent } = require("../../utils/emailHTML");
const nodemailer = require("nodemailer");

exports.etherealSendMail = async (emailData) => {
  try {
    let info = await transporterEthereal.sendMail({
      from: "colocarCorreoquetedioNodemailer@ethereal.email",
      to: "fabianbasualdo0909@gmail.com",
      subject: `${emailData.message} ${emailData.date}`,
      html: emailHTML(emailData),
    });
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log(error);
  }
};

exports.etherealNewUserSendMail = async (emailData) => {
  try {
    let info = await transporterEthereal.sendMail({
      from: "colocarCorreoquetedioNodemailer@ethereal.email",
      to: "ulises.roa07@gmail.com",
      subject: `Nuevo usuario`,
      html: newUserEmailContent(emailData),
    });
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log(error);
  }
};

exports.gmailSendMail = async (data, emailContent) => {
  try {
    const { username, date, message, picture } = data;
    await transporterGmail.sendMail({
      from: "Servidor",
      to: "ulises.roa07@gmail.com",
      subject: `${message} ${date}`,
      html: emailHTML({ username, date, message }),
      attachments: {
        
        filename: "profilepic.jpeg",
        path: picture,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
