import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.BREVO_API_KEY) {
    console.error("❌ Fatal Error: BREVO_API_KEY is missing in .env file");
    return;
  }

  // ✅ FIX: Handle both Single String (OTP) and Array of Strings (Events)
  let recipients;
  if (Array.isArray(to)) {
    // If it's an array, map it to the object format Brevo needs
    recipients = to.map((email) => ({ email }));
  } else {
    // If it's a single string, wrap it in an array
    recipients = [{ email: to }];
  }

  const data = {
    sender: {
      name: process.env.BREVO_SENDER_NAME || "BVC DigitalHub",
      email: process.env.BREVO_SENDER_EMAIL || process.env.MAIL_USER,
    },
    to: recipients, // ✅ Use the formatted recipients list
    subject: subject,
    htmlContent: html,
  };

  try {
    const res = await axios.post("https://api.brevo.com/v3/smtp/email", data, {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
        accept: "application/json",
      },
      timeout: 10000,
    });

    console.log(`✅ Email sent! ID: ${res.data?.messageId}`);
    return res.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    console.error("❌ Brevo API Failed:", errorMsg);
    // Don't throw error here for Events, otherwise the Event won't save if email fails
    // Just log it.
  }
};
