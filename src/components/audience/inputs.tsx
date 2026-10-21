"use client";

import type { MatrixQuestion, ScaleQuestion, SingleChoiceQuestion } from "@/domain/questions.ts";
import styles from "./audience.module.css";

/** Local, possibly incomplete answer. Matrix drafts hold null for unrated rows. */
export type DraftValue = string | number | readonly (number | null)[];

interface InputProps<Q, V> {
  readonly question: Q;
  readonly value: V | undefined;
  readonly onChange: (value: V) => void;
  readonly disabled?: boolean;
}

export function SingleChoice({ question, value, onChange, disabled }: InputProps<SingleChoiceQuestion, string>) {
  return (
    <fieldset className={styles.options} disabled={disabled}>
      <legend className="visually-hidden">{question.title}</legend>
      {question.options.map((option) => {
        const checked = value === option.id;
        return (
          <label key={option.id} className={styles.option} data-checked={checked || undefined}>
            <input
              type="radio"
              name={question.id}
              value={option.id}
              checked={checked}
              onChange={() => onChange(option.id)}
              className="visually-hidden"
            />
            {option.code && <span className={styles.code}>{option.code}</span>}
            <span className={styles.optionLabel}>{option.label}</span>
            <span className={styles.tick} aria-hidden="true" />
          </label>
        );
      })}
    </fieldset>
  );
}

function RatingRow({
  name,
  label,
  min,
  max,
  value,
  onChange,
}: {
  name: string;
  label: string;
  min: number;
  max: number;
  value: number | null | undefined;
  onChange: (value: number) => void;
}) {
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div className={styles.ratingRow} role="radiogroup" aria-label={label}>
      {values.map((v) => (
        <label key={v} className={styles.ratingCell} data-checked={value === v || undefined} data-filled={value != null && v <= value ? true : undefined}>
          <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} className="visually-hidden" />
          <span>{v}</span>
        </label>
      ))}
    </div>
  );
}

export function ScalePicker({ question, value, onChange, disabled }: InputProps<ScaleQuestion, number>) {
  return (
    <fieldset className={styles.scale} disabled={disabled}>
      <legend className="visually-hidden">{question.title}</legend>
      <RatingRow name={question.id} label={question.title} min={question.min} max={question.max} value={value} onChange={onChange} />
      <div className={styles.scaleLabels} aria-hidden="true">
        <span>{question.minLabel}</span>
        <span>{question.maxLabel}</span>
      </div>
    </fieldset>
  );
}

export function MatrixPicker({ question, value, onChange, disabled }: InputProps<MatrixQuestion, readonly (number | null)[]>) {
  const current = value ?? question.dimensions.map(() => null);
  return (
    <fieldset className={styles.matrix} disabled={disabled}>
      <legend className="visually-hidden">{question.title}</legend>
      <div className={styles.scaleLabels} aria-hidden="true">
        <span>1 = {question.minLabel}</span>
        <span>5 = {question.maxLabel}</span>
      </div>
      {question.dimensions.map((dimension, index) => (
        <div key={dimension.id} className={styles.matrixRow}>
          <p className={styles.matrixLabel}>{dimension.label}</p>
          <RatingRow
            name={`${question.id}-${dimension.id}`}
            label={dimension.label}
            min={question.min}
            max={question.max}
            value={current[index]}
            onChange={(v) => onChange(current.map((old, i) => (i === index ? v : old)))}
          />
        </div>
      ))}
    </fieldset>
  );
}
