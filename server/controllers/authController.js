import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { sendEmail } from "../utils/sendEmail.js";

/* ===============================
   HELPERS
================================ */
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const normalizeEmail = (email) => email?.toLowerCase().trim();

/* ===============================
   1. SEND SIGNUP OTP (Step 1)
   ✅ Sends OTP to email & stores in temp DB. 
   ✅ Does NOT create a User yet.
================================ */
export const sendSignupOtp = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    email = normalizeEmail(email);

    // 1. Check if user already exists in main User DB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already registered. Please login." });
    }

    // 2. Generate OTP
    const otp = generateOTP();

    // 3. Save to Temporary OTP Collection (Upsert: Create or Update)
    await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // 4. Send Email
    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Welcome to BVC Hub!</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "BVC Hub Verification Code",
      html: emailHtml,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};

/* ===============================
   2. SIGNUP (Step 2)
   ✅ Verifies OTP & Creates User in DB
================================ */
export const signup = async (req, res) => {
  try {
    let { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res
        .status(400)
        .json({ message: "All fields including OTP are required" });
    }

    email = normalizeEmail(email);

    // ✅ FIX: Ensure OTP is a string and remove spaces
    const inputOtp = String(otp).trim();

    console.log(`DEBUG: Verifying ${email} with OTP: '${inputOtp}'`);

    // 1. Check if OTP matches in Temp Collection
    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      console.log(`DEBUG: No OTP record found for ${email}`);
      return res
        .status(400)
        .json({ message: "OTP expired or invalid. Please resend." });
    }

    // ✅ FIX: Debugging log to see mismatch
    console.log(
      `DEBUG: DB OTP: '${otpRecord.otp}' vs Input OTP: '${inputOtp}'`
    );

    if (otpRecord.otp !== inputOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // 2. Check if user already exists (Double check for safety)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User in Main DB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: true, // Auto-verified
      isOnboarded: false,
    });

    // 5. Generate Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 6. Cleanup OTP
    await Otp.deleteOne({ email });

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

/* ===============================
   3. LOGIN (Restored)
================================ */
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = normalizeEmail(email);

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Account not found" });

    // Check verification status
    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your account first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isOnboarded: user.isOnboarded,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

/* ===============================
   4. VERIFY OTP (Step 1.5 - Standalone Check)
   ✅ Checks if OTP is valid without creating a user
   ✅ Used by frontend to show "Verified" status before password entry
================================ */
export const verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    email = normalizeEmail(email);
    const inputOtp = String(otp).trim();

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP expired or invalid." });
    }

    if (otpRecord.otp !== inputOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Success - We do NOT delete the OTP here;
    // we delete it only after the final Signup is complete.
    res.status(200).json({ message: "OTP Verified Successfully" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res
      .status(500)
      .json({ message: "Verification failed", error: error.message });
  }
};
