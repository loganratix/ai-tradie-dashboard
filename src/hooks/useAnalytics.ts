import { useMemo } from 'react';
import type {
  ContentPiece,
  FrameworkTag,
  ContentFormat,
  HookStyle,
  ContentPillar,
  PerformanceReport,
} from '../types/content';
import { engagementRate } from '../types/content';

export function useAnalytics(postedContent: ContentPiece[]) {
  return useMemo(() => {
    const withMetrics = postedContent.filter((c) => c.metrics);

    const byFramework = groupByFramework(withMetrics);
    const byFormat = groupByFormat(withMetrics);
    const byHookStyle = groupByHookStyle(withMetrics);
    const byPillar = groupByPillar(withMetrics);
    const topPerformers = getTopPerformers(withMetrics);
    const trend = getTrend(withMetrics);
    const overview = getOverview(withMetrics);

    const report: PerformanceReport = {
      reportDate: new Date().toISOString().split('T')[0],
      totalPosts: withMetrics.length,
      dateRange: {
        from: withMetrics.length
          ? withMetrics.reduce((min, c) =>
              (c.datePosted || '') < min ? c.datePosted || '' : min
            , withMetrics[0].datePosted || '')
          : '',
        to: withMetrics.length
          ? withMetrics.reduce((max, c) =>
              (c.datePosted || '') > max ? c.datePosted || '' : max
            , withMetrics[0].datePosted || '')
          : '',
      },
      byFramework,
      byFormat,
      byHookStyle,
      byPillar,
      topPerformers,
      trend,
    };

    return { report, overview, byFramework, byFormat, byHookStyle, byPillar, topPerformers, trend };
  }, [postedContent]);
}

function getOverview(items: ContentPiece[]) {
  if (items.length === 0)
    return { totalPosts: 0, avgEngagement: 0, bestPerformer: null as ContentPiece | null };

  const rates = items.map((c) => engagementRate(c.metrics!));
  const avgEngagement = rates.reduce((a, b) => a + b, 0) / rates.length;
  const bestIdx = rates.indexOf(Math.max(...rates));

  return {
    totalPosts: items.length,
    avgEngagement: Math.round(avgEngagement * 100) / 100,
    bestPerformer: items[bestIdx],
  };
}

function groupByFramework(items: ContentPiece[]) {
  const map: Partial<Record<FrameworkTag, { count: number; avgEngagement: number; avgSaves: number; avgDMs: number }>> = {};
  const tags: FrameworkTag[] = ['komadina', 'hormozi', 'explorer'];

  for (const tag of tags) {
    const matching = items.filter((c) => c.frameworkTags.includes(tag));
    if (matching.length === 0) continue;
    map[tag] = {
      count: matching.length,
      avgEngagement: avg(matching.map((c) => engagementRate(c.metrics!))),
      avgSaves: avg(matching.map((c) => c.metrics!.saves)),
      avgDMs: avg(matching.map((c) => c.metrics!.dmsReceived)),
    };
  }
  return map;
}

function groupByFormat(items: ContentPiece[]) {
  const map: Partial<Record<ContentFormat, { count: number; avgEngagement: number; avgSaves: number }>> = {};
  const formats: ContentFormat[] = ['reel', 'carousel', 'post', 'story'];

  for (const f of formats) {
    const matching = items.filter((c) => c.format === f);
    if (matching.length === 0) continue;
    map[f] = {
      count: matching.length,
      avgEngagement: avg(matching.map((c) => engagementRate(c.metrics!))),
      avgSaves: avg(matching.map((c) => c.metrics!.saves)),
    };
  }
  return map;
}

function groupByHookStyle(items: ContentPiece[]) {
  const map: Partial<Record<HookStyle, { count: number; avgEngagement: number; avgSaves: number }>> = {};
  const styles: HookStyle[] = [
    'test-result', 'discovery', 'challenge', 'myth-bust',
    'curiosity-gap', 'pattern-reveal', 'honest-negative',
  ];

  for (const s of styles) {
    const matching = items.filter((c) => c.hookStyle === s);
    if (matching.length === 0) continue;
    map[s] = {
      count: matching.length,
      avgEngagement: avg(matching.map((c) => engagementRate(c.metrics!))),
      avgSaves: avg(matching.map((c) => c.metrics!.saves)),
    };
  }
  return map;
}

function groupByPillar(items: ContentPiece[]) {
  const map: Partial<Record<ContentPillar, { count: number; totalDMs: number; avgEngagement: number }>> = {};
  const pillars: ContentPillar[] = ['ai-tools', 'systems', 'bts', 'proof', 'hot-takes'];

  for (const p of pillars) {
    const matching = items.filter((c) => c.pillar === p);
    if (matching.length === 0) continue;
    map[p] = {
      count: matching.length,
      totalDMs: matching.reduce((sum, c) => sum + (c.metrics?.dmsReceived || 0), 0),
      avgEngagement: avg(matching.map((c) => engagementRate(c.metrics!))),
    };
  }
  return map;
}

function getTopPerformers(items: ContentPiece[]) {
  return [...items]
    .sort((a, b) => engagementRate(b.metrics!) - engagementRate(a.metrics!))
    .slice(0, 5)
    .map((c) => ({
      title: c.title,
      hook: c.hook,
      format: c.format,
      frameworkTags: c.frameworkTags,
      engagementRate: Math.round(engagementRate(c.metrics!) * 100) / 100,
      metrics: c.metrics!,
    }));
}

function getTrend(items: ContentPiece[]) {
  const weekMap = new Map<string, { rates: number[]; count: number }>();
  for (const c of items) {
    const existing = weekMap.get(c.weekId) || { rates: [], count: 0 };
    existing.rates.push(engagementRate(c.metrics!));
    existing.count++;
    weekMap.set(c.weekId, existing);
  }

  return [...weekMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([weekId, data]) => ({
      weekId,
      avgEngagement: Math.round(avg(data.rates) * 100) / 100,
      totalPosts: data.count,
    }));
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
