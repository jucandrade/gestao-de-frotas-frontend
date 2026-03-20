"use client";

import { forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  mask?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  icon?: React.ReactNode;
}

/** Apply a mask where `9` = digit, separator chars are inserted automatically. */
function applyMask(raw: string, mask: string): string {
  const digits = raw.replace(/\D/g, "");
  let result = "";
  let di = 0;
  for (let i = 0; i < mask.length && di < digits.length; i++) {
    result += mask[i] === "9" ? digits[di++] : mask[i];
  }
  return result;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, mask, error, register, disabled, placeholder, icon, ...rest }, _ref) => {
    const baseClassName =
      "w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" +
      (error ? " border-red-500" : " border-gray-300");

    if (mask && register) {
      const { onChange, onBlur, name: fieldName, ref } = register;
      return (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label}
          </label>
          <div className="relative">
            {icon ? (
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                {icon}
              </span>
            ) : null}
            <input
              id={name}
              ref={ref}
              name={fieldName}
              disabled={disabled}
              placeholder={placeholder}
              className={`${baseClassName} ${icon ? "pl-10" : ""}`}
              onChange={(e) => {
                const formatted = applyMask(e.target.value, mask);
                e.target.value = formatted;
                onChange(e);
              }}
              onBlur={onBlur}
              {...rest}
            />
          </div>
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="relative">
          {icon ? (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
              {icon}
            </span>
          ) : null}
          <input
            id={name}
            ref={_ref}
            disabled={disabled}
            placeholder={placeholder}
            className={`${baseClassName} ${icon ? "pl-10" : ""}`}
            {...register}
            {...rest}
          />
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
