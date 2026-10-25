"use client";

import { useId, useRef, useState } from "react";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_DATA_URL_CHARS = 400_000;
const MAX_DIMENSION = 12_000;
const MAX_PIXELS = 40_000_000;
const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];

function loadImage(file: File): Promise<ImageBitmap> {
  if (typeof createImageBitmap !== "function") return Promise.reject(new Error("This browser cannot safely process the selected image."));
  return createImageBitmap(file).catch(() => { throw new Error("The image could not be opened. Try a JPEG, PNG, or WebP image."); });
}

export function AvatarUpload({ value, onChange }: { value: string | null; onChange: (value: string | null) => void }) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const chooseFile = async (file?: File) => {
    if (!file) return;
    setError("");
    if (!acceptedTypes.includes(file.type)) { setError("Choose a JPEG, PNG, or WebP image."); return; }
    if (file.size > MAX_FILE_BYTES) { setError("The image must be 5 MB or smaller."); return; }
    setBusy(true);
    let bitmap: ImageBitmap | undefined;
    try {
      bitmap = await loadImage(file);
      if (!bitmap.width || !bitmap.height || bitmap.width > MAX_DIMENSION || bitmap.height > MAX_DIMENSION || bitmap.width * bitmap.height > MAX_PIXELS) {
        throw new Error("This image has unusually large dimensions. Choose a smaller image.");
      }
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Image processing is unavailable in this browser.");
      const side = Math.min(bitmap.width, bitmap.height);
      const sx = (bitmap.width - side) / 2;
      const sy = (bitmap.height - side) / 2;
      context.drawImage(bitmap, sx, sy, side, side, 0, 0, 256, 256);
      let dataUrl = "";
      for (const quality of [0.86, 0.72, 0.58, 0.44]) {
        dataUrl = canvas.toDataURL("image/jpeg", quality);
        if (dataUrl.length <= MAX_DATA_URL_CHARS) break;
      }
      if (!dataUrl.startsWith("data:image/jpeg;base64,") || dataUrl.length > MAX_DATA_URL_CHARS) {
        throw new Error("This image could not be reduced enough to save. Choose a simpler image.");
      }
      onChange(dataUrl);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The image could not be processed.");
    } finally {
      bitmap?.close();
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return <div className="flex min-w-0 flex-wrap items-center gap-4">
    <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border border-white/15 bg-white/5 text-2xl text-muted-foreground" aria-label={value ? "Profile photo preview" : "No profile photo"}>
      {value ? <img src={value} alt="Profile photo preview" className="h-full w-full object-cover" /> : <span aria-hidden="true">◎</span>}
    </div>
    <div className="min-w-0 flex-1 space-y-2">
      <label htmlFor={inputId} className="block text-sm font-semibold">Profile photo</label>
      <input ref={inputRef} id={inputId} type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={event => void chooseFile(event.currentTarget.files?.[0])} className="block min-h-11 w-full min-w-0 text-sm file:mr-3 file:min-h-11 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:text-white" />
      <p className="text-xs text-muted-foreground">JPEG, PNG or WebP · up to 5 MB. Cropped to a 256 px square and saved on this device.</p>
      {value && <button type="button" onClick={() => { onChange(null); setError(""); }} className="min-h-11 rounded-lg px-3 text-sm font-semibold text-rose-300 underline">Remove photo</button>}
      {busy && <p className="text-sm" role="status">Processing photo…</p>}
      {error && <p className="break-words text-sm text-rose-200" role="alert">{error}</p>}
    </div>
  </div>;
}
