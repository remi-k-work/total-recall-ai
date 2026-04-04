// services, features, and other libraries
import { Resend } from "resend";

// components
import ResetPassword from "./ResetPassword";
import VerifyEmail from "./VerifyEmail";
import EmailChange from "./EmailChange";

// types
import type { ReactNode } from "react";

// Create the transporter
const resend = new Resend(process.env.RESEND_API_KEY);

// Send an email using the transporter
const sendEmail = (to: string, subject: string, react: ReactNode) => resend.emails.send({ from: "total-recall-ai@remiforge.dev", to, subject, react });

// Import the email template component, set its props, and then send the email using the transporter (*Reset Password*)
export const sendResetPassword = (email: string, url: string) => sendEmail(email, "Total Recall AI ► Reset Password", <ResetPassword url={url} />);

// Import the email template component, set its props, and then send the email using the transporter (*Verify Email*)
export const sendVerifyEmail = (email: string, url: string) => sendEmail(email, "Total Recall AI ► Verify Email", <VerifyEmail url={url} />);

// Import the email template component, set its props, and then send the email using the transporter (*Email Change*)
export const sendEmailChange = (email: string, newEmail: string, url: string) =>
  sendEmail(email, "Total Recall AI ► Email Change", <EmailChange newEmail={newEmail} url={url} />);
