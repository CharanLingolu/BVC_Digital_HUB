import axios from "axios";

export const sendEmail = async ({ to, subject, html }) => {
  // Security Check: Don't crash if email is missing
  if (!to || to.length === 0) {
    console.log("⚠️ No recipient email provided. Skipping.");
    return;
  }

  console.log(`📤 Attempting to send email to: ${to} via Brevo API...`);

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          // If env var is missing, fallback to a generic email to prevent 400 error
          email: process.env.BREVO_SENDER_EMAIL || "admin@bvc-digitalhub.com",
          name: process.env.BREVO_SENDER_NAME || "BVC DigitalHub",
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          accept: "application/json",
        },
        timeout: 10000, // 10-second timeout
      }
    );

    console.log(
      "✅ Email sent successfully! Message ID:",
      response.data.messageId
    );
  } catch (error) {
    // Detailed error logging for debugging on Render
    console.error("❌ Email Failed.");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Error Message:", error.message);
    }
    // We do NOT throw error here so the User Signup flow doesn't break
  }
};
