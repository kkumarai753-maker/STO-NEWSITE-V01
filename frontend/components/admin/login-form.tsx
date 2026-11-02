"use client";

/**
 * Admin sign-in form. Why client: instant validation and pending/error states.
 * The Server Action re-validates, rate-limits and sets the session cookie.
 */
import { useActionState, useId, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { login, type LoginState } from "@/app/actions/admin";
import { fieldErrorsOf, loginSchema, type LoginField } from "@/lib/validation/admin";
import { Alert } from "./ui";
import { Field, PasswordInput, fieldA11y } from "./form-fields";

const INITIAL: LoginState = { status: "idle" };

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(login, INITIAL);
  const [errors, setErrors] = useState<Partial<Record<LoginField, string>>>({});
  const [prevState, setPrevState] = useState(state);
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;

  if (state !== prevState) {
    setPrevState(state);
    setErrors(state.fieldErrors ?? {});
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const data = new FormData(event.currentTarget);
    const result = loginSchema.safeParse({
      email: String(data.get("email") ?? "").trim(),
      password: String(data.get("password") ?? ""),
    });
    if (!result.success) {
      event.preventDefault();
      const fieldErrors = fieldErrorsOf<LoginField>(result.error.issues);
      setErrors(fieldErrors);
      const first = (["email", "password"] as const).find((f) => fieldErrors[f]);
      if (first) document.getElementById(id(first))?.focus();
    }
  };

  const banner = state.status === "error" && state.message && !pending ? state.message : null;

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate aria-busy={pending} className="flex flex-col gap-5">
      {banner ? <Alert tone="error">{banner}</Alert> : null}
      <input type="hidden" name="next" value={next ?? ""} />

      <fieldset disabled={pending} className="flex flex-col gap-5">
        <legend className="sr-only">Sign in to the admin dashboard</legend>
        <Field id={id("email")} label="Email" error={errors.email}>
          <input
            id={id("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="username"
            placeholder="you@company.com"
            defaultValue={state.email ?? ""}
            onChange={() => errors.email && setErrors((e) => ({ ...e, email: undefined }))}
            {...fieldA11y(id("email"), errors.email)}
            className="field-control"
          />
        </Field>
        <Field id={id("password")} label="Password" error={errors.password}>
          <PasswordInput
            id={id("password")}
            name="password"
            autoComplete="current-password"
            onChange={() => errors.password && setErrors((e) => ({ ...e, password: undefined }))}
            {...fieldA11y(id("password"), errors.password)}
          />
        </Field>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="group/button mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-[0.9375rem] font-medium text-on-primary shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_12px_28px_-16px_rgb(0_0_0/0.6)] transition-[background-color,box-shadow] duration-200 hover:bg-(--primary-fill-hover) disabled:cursor-wait disabled:opacity-80"
      >
        {pending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden />
            Signing in…
          </>
        ) : (
          <>
            Sign in
            <ArrowRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-0.5" aria-hidden />
          </>
        )}
      </button>
      <p className="sr-only" aria-live="polite">
        {pending ? "Signing in" : ""}
      </p>
    </form>
  );
}
