const nodemailer = require("nodemailer");
const { PASS_GMAIL } = require("../../config/globals");

exports.transporterEthereal = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "colocarlosdatosquetedionodemailer@ethereal.email",
    pass: "colocarTupassword",
  },
});

exports.transporterGmail = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "ulises.roa07@gmail.com",
    pass: PASS_GMAIL,
  },
});
