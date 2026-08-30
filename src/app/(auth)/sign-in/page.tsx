import { Suspense } from "react";
import AuthCard from "../_components/auth-card";
import SignInForm from "../_components/sign-in-form";

export const metadata = {
  title: "Sign in — LuminaBooks",
};

export default function SignInPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to keep building your collection."
    >
      <Suspense>
        <SignInForm />
      </Suspense>
    </AuthCard>
  );
}
