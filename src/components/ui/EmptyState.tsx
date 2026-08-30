type EmptyStateProps = {
  title: string;
  body: string;
  action?: React.ReactNode;
};

export default function EmptyState({ title, body, action }: EmptyStateProps) {
  return (
    <div className="relative mx-auto max-w-xl border border-hairline bg-surface p-8 sm:p-10 paper-card">
      {/* Ticket/Index Card perforations & header stripe */}
      <div className="border-b border-dashed border-hairline pb-4 mb-6 flex items-center justify-between text-[11px] font-display uppercase tracking-widest text-muted-ink/60">
        <span>LUMINA INDEX CARD</span>
        <span>NO. 1924-A</span>
      </div>

      {/* Ticket notches */}
      <span
        aria-hidden="true"
        className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-r border-hairline bg-paper"
      />
      <span
        aria-hidden="true"
        className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-l border-hairline bg-paper"
      />

      <div className="text-center">
        <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-ink">{body}</p>
        {action && <div className="mt-6 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}
