"use client";

import { UseFormRegisterReturn } from "react-hook-form";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  name: string;
  options: SelectOption[];
  error?: string;
  register?: UseFormRegisterReturn;
  placeholder?: string;
}

export default function Select({
  label,
  name,
  options,
  error,
  register,
  placeholder,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={name}
        className={
          "w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black" +
          (error ? " border-red-500" : " border-gray-300")
        }
        {...register}
      >
        <option value="">{placeholder ?? "Selecione..."}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
