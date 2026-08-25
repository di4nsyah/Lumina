import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <LegalPage title="Say hello">
      <p>
        Questions, bug reports, book recommendations you swear by — all welcome.
      </p>
      <p>
        The fastest way to reach us is email:{" "}
        <a href="mailto:hello@luminabooks.example">hello@luminabooks.example</a>
        . Data-deletion requests go to the same address (see{" "}
        <a href="/privacy">privacy</a>).
      </p>
      <p className="text-muted-ink">
        We reply like a small shop: when the kettle has boiled.
      </p>
    </LegalPage>
  );
}
