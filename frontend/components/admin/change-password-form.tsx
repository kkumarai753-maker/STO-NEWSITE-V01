"use client";

/**
 * Change password form. Why client: live validation (match, rules) and
 * pending/success/error states. The Server Action re-validates; the backend
 * checks the current password and signs out other devices.
 */
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { changePassword, type ChangePasswordState } from "@/app/actions/admin";
import {
  PASSWORD_MIN,
  changePasswordFields,
  changePasswordSchema,
  fieldErrorsOf,
  type ChangePasswordField,
  type ChangePasswordInput,
} from "@/lib/validation/admin";
import { Alert } from "./ui";
import { Field, PasswordInput, fieldA11y } from "./form-fields";

const INITIAL: ChangePasswordState = { status: "idle" };
const EMPTY: ChangePasswordInput = { currentPassword: "", newPassword: "", confirmPassword: "" };
type Errors = Partial<Record<ChangePasswordField, string>>;

const validate = (values: ChangePasswordInput): Errors => {
  const result = changePasswordSchema.safeParse(values);
  return result.success ? {} : fieldErrorsOf<ChangePasswordField>(result.error.issues);
};

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, INITIAL);
  const [values, setValues] = useState<ChangePasswordInput>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<ChangePasswordField, boolean>>>({});
  const [prevState, setPrevState] = useState(state);
  const bannerRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;

  if (state !== prevState) {
    setPrevState(state);
    if (state.status === "success") {
      setValues(EMPTY);
      setErrors({});
      setTouched({});
    } else if (state.status === "error") {
      setErrors(state.fieldErrors ?? {});
    }
  }

  useEffect(() => {
    if (state.status !== "idle") bannerRef.current?.focus();
  }, [state]);

  const update = (field: ChangePasswordField, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    // Re-check fields already visited or showing an error (so "don't match" clears as they type).
    const all = validate(next);
    setErrors((e) => {
      const out = { ...e };
      for (const f of changePasswordFields) if (touched[f] || e[f]) out[f] = all[f];
      return out;
    });
  };

  const blur = (field: ChangePasswordField) => {
    setTouched((t) => ({ ...t, [field]: true }));
    if (values[field] !== "") setErrors((e) => ({ ...e, [field]: validate(values)[field] }));
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const all = validate(values);
    if (Object.keys(all).length) {
      event.preventDefault();
      setErrors(all);
      setTouched({ currentPassword: true, newPassword: true, confirmPassword: true });
      const first = changePasswordFields.find((f) => all[f]);
      if (first) document.getElementById(id(first))?.focus();
    }
  };

  const showBanner = state.status !== "idle" && state.message && !pending;
  const hint = `At least ${PASSWORD_MIN} characters, with a letter and a number.`;

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate aria-busy={pending} className="flex flex-col gap-5">
      {showBanner ? (
        <div ref={bannerRef} tabIndex={-1} className="outline-none">
          <Alert tone={state.status === "success" ? "success" : "error"}>{state.message}</Alert>
        </div>
      ) : null}

      {/* Lets password managers associate the new password with the account. */}
      <input type="text" name="username" autoComplete="username" hidden readOnly />

      <fieldset disabled={pending} className="flex flex-col gap-5">
        <legend className="sr-only">Change your password</legend>
        <Field id={id("currentPassword")} label="Current password" error={errors.currentPassword}>
          <PasswordInput
            id={id("currentPassword")}
            name="currentPassword"
            autoComplete="current-password"
            value={values.currentPassword}
            onChange={(e) => update("currentPassword", e.target.value)}
            onBlur={() => blur("currentPassword")}
            {...fieldA11y(id("currentPassword"), errors.currentPassword)}
          />
        </Field>
        <Field id={id("newPassword")} label="New password" hint={hint} error={errors.newPassword}>
          <PasswordInput
            id={id("newPassword")}
            name="newPassword"
            autoComplete="new-password"
            value={values.newPassword}
            onChange={(e) => update("newPassword", e.target.value)}
            onBlur={() => blur("newPassword")}
            {...fieldA11y(id("newPassword"), errors.newPassword, hint)}
          />
        </Field>
        <Field id={id("confirmPassword")} label="Confirm new password" error={errors.confirmPassword}>
          <PasswordInput
            id={id("confirmPassword")}
            name="confirmPassword"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
            onBlur={() => blur("confirmPassword")}
            {...fieldA11y(id("confirmPassword"), errors.confirmPassword)}
          />
        </Field>
      </fieldset>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-[0.9375rem] font-medium text-on-primary shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_12px_28px_-16px_rgb(0_0_0/0.6)] transition-[background-color,box-shadow] duration-200 hover:bg-(--primary-fill-hover) disabled:cursor-wait disabled:opacity-80"
        >
          {pending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
              Updating…
            </>
          ) : (
            "Update password"
          )}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {pending ? "Updating your password" : ""}
      </p>
    </form>
  );
}
