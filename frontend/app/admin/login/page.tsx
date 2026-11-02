import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LogoFull } from "@/components/brand/logo";
import { LoginForm } from "@/components/admin/login-form";
import { Alert } from "@/components/admin/ui";
import { safeAdminPath } from "@/lib/admin";
import { isAdminConfigured } from "@/lib/server/admin-api";
import { getAdminSession } from "@/lib/server/admin-session";

export const metadata: Metadata = { title: "Sign in" };

const notices = {
  expired: { tone: "info", text: "Your session has expired. Please sign in again." },
  "signed-out": { tone: "success", text: "You've been signed out." },
} as const;

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const params = await searchParams;
  const next = safeAdminPath(params.next);

  // Already signed in → straight to the dashboard.
  const session = await getAdminSession();
  if (session.status === "ok") redirect(next);

  const reason = typeof params.reason === "string" ? params.reason : "";
  const notice = reason in notices ? notices[reason as keyof typeof notices] : null;

  return (
    <section className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" aria-label="Back to website" className="mx-auto block w-fit rounded-lg">
          <LogoFull className="w-48" />
        </Link>
        <div className="surface-card mt-8 rounded-3xl p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text">Admin sign in</h1>
          <p className="mt-1.5 text-sm text-text-muted">Sign in to view enquiries and manage your account.</p>
          <div className="mt-6 flex flex-col gap-5">
            {!isAdminConfigured() ? (
              <Alert tone="error">
                The admin dashboard isn&apos;t connected to the backend. Set <code>BACKEND_API_URL</code> and{" "}
                <code>BACKEND_API_KEY</code> in <code>.env.local</code>.
              </Alert>
            ) : notice ? (
              <Alert tone={notice.tone}>{notice.text}</Alert>
            ) : null}
            <LoginForm next={next === "/admin" ? undefined : next} />
          </div>
        </div>
        <p className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text">
            <ArrowLeft className="size-3.5" aria-hidden /> Back to website
          </Link>
        </p>
      </div>
    </section>
  );
}
