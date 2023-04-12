import { InputHTMLAttributes } from "react";
import { FieldValues, UseControllerProps, useController } from "react-hook-form";
import { makeId } from '../utils/makeId'
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
} 

export type TextFieldProps<T extends FieldValues> = Props & UseControllerProps<T>;

export function TextField<T extends FieldValues>({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  label,
  ...rest
}: TextFieldProps<T>) {
  const {
    field,
    fieldState: { error },
    formState: { isSubmitting }
  } = useController({ name, control, defaultValue, rules, shouldUnregister });

  const id = makeId()
  
  return (
    <label htmlFor={id}>
      {label}
      <br />
      <input
        {...rest}
        id={id}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        disabled={isSubmitting}
      />
      {error && (
        <small style={{ display: 'block', color: 'red' }}>{ error.message }</small>
      )}
    </label>
  )
}