import { Bookmark } from "lucide-react";

type ShareButtonProps = {
  title: string;
  author: string;
  url?: string;
  className?: string;
};

export default function ShareButton({
  title,
  author,
  url,
  className,
}: ShareButtonProps) {
  const handleShare = () => {
    const shareUrl = url || window.location.href;
    const text = `${title} by ${author} — via Lumina Books`;

    if (navigator.share) {
      navigator.share({ title, text, url: shareUrl }).catch(() => fallbackShare());
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    const copyUrl = window.prompt(
      `Copy link to "${title}"?`,
      window.location.href
    );

    if (copyUrl) {
      navigator.clipboard.writeText(copyUrl).then(() => {
        // Silently copy
      });
    }
  };

  return (
    <button
      onClick={handleShare}
      title={ `${title} by ${author}` }
      className={`inline-flex items-center gap-2 rounded-md border border-hairline bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${className ?? ""}`}
      aria-label="Share this book"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 4.01L20.5 7.5l5.5 3.01L2 6.25l-1.25 7.5L16 4.01zM5.29 17.08l1.55-2.24L5.57 5.64l-1.98 1.46L5.29 17.08zm1.55-10.56l1.99 2.24L8.61 8.3l-1.75-1.37L5.29 6.46zm3.67 5.55l-1.5 1.06L10.18 12.05l1.88-1.18L8.96 13.61zm4.55-4.93l-1.53 1.04L13.85 8.18l1.77-1.15L13.42 9.66zm3.08 3.87l-1.27.91L17.08 14.68l1.08-.78L16.3 13.06zM12 13.5l-1.5 2.06l-1.5-2.06l.01.01L12 13.5zM1.5 5.58l1.55 2.25l3.01.85L3.45 10.42l1.99.58l-.01.01L1.5 5.58zm13.08.42l1.27-.91L20.92 11.32l-1.08.78L19.6 11.94z" />
      </svg>
      Share
    </button>
  );
}