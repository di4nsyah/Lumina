import Link from "next/link";

export default function Wordmark({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="font-display text-xl leading-none text-ink rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      Lumina{" "}
      <span className="font-light italic text-muted-ink">Books</span>
    </Link>
  );
}
