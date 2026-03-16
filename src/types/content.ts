export type ContentFormat = 'reel' | 'carousel' | 'post' | 'story';
export type ContentStatus = 'idea' | 'scripted' | 'filmed' | 'posted';
export type ContentPillar = 'ai-tools' | 'systems' | 'bts' | 'proof' | 'hot-takes';
export type FrameworkTag = 'komadina' | 'hormozi' | 'explorer';
export type HookStyle =
  | 'test-result'
  | 'discovery'
  | 'challenge'
  | 'myth-bust'
  | 'curiosity-gap'
  | 'pattern-reveal'
  | 'honest-negative';

export interface PerformanceMetrics {
  views: number;
  likes: number;
  saves: number;
  shares: number;
  comments: number;
  dmsReceived: number;
  watchTimeSeconds: number;
  profileVisits: number;
}

export interface ContentPiece {
  id: string;
  title: string;
  hook: string;
  body: string;
  caption: string;
  filmingNotes: string;
  format: ContentFormat;
  pillar: ContentPillar;
  hookStyle: HookStyle;
  frameworkTags: FrameworkTag[];
  status: ContentStatus;
  weekId: string;
  datePosted: string | null;
  metrics: PerformanceMetrics | null;
  durationSeconds: number;
  notes: string;
}

export interface DashboardState {
  content: ContentPiece[];
  activeWeek: string;
  version: number;
}

export interface PerformanceReport {
  reportDate: string;
  totalPosts: number;
  dateRange: { from: string; to: string };
  byFramework: Partial<
    Record<
      FrameworkTag,
      { count: number; avgEngagement: number; avgSaves: number; avgDMs: number }
    >
  >;
  byFormat: Partial<
    Record<
      ContentFormat,
      { count: number; avgEngagement: number; avgSaves: number }
    >
  >;
  byHookStyle: Partial<
    Record<
      HookStyle,
      { count: number; avgEngagement: number; avgSaves: number }
    >
  >;
  byPillar: Partial<
    Record<
      ContentPillar,
      { count: number; totalDMs: number; avgEngagement: number }
    >
  >;
  topPerformers: Array<{
    title: string;
    hook: string;
    format: ContentFormat;
    frameworkTags: FrameworkTag[];
    engagementRate: number;
    metrics: PerformanceMetrics;
  }>;
  trend: Array<{
    weekId: string;
    avgEngagement: number;
    totalPosts: number;
  }>;
}

// Display helpers
export const STATUS_LABELS: Record<ContentStatus, string> = {
  idea: 'Idea',
  scripted: 'Scripted',
  filmed: 'Filmed',
  posted: 'Posted',
};

export const STATUS_NEXT: Record<ContentStatus, ContentStatus | null> = {
  idea: 'scripted',
  scripted: 'filmed',
  filmed: 'posted',
  posted: null,
};

export const FORMAT_LABELS: Record<ContentFormat, string> = {
  reel: 'Reel',
  carousel: 'Carousel',
  post: 'Post',
  story: 'Story',
};

export const PILLAR_LABELS: Record<ContentPillar, string> = {
  'ai-tools': 'AI Tools',
  systems: 'Systems',
  bts: 'Behind the Scenes',
  proof: 'Results & Proof',
  'hot-takes': 'Hot Takes',
};

export const FRAMEWORK_LABELS: Record<FrameworkTag, string> = {
  komadina: 'Komadina',
  hormozi: 'Hormozi',
  explorer: 'Explorer',
};

export const HOOK_STYLE_LABELS: Record<HookStyle, string> = {
  'test-result': 'Test Result',
  discovery: 'Discovery',
  challenge: 'Challenge',
  'myth-bust': 'Myth Bust',
  'curiosity-gap': 'Curiosity Gap',
  'pattern-reveal': 'Pattern Reveal',
  'honest-negative': 'Honest Negative',
};

export function getWeekId(date: Date = new Date()): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const yearStart = new Date(d.getFullYear(), 0, 4);
  const weekNum = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + yearStart.getDay() + 1) / 7
  );
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

export function weekIdToLabel(weekId: string): string {
  const match = weekId.match(/^(\d{4})-W(\d{2})$/);
  if (!match) return weekId;
  const year = parseInt(match[1]);
  const week = parseInt(match[2]);
  const jan4 = new Date(year, 0, 4);
  const start = new Date(jan4);
  start.setDate(jan4.getDate() - jan4.getDay() + 1 + (week - 1) * 7);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d: Date) =>
    `${d.getDate()} ${d.toLocaleDateString('en-AU', { month: 'short' })}`;
  return `${fmt(start)} - ${fmt(end)}`;
}

export function shiftWeek(weekId: string, offset: number): string {
  const match = weekId.match(/^(\d{4})-W(\d{2})$/);
  if (!match) return weekId;
  const year = parseInt(match[1]);
  const week = parseInt(match[2]);
  const jan4 = new Date(year, 0, 4);
  const start = new Date(jan4);
  start.setDate(jan4.getDate() - jan4.getDay() + 1 + (week - 1) * 7);
  start.setDate(start.getDate() + offset * 7);
  return getWeekId(start);
}

export function engagementRate(m: PerformanceMetrics): number {
  if (m.views === 0) return 0;
  return ((m.likes + m.saves + m.shares + m.comments) / m.views) * 100;
}

export function avgWatchTime(m: PerformanceMetrics): number {
  if (m.views === 0 || !m.watchTimeSeconds) return 0;
  return m.watchTimeSeconds / m.views;
}

export function watchThroughRate(m: PerformanceMetrics, durationSeconds: number): number {
  if (m.views === 0 || !m.watchTimeSeconds || durationSeconds === 0) return 0;
  return (avgWatchTime(m) / durationSeconds) * 100;
}

export function formatSeconds(s: number): string {
  if (s < 60) return `${s.toFixed(1)}s`;
  const mins = Math.floor(s / 60);
  const secs = Math.round(s % 60);
  return `${mins}m ${secs}s`;
}
