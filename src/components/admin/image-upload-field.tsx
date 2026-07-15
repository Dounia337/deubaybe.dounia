"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Field } from "./form-fields";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function ImageUploadField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please choose a JPG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image is too large (max 5MB).");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    setUploading(false);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Upload failed. Try again.");
      return;
    }
    const json = await res.json();
    onChange(json.url);
  }

  return (
    <Field label={label} hint={hint}>
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border-strong bg-bg-sunken">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-fg-subtle">
              <ImagePlus className="h-6 w-6" />
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-bg/70">
              <Loader2 className="h-5 w-5 animate-spin text-accent" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-md border border-border-strong bg-bg-elevated px-3 py-1.5 text-sm font-medium text-fg hover:border-accent disabled:opacity-60"
            >
              {value ? "Replace photo" : "Upload photo"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-fg-muted hover:text-danger"
              >
                <X className="h-3.5 w-3.5" /> Remove
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          {error && <p className="text-xs text-danger">{error}</p>}
        </div>
      </div>
    </Field>
  );
}
