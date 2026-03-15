import type { ContentPiece, ContentStatus, PerformanceMetrics } from '../../types/content';
import { ContentCard } from './ContentCard';

interface ContentListProps {
  content: ContentPiece[];
  onStatusChange: (id: string, status: ContentStatus) => void;
  onMetricsChange: (id: string, metrics: PerformanceMetrics) => void;
  onNotesChange: (id: string, notes: string) => void;
  onDelete: (id: string) => void;
}

const STATUS_ORDER: Record<ContentStatus, number> = {
  idea: 0,
  scripted: 1,
  filmed: 2,
  posted: 3,
};

export function ContentList({
  content,
  onStatusChange,
  onMetricsChange,
  onNotesChange,
  onDelete,
}: ContentListProps) {
  const sorted = [...content].sort(
    (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
  );

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <p className="text-[15px] font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
          No content this week
        </p>
        <p className="text-[13px] text-center" style={{ color: 'var(--text-tertiary)' }}>
          Tap + to import content from Claude or add ideas manually.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      {sorted.map((piece) => (
        <ContentCard
          key={piece.id}
          piece={piece}
          onStatusChange={onStatusChange}
          onMetricsChange={onMetricsChange}
          onNotesChange={onNotesChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
