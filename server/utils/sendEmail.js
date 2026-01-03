import axios from "axios";

export const sendEmail = async ({ to, subject, html }) => {
  if (!to || to.length === 0) return;

  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.BREVO_SENDER_EMAIL,
          name: process.env.BREVO_SENDER_NAME || "BVC DigitalHub",
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          accept: "application/json",
        },
        timeout: 10000,
      }
    );

    console.log("✅ Brevo email sent to:", to);
  } catch (error) {
    console.error(
      "❌ Brevo email error:",
      error.response?.data || error.message
    );
    // ❗ Do NOT throw — signup should not fail
  }
};
