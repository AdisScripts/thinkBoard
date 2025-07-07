// utils/emailService.js
import dotenv from "dotenv"

dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = async (to, resetLink) => {
  await transporter.sendMail({
    to,
    from: process.env.EMAIL_USER,
    subject: "Reset your QuickNoteX credentials",
    html: `
      <p>Click <a href="${resetLink}">here</a> to reset your credentials.</p>
      <p>This link will expire in 15 minutes.</p>
    `,
  });
};
