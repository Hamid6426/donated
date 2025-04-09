// utils/email.js
import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Donated" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Email could not be sent");
  }
}