import type { ContentStatus } from '../../types/content';
import { STATUS_LABELS } from '../../types/content';

const STATUS_COLORS: Record<ContentStatus, string> = {
  idea: 'var(--status-idea)',
  scripted: 'var(--status-scripted)',
  filmed: 'var(--status-filmed)',
  posted: 'var(--status-posted)',
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  const color = STATUS_COLORS[status];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
      style={{
        color,
        background: `${color}20`,
        border: `1px solid ${color}40`,
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
