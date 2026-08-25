import AuthCard from "../_components/auth-card";
import SignUpForm from "../_components/sign-up-form";

export const metadata = {
  title: "Create account — LuminaBooks",
};

export default function SignUpPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Save books, rate them, and get recommendations tuned to your taste."
    >
      <SignUpForm />
    </AuthCard>
  );
}
