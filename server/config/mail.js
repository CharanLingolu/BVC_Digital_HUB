import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, // your real email
    pass: process.env.MAIL_PASS, // app password
  },
});

export default transporter;
