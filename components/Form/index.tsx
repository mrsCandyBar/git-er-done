'use client';

import type { FormEventHandler, ReactNode } from "react";
import Input from "../Input";
import Button from "../Button";
import styles from "./Form.module.scss";

export type FormFieldConfig = {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number" | "textarea" | "select" | "checkbox" | "radio";
  placeholder?: string;
  required?: boolean;
  rows?: number;
  options?: Array<{ value: string; label: string }>;
  error?: string;
};

type FormProps = {
  fields: FormFieldConfig[];
  onSubmit?: (formData: Record<string, FormDataEntryValue>) => void;
  submitLabel?: string;
  children?: ReactNode;
};

export default function Form({
  fields,
  onSubmit,
  submitLabel = "Submit",
  children,
}: FormProps) {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    onSubmit?.(data);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {fields.map((field) => {
        const key = `${field.name}-${field.type}`;

        if (field.type === "select" && field.options) {
          return (
            <div key={key} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor={field.name}>{field.label}</label>
              <select id={field.name} name={field.name} required={field.required}>
                <option value="">Choose an option</option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if ((field.type === "checkbox" || field.type === "radio") && field.options) {
          return (
            <div key={key} className={styles.fieldWrapper}>
              <Input
                name={field.name}
                type={field.type}
                label={field.label}
                options={field.options}
                required={field.required}
              />
              {field.error && <p className={styles.error}>{field.error}</p>}
            </div>
          );
        }

        const inputProps = {
          name: field.name,
          label: field.label,
          placeholder: field.placeholder,
          required: field.required,
        };

        if (field.type === "textarea") {
          return (
            <div key={key} className={styles.fieldWrapper}>
              <Input
                {...inputProps}
                isTextarea
                rows={field.rows}
              />
              {field.error && <p className={styles.error}>{field.error}</p>}
            </div>
          );
        }

        return (
          <div key={key} className={styles.fieldWrapper}>
            <Input
              {...inputProps}
              type={(field.type || "text") as any}
            />
            {field.error && <p className={styles.error}>{field.error}</p>}
          </div>
        );
      })}

      {children}

      <div className={styles.actions}>
        <Button type="submit" variant="filled">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
