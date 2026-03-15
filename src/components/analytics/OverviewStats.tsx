import type { ContentPiece } from '../../types/content';
import { engagementRate } from '../../types/content';

interface OverviewStatsProps {
  overview: {
    totalPosts: number;
    avgEngagement: number;
    bestPerformer: ContentPiece | null;
  };
}

export function OverviewStats({ overview }: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 px-4 mb-4">
      <StatCard label="Posts Tracked" value={String(overview.totalPosts)} />
      <StatCard label="Avg Engagement" value={`${overview.avgEngagement}%`} />
      <StatCard
        label="Best Post"
        value={
          overview.bestPerformer
            ? `${engagementRate(overview.bestPerformer.metrics!).toFixed(1)}%`
            : '-'
        }
        subtitle={overview.bestPerformer?.title.slice(0, 20)}
      />
    </div>
  );
}

function StatCard({ label, value, subtitle }: { label: string; value: string; subtitle?: string }) {
  return (
    <div
      className="rounded-xl p-3 text-center"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </p>
      <p className="text-lg font-bold">{value}</p>
      {subtitle && (
        <p className="text-[10px] truncate mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
