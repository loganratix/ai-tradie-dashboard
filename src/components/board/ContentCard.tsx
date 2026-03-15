import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import type { ContentPiece, ContentStatus, PerformanceMetrics } from '../../types/content';
import {
  STATUS_NEXT,
  STATUS_LABELS,
  FORMAT_LABELS,
  FRAMEWORK_LABELS,
  PILLAR_LABELS,
  engagementRate,
} from '../../types/content';
import { StatusBadge } from './StatusBadge';
import { MetricsForm } from './MetricsForm';

interface ContentCardProps {
  piece: ContentPiece;
  onStatusChange: (id: string, status: ContentStatus) => void;
  onMetricsChange: (id: string, metrics: PerformanceMetrics) => void;
  onNotesChange: (id: string, notes: string) => void;
  onDelete: (id: string) => void;
}

const FW_COLORS: Record<string, string> = {
  komadina: 'var(--fw-komadina)',
  hormozi: 'var(--fw-hormozi)',
  explorer: 'var(--fw-explorer)',
};

const FMT_COLORS: Record<string, string> = {
  reel: 'var(--fmt-reel)',
  carousel: 'var(--fmt-carousel)',
  post: 'var(--fmt-post)',
  story: 'var(--fmt-story)',
};

export function ContentCard({
  piece,
  onStatusChange,
  onMetricsChange,
  onNotesChange,
  onDelete,
}: ContentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const nextStatus = STATUS_NEXT[piece.status];

  return (
    <div
      className="rounded-2xl p-4 transition-colors"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Top row: status + format + framework tags */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        <StatusBadge status={piece.status} />
        <span
          className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
          style={{
            color: FMT_COLORS[piece.format],
            background: `${FMT_COLORS[piece.format]}20`,
            border: `1px solid ${FMT_COLORS[piece.format]}40`,
          }}
        >
          {FORMAT_LABELS[piece.format]}
        </span>
        {piece.frameworkTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
            style={{
              color: FW_COLORS[tag],
              background: `${FW_COLORS[tag]}20`,
              border: `1px solid ${FW_COLORS[tag]}40`,
            }}
          >
            {FRAMEWORK_LABELS[tag]}
          </span>
        ))}
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-bold leading-snug mb-1.5">{piece.title}</h3>

      {/* Hook preview */}
      <p
        className="text-[13px] italic leading-relaxed rounded-lg px-3 py-2 mb-2"
        style={{
          color: 'var(--hook)',
          background: 'rgba(251, 191, 36, 0.05)',
          borderLeft: '2px solid rgba(251, 191, 36, 0.3)',
        }}
      >
        {piece.hook}
      </p>

      {/* Pillar label */}
      <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
        {PILLAR_LABELS[piece.pillar]}
      </p>

      {/* Posted metrics summary */}
      {piece.status === 'posted' && piece.metrics && piece.metrics.views > 0 && (
        <div className="flex gap-3 text-[11px] mb-2" style={{ color: 'var(--text-secondary)' }}>
          <span>{piece.metrics.views.toLocaleString()} views</span>
          <span>{engagementRate(piece.metrics).toFixed(1)}% eng</span>
          <span>{piece.metrics.saves} saves</span>
          <span>{piece.metrics.dmsReceived} DMs</span>
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-[12px] font-medium"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {expanded ? 'Less' : 'More'}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-3">
          {piece.body && (
            <div className="mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>
                Script / Body
              </p>
              <p className="text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
                {piece.body}
              </p>
            </div>
          )}

          {piece.filmingNotes && (
            <div className="mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>
                Filming Notes
              </p>
              <p className="text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
                {piece.filmingNotes}
              </p>
            </div>
          )}

          {/* Notes input */}
          <div className="mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>
              Your Notes
            </p>
            <textarea
              value={piece.notes}
              onChange={(e) => onNotesChange(piece.id, e.target.value)}
              placeholder="Add observations, ideas, what worked..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg text-[13px] text-white outline-none resize-none"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
              }}
            />
          </div>

          {/* Metrics form for posted content */}
          {piece.status === 'posted' && (
            <MetricsForm
              metrics={piece.metrics}
              onSave={(m) => onMetricsChange(piece.id, m)}
            />
          )}

          {/* Action buttons */}
          <div className="flex gap-2 mt-3">
            {nextStatus && (
              <button
                onClick={() => onStatusChange(piece.id, nextStatus)}
                className="flex-1 py-2.5 rounded-lg text-[13px] font-semibold text-white"
                style={{ background: 'var(--accent)' }}
              >
                Mark as {STATUS_LABELS[nextStatus]}
              </button>
            )}
            <button
              onClick={() => {
                if (confirm('Delete this content piece?')) onDelete(piece.id);
              }}
              className="flex items-center justify-center w-10 h-10 rounded-lg"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
            >
              <Trash2 size={16} style={{ color: 'var(--fw-hormozi)' }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
