import type { ContentStatus } from '../../types/content';
import { STATUS_LABELS } from '../../types/content';

const STATUS_STYLES: Record<ContentStatus, { color: string; bg: string; border: string }> = {
  idea: { color: '#999', bg: '#66666620', border: '#66666640' },
  scripted: { color: '#fbbf24', bg: '#fbbf2420', border: '#fbbf2440' },
  filmed: { color: '#60a5fa', bg: '#2563eb20', border: '#2563eb40' },
  posted: { color: '#86efac', bg: '#22c55e20', border: '#22c55e40' },
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      style={{
        fontSize: '10px',
        padding: '3px 8px',
        borderRadius: '4px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
