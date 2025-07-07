import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

export const sendOTPEmail = async (to, otp) => {
  await transporter.sendMail({
    to,
    from: process.env.EMAIL_USER,
    subject: "QuickNoteX Email Verification OTP",
    html: `<p>Your OTP for QuickNoteX registration is <b>${otp}</b></p>`,
  });
};

export default generateOTP;
