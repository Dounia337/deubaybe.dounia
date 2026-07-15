import nodemailer from "nodemailer";

type ContactPayload = { name: string; email: string; message: string };

/**
 * Sends an email notification when a new contact message arrives.
 * Only called when SMTP_HOST and NOTIFY_EMAIL are set in the environment —
 * see .env.example. Never throws into the request path; callers should
 * already be catching this.
 */
export async function sendContactNotification(data: ContactPayload) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.NOTIFY_EMAIL,
    replyTo: data.email,
    subject: `New portfolio message from ${data.name}`,
    text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
  });
}
