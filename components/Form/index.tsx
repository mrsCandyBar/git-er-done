'use client';

import { useEffect, useRef, useState } from "react";
import type { FormEventHandler, ReactNode } from "react";
import Input from "../Input";
import Button from "../Button";
import Text from "../Text";
import styles from "./Form.module.scss";

export type FormFieldConfig = {
  name: string;
  label: ReactNode;
  ariaLabel?: string;
  hideLabel?: boolean;
  type?: "text" | "email" | "password" | "number" | "textarea" | "select" | "checkbox" | "radio";
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  rows?: number;
  options?: Array<{ value: string; label: ReactNode }>;
  error?: string;
};

type FormProps = {
  fields: FormFieldConfig[];
  onSubmit?: (formData: Record<string, FormDataEntryValue>) => void;
  submitLabel?: string;
  showSubmitButton?: boolean;
  requireValidUpdates?: boolean;
  renderSubmitButton?: (props: { disabled: boolean }) => ReactNode;
  children?: ReactNode;
  footnote?: string;
};

export default function Form({
  fields,
  onSubmit,
  submitLabel = "Submit",
  showSubmitButton = true,
  requireValidUpdates = true,
  renderSubmitButton,
  children,
  footnote,
}: FormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const updateSubmitState = () => {
    const form = formRef.current;

    if (!form) {
      setIsSubmitDisabled(true);
      return;
    }

    const isValid = form.checkValidity();

    const hasValidUpdates = Array.from(form.elements).some((element) => {
      if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) {
        return false;
      }

      if (!element.name || element.disabled) {
        return false;
      }

      if (element instanceof HTMLInputElement) {
        if (element.type === "hidden" || element.type === "submit" || element.type === "reset" || element.type === "button") {
          return false;
        }

        if (element.type === "checkbox" || element.type === "radio") {
          return element.checked;
        }
      }

      return element.value.trim().length > 0;
    });

    setIsSubmitDisabled(!isValid || (requireValidUpdates && !hasValidUpdates));
  };

  useEffect(() => {
    updateSubmitState();
  }, [fields, requireValidUpdates]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    onSubmit?.(data);
  };

  return (
    <>
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit} onInput={updateSubmitState} onChange={updateSubmitState}>
      {fields.map((field) => {
        const key = `${field.name}-${field.type}`;
        const visibleLabel = field.hideLabel ? undefined : field.label;
        const ariaLabel = field.ariaLabel || (typeof field.label === "string" ? field.label : undefined);

        if (field.type === "select" && field.options) {
          return (
            <div key={key} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {visibleLabel && <label htmlFor={field.name}>{visibleLabel}</label>}
              <select id={field.name} name={field.name} required={field.required} aria-label={field.hideLabel ? ariaLabel : undefined}>
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
                label={visibleLabel}
                options={field.options}
                defaultValue={field.defaultValue}
                required={field.required}
              />
              {field.error && <p className={styles.error}>{field.error}</p>}
            </div>
          );
        }

        const inputProps = {
          name: field.name,
          label: visibleLabel,
          "aria-label": field.hideLabel ? ariaLabel : undefined,
          placeholder: field.placeholder,
          defaultValue: field.defaultValue,
          required: field.required === true,
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
      
      {footnote && (
        <Text as="p" align="center" tone="secondary" className={styles.footnote}>
          {footnote}
        </Text>
      )}

      {(showSubmitButton || renderSubmitButton) && (
        <div className={styles.actions}>
          {renderSubmitButton ? (
            renderSubmitButton({ disabled: isSubmitDisabled })
          ) : (
            <Button type="submit" variant="filled" disabled={isSubmitDisabled}>
              {submitLabel}
            </Button>
          )}
        </div>
      )}
    </form>
    </>
  );
}
