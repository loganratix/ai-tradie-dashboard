import { useState, useEffect } from 'react';
import type { PerformanceMetrics } from '../../types/content';
import { engagementRate, avgWatchTime, watchThroughRate, formatSeconds } from '../../types/content';

interface MetricsFormProps {
  metrics: PerformanceMetrics | null;
  durationSeconds: number;
  onSave: (metrics: PerformanceMetrics) => void;
}

const CORE_FIELDS: { key: keyof PerformanceMetrics; label: string }[] = [
  { key: 'views', label: 'Views' },
  { key: 'likes', label: 'Likes' },
  { key: 'saves', label: 'Saves' },
  { key: 'shares', label: 'Shares' },
  { key: 'comments', label: 'Comments' },
  { key: 'dmsReceived', label: 'DMs' },
  { key: 'profileVisits', label: 'Profile Visits' },
];

const EMPTY: PerformanceMetrics = {
  views: 0,
  likes: 0,
  saves: 0,
  shares: 0,
  comments: 0,
  dmsReceived: 0,
  watchTimeSeconds: 0,
  profileVisits: 0,
};

export function MetricsForm({ metrics, durationSeconds, onSave }: MetricsFormProps) {
  const [values, setValues] = useState<PerformanceMetrics>(metrics || EMPTY);
  const [watchMins, setWatchMins] = useState(0);
  const [watchSecs, setWatchSecs] = useState(0);

  useEffect(() => {
    if (metrics) {
      setValues(metrics);
      const totalSecs = metrics.watchTimeSeconds || 0;
      setWatchMins(Math.floor(totalSecs / 60));
      setWatchSecs(totalSecs % 60);
    }
  }, [metrics]);

  const handleChange = (key: keyof PerformanceMetrics, val: string) => {
    const num = parseInt(val) || 0;
    const updated = { ...values, [key]: num };
    setValues(updated);
    onSave(updated);
  };

  const handleWatchTime = (mins: number, secs: number) => {
    setWatchMins(mins);
    setWatchSecs(secs);
    const totalSeconds = mins * 60 + secs;
    const updated = { ...values, watchTimeSeconds: totalSeconds };
    setValues(updated);
    onSave(updated);
  };

  const hasData = values.views > 0;
  const eng = hasData ? engagementRate(values) : 0;
  const avgWatch = hasData ? avgWatchTime(values) : 0;
  const watchThrough = hasData && durationSeconds > 0 ? watchThroughRate(values, durationSeconds) : 0;

  return (
    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #1a1a1a' }}>
      <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#22c55e', marginBottom: '8px' }}>
        Performance
      </p>

      {/* Core metrics grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {CORE_FIELDS.map((f) => (
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
                boxSizing: 'border-box',
              }}
            />
          </div>
        ))}
      </div>

      {/* Watch time (minutes + seconds) */}
      <div style={{ marginTop: '10px' }}>
        <label style={{ fontSize: '10px', display: 'block', marginBottom: '4px', color: '#666' }}>
          Total Watch Time
        </label>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <input
            type="number"
            inputMode="numeric"
            value={watchMins || ''}
            onChange={(e) => handleWatchTime(parseInt(e.target.value) || 0, watchSecs)}
            placeholder="0"
            style={{
              width: '70px',
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
          <span style={{ fontSize: '12px', color: '#666' }}>min</span>
          <input
            type="number"
            inputMode="numeric"
            value={watchSecs || ''}
            onChange={(e) => handleWatchTime(watchMins, parseInt(e.target.value) || 0)}
            placeholder="0"
            style={{
              width: '70px',
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
          <span style={{ fontSize: '12px', color: '#666' }}>sec</span>
        </div>
      </div>

      {/* Computed stats */}
      {hasData && (
        <div
          style={{
            marginTop: '14px',
            padding: '12px',
            background: '#0a0a0a',
            border: '1px solid #222',
            borderRadius: '10px',
          }}
        >
          <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#a78bfa', marginBottom: '10px' }}>
            Computed Stats
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div>
              <p style={{ fontSize: '10px', color: '#666', marginBottom: '2px' }}>Engagement</p>
              <p style={{
                fontSize: '16px',
                fontWeight: 700,
                color: eng >= 3 ? '#22c55e' : eng >= 1 ? '#fbbf24' : '#ef4444',
              }}>
                {eng.toFixed(1)}%
              </p>
            </div>
            {values.watchTimeSeconds > 0 && (
              <>
                <div>
                  <p style={{ fontSize: '10px', color: '#666', marginBottom: '2px' }}>Avg Watch</p>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#e5e5e5' }}>
                    {formatSeconds(avgWatch)}
                  </p>
                </div>
                {durationSeconds > 0 && (
                  <div>
                    <p style={{ fontSize: '10px', color: '#666', marginBottom: '2px' }}>Watch-Through</p>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: watchThrough >= 50 ? '#22c55e' : watchThrough >= 30 ? '#fbbf24' : '#ef4444',
                    }}>
                      {watchThrough.toFixed(0)}%
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          {/* Quick interpretation */}
          <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #1a1a1a' }}>
            {values.watchTimeSeconds > 0 && durationSeconds > 0 && (
              <p style={{ fontSize: '11px', color: '#888', lineHeight: 1.5 }}>
                {watchThrough >= 50
                  ? '🔥 Strong retention. People are watching most of the video.'
                  : watchThrough >= 30
                    ? '⚡ Decent retention. Hook is working, body could be tighter.'
                    : '🎯 Low retention. Hook needs to hit harder in the first 3 seconds.'}
              </p>
            )}
            {eng > 0 && (
              <p style={{ fontSize: '11px', color: '#888', lineHeight: 1.5, marginTop: '4px' }}>
                {eng >= 5
                  ? '🔥 Excellent engagement. This content resonates.'
                  : eng >= 2
                    ? '⚡ Solid engagement. Room to grow with stronger CTAs.'
                    : values.saves > 0
                      ? '💾 Low engagement but has saves. People find it useful, just not engaging enough to like/comment.'
                      : '🎯 Low engagement. Test a different hook or add a question CTA.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
