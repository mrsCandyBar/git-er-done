'use client';

import { useId } from "react";
import type { ComponentPropsWithoutRef } from "react";
import styles from "./Input.module.scss";

type Option = { value: string; label: string };

type InputProps = ComponentPropsWithoutRef<"input"> & {
  isTextarea?: false;
  label?: string;
  options?: never;
};

type CheckboxProps = ComponentPropsWithoutRef<"input"> & {
  type: "checkbox";
  label?: string;
  options?: Option[];
  isTextarea?: never;
};

type RadioProps = ComponentPropsWithoutRef<"input"> & {
  type: "radio";
  label?: string;
  options: Option[];
  isTextarea?: never;
};

type TextareaProps = ComponentPropsWithoutRef<"textarea"> & {
  isTextarea: true;
  label?: string;
};

type Props = InputProps | CheckboxProps | RadioProps | TextareaProps;

export default function Input(props: Props) {
  const { label, id, isTextarea, options, ...rest } = props as any;
  const generatedId = useId();
  const inputId = id || generatedId;

  if (isTextarea) {
    const textareaProps = rest as ComponentPropsWithoutRef<"textarea">;
    return (
      <div className={styles.wrapper}>
        {label && <label htmlFor={inputId}>{label}</label>}
        <textarea
          id={inputId}
          className={`${styles.input} ${styles.textarea}`.trim()}
          {...textareaProps}
        />
      </div>
    );
  }

  if ((rest.type === "checkbox" || rest.type === "radio") && options) {
    const fieldType = rest.type;
    const optionsArray = options as Option[];
    return (
      <div className={styles.wrapper}>
        {label && <p style={{ fontWeight: "500" }}>{label}</p>}
        <div className={fieldType === "checkbox" ? styles.checkboxGroup : styles.radioGroup}>
          {optionsArray.map((option: Option) => {
            const optionId = `${inputId}-${option.value}`;
            return (
              <label key={option.value} className={styles.optionLabel}>
                <input
                  type={fieldType}
                  value={option.value}
                  id={optionId}
                  {...rest}
                  className={styles.optionInput}
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  const inputProps = rest as ComponentPropsWithoutRef<"input">;
  return (
    <div className={styles.wrapper}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <input id={inputId} className={styles.input} {...inputProps} />
    </div>
  );
}
