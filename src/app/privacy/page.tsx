import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy">
      <p>
        LuminaBooks is a small, personal book-discovery app. This page explains
        plainly what we store and why.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Your email address — only so you can sign in.</li>
        <li>The books you save to your library and the ratings you give.</li>
        <li>The genres you pick during onboarding, to tune recommendations.</li>
      </ul>

      <h2>What we don&apos;t do</h2>
      <ul>
        <li>We don&apos;t sell or share your data with anyone.</li>
        <li>We don&apos;t run advertising or tracking scripts.</li>
        <li>We don&apos;t send marketing emails.</li>
      </ul>

      <h2>Third parties</h2>
      <p>
        Accounts and data are stored with Supabase; book information and covers
        come from the Google Books API. Book searches are sent to Google&apos;s
        public books API to fetch results.
      </p>

      <h2>Deleting your data</h2>
      <p>
        Want your account removed? Write to us via the{" "}
        <a href="/contact">contact page</a> and it will be deleted by hand.
      </p>
    </LegalPage>
  );
}
