"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, LoaderCircle, MailCheck } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

type FormState = "idle" | "loading" | "success";

export default function SignUpForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setFormState("loading");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(
        signUpError.message === "User already registered"
          ? "An account with this email already exists. Try signing in instead."
          : signUpError.message,
      );
      setFormState("idle");
      return;
    }

    if (data.session) {
      // Email confirmation disabled — user is signed in immediately.
      router.replace("/");
      router.refresh();
      return;
    }

    setFormState("success");
  }

  if (formState === "success") {
    return (
      <div className="flex flex-col items-center border border-dashed border-hairline bg-paper px-6 py-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <MailCheck className="h-6 w-6" />
        </span>
        <h2 className="mt-4 font-display text-lg font-semibold text-ink">
          Check your inbox
        </h2>
        <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted-ink">
          We sent a confirmation link to{" "}
          <span className="font-semibold text-ink">{email}</span>. Click it to
          activate your account.
        </p>
      </div>
    );
  }

  const isLoading = formState === "loading";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {error && (
        <div
          role="alert"
          className="border border-dashed border-red-800/30 bg-red-900/5 px-4 py-3 text-sm text-red-900"
        >
          <span className="flex items-start gap-2.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </span>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-semibold text-ink"
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-semibold text-ink"
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 6 characters"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="mt-2 w-full">
        {isLoading ? (
          <>
            Creating account
            <LoaderCircle className="h-4 w-4 animate-spin" />
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-center text-sm text-muted-ink">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-accent underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
