const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Create a transporter object using Gmail's SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD, // Your Gmail app password
  },
});

// Function to send an email
const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to, // Recipient address
      subject, // Email subject
      text, // Plain text body
      html, // HTML body
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Route to handle email sending
router.post("/email", async (req, res) => {
  const { to, subject, text, html } = req.body;

  // Validate request body
  if (!to || !subject || !text || !html) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Send the email
    const info = await sendEmail(to, subject, text, html);
    res.status(200).json({ message: "Email sent successfully", info });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;