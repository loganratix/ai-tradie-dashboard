import { useState, useEffect } from 'react';
import type { PerformanceMetrics } from '../../types/content';

interface MetricsFormProps {
  metrics: PerformanceMetrics | null;
  onSave: (metrics: PerformanceMetrics) => void;
}

const FIELDS: { key: keyof PerformanceMetrics; label: string }[] = [
  { key: 'views', label: 'Views' },
  { key: 'likes', label: 'Likes' },
  { key: 'saves', label: 'Saves' },
  { key: 'shares', label: 'Shares' },
  { key: 'comments', label: 'Comments' },
  { key: 'dmsReceived', label: 'DMs' },
];

const EMPTY: PerformanceMetrics = {
  views: 0,
  likes: 0,
  saves: 0,
  shares: 0,
  comments: 0,
  dmsReceived: 0,
};

export function MetricsForm({ metrics, onSave }: MetricsFormProps) {
  const [values, setValues] = useState<PerformanceMetrics>(metrics || EMPTY);

  useEffect(() => {
    if (metrics) setValues(metrics);
  }, [metrics]);

  const handleChange = (key: keyof PerformanceMetrics, val: string) => {
    const num = parseInt(val) || 0;
    const updated = { ...values, [key]: num };
    setValues(updated);
    onSave(updated);
  };

  return (
    <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
      <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--status-posted)' }}>
        Performance
      </p>
      <div className="grid grid-cols-3 gap-2">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="text-[10px] block mb-1" style={{ color: 'var(--text-tertiary)' }}>
              {f.label}
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={values[f.key] || ''}
              onChange={(e) => handleChange(f.key, e.target.value)}
              placeholder="0"
              className="w-full px-2 py-2 rounded-lg text-sm text-white outline-none"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
