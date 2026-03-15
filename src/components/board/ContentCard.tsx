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
  index: number;
  onStatusChange: (id: string, status: ContentStatus) => void;
  onMetricsChange: (id: string, metrics: PerformanceMetrics) => void;
  onNotesChange: (id: string, notes: string) => void;
  onDelete: (id: string) => void;
}

const FW_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  komadina: { color: '#a5b4fc', bg: '#1a1a2e', border: '#6366f140' },
  hormozi: { color: '#fca5a5', bg: '#1a1a1a', border: '#ef444440' },
  explorer: { color: '#86efac', bg: '#0a1a0a', border: '#22c55e40' },
};

const FMT_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  reel: { color: '#a78bfa', bg: '#7c3aed20', border: '#7c3aed40' },
  carousel: { color: '#93c5fd', bg: '#2563eb20', border: '#2563eb40' },
  post: { color: '#6ee7b7', bg: '#05966920', border: '#05966940' },
  story: { color: '#fcd34d', bg: '#f59e0b20', border: '#f59e0b40' },
};

export function ContentCard({
  piece,
  index,
  onStatusChange,
  onMetricsChange,
  onNotesChange,
  onDelete,
}: ContentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const nextStatus = STATUS_NEXT[piece.status];
  const fmt = FMT_COLORS[piece.format] || FMT_COLORS.reel;

  return (
    <div
      className="content-card relative"
      style={{
        background: '#111',
        border: '1px solid #222',
        borderRadius: '16px',
        padding: '20px',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#444')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#222')}
    >
      {/* Card number */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: '#1a1a1a',
          border: '1px solid #333',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 700,
          color: '#666',
        }}
      >
        {index + 1}
      </div>

      {/* Tags row */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap', paddingRight: '36px' }}>
        <StatusBadge status={piece.status} />
        <span
          style={{
            fontSize: '10px',
            padding: '3px 8px',
            borderRadius: '4px',
            fontWeight: 600,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.5px',
            color: fmt.color,
            background: fmt.bg,
            border: `1px solid ${fmt.border}`,
          }}
        >
          {FORMAT_LABELS[piece.format]}
        </span>
        {piece.frameworkTags.map((tag) => {
          const fw = FW_COLORS[tag] || FW_COLORS.komadina;
          return (
            <span
              key={tag}
              style={{
                fontSize: '10px',
                padding: '3px 8px',
                borderRadius: '4px',
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.5px',
                color: fw.color,
                background: fw.bg,
                border: `1px solid ${fw.border}`,
              }}
            >
              {FRAMEWORK_LABELS[tag]}
            </span>
          );
        })}
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '17px',
          fontWeight: 700,
          color: '#fff',
          marginBottom: '8px',
          lineHeight: 1.3,
          paddingRight: '36px',
        }}
      >
        {piece.title}
      </h3>

      {/* Hook */}
      <div
        style={{
          fontSize: '14px',
          color: '#fbbf24',
          marginBottom: '10px',
          fontStyle: 'italic',
          lineHeight: 1.5,
          padding: '10px 14px',
          background: 'rgba(251, 191, 36, 0.03)',
          borderLeft: '2px solid rgba(251, 191, 36, 0.25)',
          borderRadius: '0 6px 6px 0',
        }}
      >
        {piece.hook}
      </div>

      {/* Pillar */}
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
        {PILLAR_LABELS[piece.pillar]}
      </p>

      {/* Posted metrics summary */}
      {piece.status === 'posted' && piece.metrics && piece.metrics.views > 0 && (
        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          <span>{piece.metrics.views.toLocaleString()} views</span>
          <span>{engagementRate(piece.metrics).toFixed(1)}% eng</span>
          <span>{piece.metrics.saves} saves</span>
          <span>{piece.metrics.dmsReceived} DMs</span>
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          fontWeight: 500,
          color: '#666',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 0',
        }}
      >
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {expanded ? 'Less' : 'More'}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ marginTop: '12px' }}>
          {piece.body && (
            <div style={{ marginBottom: '14px' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#666', marginBottom: '6px' }}>
                Script / Body
              </p>
              <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#999', whiteSpace: 'pre-wrap' }}>
                {piece.body}
              </p>
            </div>
          )}

          {piece.filmingNotes && (
            <div style={{ marginBottom: '14px', paddingTop: '12px', borderTop: '1px solid #1a1a1a' }}>
              <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#666', marginBottom: '6px' }}>
                Filming Notes
              </p>
              <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#999', whiteSpace: 'pre-wrap' }}>
                {piece.filmingNotes}
              </p>
            </div>
          )}

          {/* Notes input */}
          <div style={{ marginBottom: '14px', paddingTop: '12px', borderTop: '1px solid #1a1a1a' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#666', marginBottom: '6px' }}>
              Your Notes
            </p>
            <textarea
              value={piece.notes}
              onChange={(e) => onNotesChange(piece.id, e.target.value)}
              placeholder="Add observations, ideas, what worked..."
              rows={2}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#e5e5e5',
                background: '#0a0a0a',
                border: '1px solid #222',
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit',
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
          <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
            {nextStatus && (
              <button
                onClick={() => onStatusChange(piece.id, nextStatus)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#fff',
                  background: '#2563EB',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Mark as {STATUS_LABELS[nextStatus]}
              </button>
            )}
            <button
              onClick={() => {
                if (confirm('Delete this content piece?')) onDelete(piece.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: '#0a0a0a',
                border: '1px solid #222',
                cursor: 'pointer',
              }}
            >
              <Trash2 size={16} color="#ef4444" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
