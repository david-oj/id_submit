// api/submit.ts

// 1) Disable Vercel’s body parser so formidable can see the files
export const config = { api: { bodyParser: false } };

import { IncomingForm } from "formidable-serverless";
import { v2 as cloudinary } from "cloudinary";

// 2) Configure Cloudinary with your env vars
cloudinary.config({
  cloud_name:   process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:      process.env.CLOUDINARY_API_KEY!,
  api_secret:   process.env.CLOUDINARY_API_SECRET!,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Only POST allowed");
  }

  const form = new IncomingForm();
  form.maxFileSize = 10 * 1024 * 1024; // 10 MB per file

  form.parse(req, async (err, _fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(400).json({ error: "Invalid form data" });
    }

    try {
      // Upload front and back in parallel
      const [front, back] = await Promise.all(
        ["id_front", "id_back"].map(field => {
          const file = (files as any)[field];
          if (!file) throw new Error(`Missing file field: ${field}`);
          return cloudinary.uploader.upload(file.filepath, {
            folder:        "id-submissions",
            resource_type: "image",
          });
        })
      );

      // Return the secure URLs so you can verify
      return res.status(200).json({
        status:   "ok",
        frontUrl: front.secure_url,
        backUrl:  back.secure_url,
      });
    } catch (uploadErr) {
      console.error("Cloudinary upload error:", uploadErr);
      return res.status(500).json({ error: "Upload failed" });
    }
  });
}
