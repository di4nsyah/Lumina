import Wordmark from "@/components/ui/Wordmark";
import Botanical from "@/components/decor/Botanical";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-paper px-4 py-12 text-ink antialiased">
      <Botanical
        variant="sprig"
        className="absolute -left-4 bottom-0 h-56 w-40 rotate-6"
      />
      <Botanical
        variant="branch"
        className="absolute -right-6 top-0 h-48 w-36 -rotate-12"
      />

      <div className="relative z-10 mb-8">
        <Wordmark />
      </div>

      <main className="relative z-10 w-full max-w-md">{children}</main>
    </div>
  );
}
