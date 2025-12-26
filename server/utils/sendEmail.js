import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  if (!to || to.length === 0) return;

  await transporter.sendMail({
    from: `"BVC DigitalHub" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
};
