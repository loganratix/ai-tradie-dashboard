import type { ContentPiece } from '../../types/content';
import { useAnalytics } from '../../hooks/useAnalytics';
import { OverviewStats } from './OverviewStats';
import {
  FrameworkChart,
  FormatChart,
  HookStyleChart,
  PillarChart,
  TrendChart,
} from './AnalyticsCharts';

interface AnalyticsViewProps {
  postedContent: ContentPiece[];
}

export function AnalyticsView({ postedContent }: AnalyticsViewProps) {
  const { overview, byFramework, byFormat, byHookStyle, byPillar, trend } =
    useAnalytics(postedContent);

  if (postedContent.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <p className="text-[15px] font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
          No analytics yet
        </p>
        <p className="text-[13px] text-center" style={{ color: 'var(--text-tertiary)' }}>
          Mark content as posted and enter performance metrics to see analytics here.
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <OverviewStats overview={overview} />
      <FrameworkChart data={byFramework} />
      <FormatChart data={byFormat} />
      <HookStyleChart data={byHookStyle} />
      <PillarChart data={byPillar} />
      <TrendChart data={trend} />
    </div>
  );
}
