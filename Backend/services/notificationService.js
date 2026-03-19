const nodemailer = require("nodemailer");

// create transporter using gmail or env variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// function to send email
const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);
  } catch (err) {
    console.log("Error sending email:", err.message);
  }
};

// send pass update email
const sendPassEmail = async (visitorEmail, passCode, status) => {

  const subject = "Visitor Pass Update";

  const message = `
Hello,

Your visitor pass (${passCode}) status is now: ${status}.

Thank you.
`;

  await sendEmail(visitorEmail, subject, message);
};

module.exports = {
  sendEmail,
  sendPassEmail,
};