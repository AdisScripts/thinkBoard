import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendResetEmail } from "../utils/emailService.js";
import generateOTP, { sendOTPEmail } from "../utils/otpService.js";

const router = express.Router();
const otpStore = new Map(); // email -> { otp, expiresAt }

// Password Validator Function
function isValidPassword(password) {
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,16}$/;
  return regex.test(password);
}

// Send OTP to email
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ error: "Email already registered" });

  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpStore.set(email, { otp, expiresAt });

  try {
    await sendOTPEmail(email, otp);
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("OTP send error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Register Route (with OTP & strong password check)
router.post("/register", async (req, res) => {
  const { username, email, password, otp } = req.body;

  if (!username || !email || !password || !otp) {
    return res.status(400).json({ error: "All fields including OTP are required" });
  }

  // OTP check
  const otpData = otpStore.get(email);
  if (!otpData || otpData.otp !== otp || Date.now() > otpData.expiresAt) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  // Password validation
  if (!isValidPassword(password)) {
    return res.status(400).json({
      error: "Password must be 8–16 characters, include at least 1 number and 1 symbol",
    });
  }

  // Extra check: password shouldn't include username or email part
  const lowerPass = password.toLowerCase();
  const emailLocalPart = email.split("@")[0].toLowerCase();

  if (
    lowerPass.includes(username.toLowerCase()) ||
    lowerPass.includes(emailLocalPart)
  ) {
    return res.status(400).json({
      error: "Password should not contain your username or email",
    });
  }

  // Uniqueness check
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return res.status(400).json({ error: "Username or email already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    otpStore.delete(email); // Clear OTP after success

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

// Forgot Password
router.post("/forgot", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const baseUrl = req.headers.origin || "http://localhost:5173";
  const resetLink = `${baseUrl}/reset/${token}`;
  await sendResetEmail(user.email, resetLink);

  res.json({ message: "Reset link sent to your email" });
});

// Reset Password
router.post("/reset/:token", async (req, res) => {
  const { token } = req.params;
  const { newUsername, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const updates = {};

    if (newUsername) updates.username = newUsername;

    if (newPassword) {
      if (!/^(?=.*[0-9])(?=.*[\W_]).{8,16}$/.test(newPassword)) {
        return res.status(400).json({ error: "Weak password" });
      }
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    await User.findByIdAndUpdate(decoded.userId, updates);
    res.json({ message: "Credentials updated successfully" });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

export default router;
