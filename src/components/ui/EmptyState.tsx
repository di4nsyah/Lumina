type EmptyStateProps = {
  title: string;
  body: string;
  action?: React.ReactNode;
};

export default function EmptyState({ title, body, action }: EmptyStateProps) {
  return (
    <div className="relative flex flex-col items-center justify-center border border-dashed border-hairline bg-surface px-6 py-20 text-center">
      {/* ticket notches */}
      <span
        aria-hidden="true"
        className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-paper"
      />
      <span
        aria-hidden="true"
        className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-paper"
      />

      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-ink">
        {body}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
