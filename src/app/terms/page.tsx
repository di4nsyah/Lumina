import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use">
      <p>
        Short version: be kind, this is a personal project, and the service is
        offered as-is.
      </p>

      <h2>The service</h2>
      <p>
        LuminaBooks helps you discover books, keep a personal collection, and
        get simple genre-based recommendations. It is provided free, without
        warranty of any kind.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>Keep your credentials to yourself.</li>
        <li>Don&apos;t use the service for spam or abuse.</li>
        <li>We may suspend accounts that break the service for everyone else.</li>
      </ul>

      <h2>Content</h2>
      <p>
        Book metadata and cover images come from the Google Books API and
        belong to their respective owners. Ratings you submit are visible as
        anonymous averages to other readers.
      </p>

      <h2>Changes</h2>
      <p>
        If these terms change meaningfully, we&apos;ll note it on this page.
        Continued use means you accept the current version.
      </p>
    </LegalPage>
  );
}
