"use client";

import { UseFormReturn } from "react-hook-form";
import { CompanyFormData } from "../../schemas/company.schema";
import Input from "../ui/Input";
// import Select from "../ui/Select";
// import FileUpload from "../ui/FileUpload";

interface ContactOthersStepProps {
  form: UseFormReturn<CompanyFormData>;
}

// const LOGO_TYPE_OPTIONS = [
//   { label: "URL", value: "URL" },
//   { label: "Upload", value: "Upload" },
// ];

const iconClassName = "h-4 w-4";

export default function ContactOthersStep({ form }: ContactOthersStepProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  // const logoType = watch("logoType");
  // function handleFileChange(file: File | null) {
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => setValue("logo", reader.result as string);
  //     reader.readAsDataURL(file);
  //   } else {
  //     setValue("logo", "");
  //   }
  // }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Contato</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          label="Nome do Contato"
          name="contactName"
          placeholder="Nome do responsável"
          register={register("contactName")}
          error={errors.contactName?.message}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClassName}>
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
        />
        <Input
          label="Telefone"
          name="phone"
          mask="(99) 99999-9999"
          placeholder="(00) 00000-0000"
          register={register("phone")}
          error={errors.phone?.message}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClassName}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L9.1 10.53a16 16 0 0 0 4.37 4.37l1.07-1.07a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />
            </svg>
          }
        />
        <Input
          label="WhatsApp"
          name="whatsapp"
          mask="(99) 99999-9999"
          placeholder="(00) 00000-0000"
          register={register("whatsapp")}
          error={errors.whatsapp?.message}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClassName}>
              <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4.2-1.1L3 20l1.1-5.1A8.5 8.5 0 1 1 21 11.5Z" />
              <path d="M9.7 9.3c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .5.4.2.5.7 1.6.8 1.7.1.2.1.3 0 .5-.1.1-.2.3-.4.5-.1.1-.3.3-.1.6.1.2.7 1.1 1.6 1.8 1.1.9 2 .9 2.2 1 .2 0 .4 0 .5-.2.2-.2.7-.8.9-1 .1-.2.3-.2.5-.1.2.1 1.5.7 1.8.9.3.1.5.2.6.4.1.2.1 1.1-.3 1.5-.4.4-1.2.7-1.9.7-.5 0-1.1-.1-2.8-.9-2-.9-3.4-3.2-3.5-3.4-.1-.2-.8-1-.8-2 0-.9.5-1.4.7-1.6Z" />
            </svg>
          }
        />
        <Input
          label="E-mail"
          name="email"
          placeholder="contato@empresa.com"
          register={register("email")}
          error={errors.email?.message}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClassName}>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          }
        />
      </div>

    </div>
  );
}
