import express from "express";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

import nodemailer from "nodemailer";

router.post("/send-result", async (req, res) => {
  try {
    const { email, result } = req.body; 
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: '"MindCheck" <mirta.krajacic@gmail.com>',
      to: email,
      subject: "Rezultati rješenog upitnika",
      html: `${result}`, 
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;