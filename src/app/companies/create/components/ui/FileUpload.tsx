"use client";

import { useState } from "react";
import Image from "next/image";

interface FileUploadProps {
  label: string;
  name: string;
  error?: string;
  onChange: (file: File | null) => void;
}

export default function FileUpload({ label, name, error, onChange }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    onChange(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <label
          htmlFor={name}
          className="cursor-pointer rounded-lg border border-dashed border-gray-300 px-6 py-3 text-sm text-gray-500 transition-colors hover:border-black hover:text-black"
        >
          Escolher arquivo
        </label>
        <input
          type="file"
          id={name}
          accept="image/jpeg,image/png,image/svg+xml"
          className="hidden"
          onChange={handleChange}
        />
        {preview && (
          <Image
            src={preview}
            alt="Preview"
            width={48}
            height={48}
            className="h-12 w-12 rounded-lg border border-gray-200 object-contain"
          />
        )}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
