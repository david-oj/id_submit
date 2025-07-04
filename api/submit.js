// api/submit.js
import "dotenv/config"; // loads your .env.local
import nodemailer from "nodemailer";

export const config = { api: { bodyParser: false } };

import IncomingForm from "formidable-serverless";
import { v2 as cloudinary } from "cloudinary";

// Verify env
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Missing Cloudinary credentials");
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Gmail SMTP Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // True for 465, false for other ports
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Bypass SSL errors in development
  },
});

console.log({
  user: process.env.GMAIL_ADDRESS,
  pass: process.env.GMAIL_APP_PASSWORD?.length, // Should show 16
});

export default async function handler(req, res) {
  console.log("Handler invoked:", req.method);
  if (req.method !== "POST") {
    return res.status(405).end("Only POST allowed");
  }

  const form = new IncomingForm({ maxFileSize: 10 * 1024 * 1024 });
  form.parse(req, async (err, _fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(400).json({ error: err.message });
    }

    console.log("Parsed files:", Object.keys(files));

    try {
      const uploads = await Promise.all(
        ["id_front", "id_back"].map((field) => {
          const entry = files[field];
          const file = Array.isArray(entry) ? entry[0] : entry;

          // DEBUG: inspect the file object
          console.log(`File object for ${field}:`, file);

          // Attempt both possible properties
          const localPath = file.filepath || file.path || file.file;
          if (!localPath) {
            throw new Error(
              `No valid path property on parsed file for field: ${field}`
            );
          }

          // console.log(`Using localPath for ${field}:`, localPath);
          return cloudinary.uploader.upload(localPath, {
            folder: "id-submissions",
            resource_type: "image",
          });
        })
      );

      await sendNotificationEmail(uploads[0].secure_url, uploads[1].secure_url);

      // console.log("Upload results:", uploads);
      return res.status(200).json({
        status: "ok",
        message: "Upload successful!",
        data: {
          frontUrl: uploads[0].secure_url,
          backUrl: uploads[1].secure_url,
        },
      });
    } catch (uploadErr) {
      // console.error("Cloudinary upload error:", uploadErr);
      return res.status(500).json({ error: uploadErr.message });
    }
  });
}

async function sendNotificationEmail(frontUrl, backUrl) {
  const mailOptions = {
    from: `"ID Upload System" <${process.env.GMAIL_ADDRESS}>`,
    to: process.env.NOTIFICATION_EMAIL,
    subject: "New ID Document Uploaded",
    html: `
    <h1>New ID Document Uploaded</h1>
    <p>You have received new ID document images:</p>
    <h3>Front Image:</h3>
    <a href="${frontUrl}" target="_blank">View Front Image</a>
    <h3>Back Image:</h3>
    <a href="${backUrl}" target="_blank">View Back Image</a>
    <p>This is an automated message. Please do not reply.</p>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email notification sent");
  } catch (error) {
    console.error("Email failed to send:", error);
  }
}
