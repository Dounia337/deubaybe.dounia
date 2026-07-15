import { put } from "@vercel/blob";
import crypto from "crypto";
import { ApiError } from "./session";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

export async function saveUploadedImage(file: File): Promise<string> {
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    throw new ApiError(400, "Please upload a JPG, PNG, WebP, or GIF image.");
  }
  if (file.size > MAX_BYTES) {
    throw new ApiError(400, "Image is too large (max 5MB).");
  }

  const year = String(new Date().getFullYear());
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;

  const blob = await put(`uploads/${year}/${filename}`, file, {
    access: "public",
    contentType: file.type,
  });

  return blob.url;
}
