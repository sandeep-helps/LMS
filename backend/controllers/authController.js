import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

import User from "../models/userModel.js";
import sendMail from "../configs/Mail.js";

/* =========================
   CREATE JWT TOKEN
========================= */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* =========================
   COOKIE OPTIONS (REUSE)
========================= */
const cookieOptions = {
  httpOnly: true,
  secure: true,       // REQUIRED (HTTPS)
  sameSite: "None",   // REQUIRED (Vercel ↔ Railway)
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

/* =========================
   SIGNUP
========================= */
export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* =========================
   LOGOUT
========================= */
export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* =========================
   GOOGLE SIGNUP / LOGIN
========================= */
export const googleSignup = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        role,
        isGoogleAuth: true,
      });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: `googleSignup error: ${error}` });
  }
};

/* =========================
   SEND OTP
========================= */
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerifed = false;

    await user.save();
    await sendMail(email, otp);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: `sendOtp error: ${error}` });
  }
};

/* =========================
   VERIFY OTP
========================= */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetOtp !== otp ||
      user.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isOtpVerifed = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: `verifyOtp error: ${error}` });
  }
};

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.isOtpVerifed) {
      return res.status(400).json({ message: "OTP verification required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.isOtpVerifed = false;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: `resetPassword error: ${error}` });
  }
};
