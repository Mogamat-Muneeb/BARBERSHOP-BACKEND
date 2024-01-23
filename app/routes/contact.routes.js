const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", (req, res) => {
  const { email, name, message } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: `${name} wants to send you an email..`,
    text: `${message}
        
        contact ${name} back at ${email}
        `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      // console.log(error);
      res.status(400).send({ msg: "Email not sent" });
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      res.send({ msg: "Email sent successfully" });
      // }try {
      //     res.json({ message: `thank you ${name}, your email was sent`})
      // } catch (error) {
      //     res.status(500).send( {message: error.message} )
      // }
    }
  });
});

module.exports = router;
