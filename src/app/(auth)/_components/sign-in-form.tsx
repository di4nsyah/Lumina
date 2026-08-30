"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, LoaderCircle } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(
        signInError.message.toLowerCase().includes("invalid")
          ? "Incorrect email or password."
          : signInError.message,
      );
      setIsLoading(false);
      return;
    }

    const next = searchParams.get("next");
    router.replace(next && next.startsWith("/") ? next : "/");
    router.refresh();
  }

  const authErrorFromLink = searchParams.get("error") === "auth";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {(error || authErrorFromLink) && (
        <div
          role="alert"
          className="border border-dashed border-red-800/30 bg-red-900/5 px-4 py-3 text-sm text-red-900"
        >
          <span className="flex items-start gap-2.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {error ??
                "Sign-in link was invalid or expired. Please sign in again."}
            </span>
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
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Your password"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="mt-2 w-full">
        {isLoading ? (
          <>
            Signing in
            <LoaderCircle className="h-4 w-4 animate-spin" />
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <p className="text-center text-sm text-muted-ink">
        New to LuminaBooks?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-accent underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
