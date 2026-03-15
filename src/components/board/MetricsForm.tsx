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
    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #1a1a1a' }}>
      <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#22c55e', marginBottom: '8px' }}>
        Performance
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label style={{ fontSize: '10px', display: 'block', marginBottom: '4px', color: '#666' }}>
              {f.label}
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={values[f.key] || ''}
              onChange={(e) => handleChange(f.key, e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#e5e5e5',
                background: '#0a0a0a',
                border: '1px solid #222',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
