// other libraries
import nodemailer from "nodemailer";

// components
import { render } from "@react-email/components";
import ResetPassword from "./ResetPassword";
import VerifyEmail from "./VerifyEmail";
import EmailChange from "./EmailChange";

// Create a nodemailer transporter
const TRANSPORTER = nodemailer.createTransport({
  host: process.env.TRANSPORTER_HOST,
  port: 587,
  auth: { user: process.env.TRANSPORTER_USER, pass: process.env.TRANSPORTER_PASS },
});

// Send an email using the nodemailer transporter
const sendEmail = (to: string, subject: string, emailHtml: string) =>
  TRANSPORTER.sendMail({ from: process.env.TRANSPORTER_USER, to, subject, html: emailHtml });

// Send the "reset password" email
export const sendResetPassword = async (email: string, url: string): Promise<void> => {
  // Import the email template component and convert it into an html string
  const emailHtml = await render(<ResetPassword url={url} />);

  // Finally, send an email using the nodemailer transporter
  await sendEmail(email, "Total Recall AI ► Reset Password", emailHtml);
};

// Send the "verify email" email
export const sendVerifyEmail = async (email: string, url: string): Promise<void> => {
  // Import the email template component and convert it into an html string
  const emailHtml = await render(<VerifyEmail url={url} />);

  // Finally, send an email using the nodemailer transporter
  await sendEmail(email, "Total Recall AI ► Verify Email", emailHtml);
};

// Send the "email change" email
export const sendEmailChange = async (email: string, newEmail: string, url: string): Promise<void> => {
  // Import the email template component and convert it into an html string
  const emailHtml = await render(<EmailChange newEmail={newEmail} url={url} />);

  // Finally, send an email using the nodemailer transporter
  await sendEmail(email, "Total Recall AI ► Email Change", emailHtml);
};
