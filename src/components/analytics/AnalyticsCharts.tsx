import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import type {
  FrameworkTag,
  ContentFormat,
  HookStyle,
  ContentPillar,
} from '../../types/content';
import {
  FRAMEWORK_LABELS,
  FORMAT_LABELS,
  HOOK_STYLE_LABELS,
  PILLAR_LABELS,
} from '../../types/content';

const CHART_COLORS = {
  engagement: '#2563EB',
  saves: '#22c55e',
  dms: '#fbbf24',
};

const tooltipStyle = {
  contentStyle: { background: '#111', border: '1px solid #222', borderRadius: 8, fontSize: 12 },
  labelStyle: { color: '#999' },
};

interface ChartSectionProps {
  title: string;
  children: React.ReactNode;
}

function ChartSection({ title, children }: ChartSectionProps) {
  return (
    <div
      className="rounded-xl p-4 mb-4 mx-4"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <h3 className="text-[13px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

// Framework Chart
export function FrameworkChart({
  data,
}: {
  data: Partial<Record<FrameworkTag, { count: number; avgEngagement: number; avgSaves: number; avgDMs: number }>>;
}) {
  const chartData = Object.entries(data).map(([key, val]) => ({
    name: FRAMEWORK_LABELS[key as FrameworkTag],
    engagement: Math.round(val!.avgEngagement * 100) / 100,
    saves: val!.avgSaves,
    count: val!.count,
  }));

  if (chartData.length === 0) return null;

  return (
    <ChartSection title="By Framework">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
          <XAxis dataKey="name" tick={{ fill: '#999', fontSize: 11 }} />
          <YAxis tick={{ fill: '#999', fontSize: 11 }} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="engagement" fill={CHART_COLORS.engagement} radius={[4, 4, 0, 0]} name="Avg Engagement %" />
        </BarChart>
      </ResponsiveContainer>
    </ChartSection>
  );
}

// Format Chart
export function FormatChart({
  data,
}: {
  data: Partial<Record<ContentFormat, { count: number; avgEngagement: number; avgSaves: number }>>;
}) {
  const chartData = Object.entries(data).map(([key, val]) => ({
    name: FORMAT_LABELS[key as ContentFormat],
    engagement: Math.round(val!.avgEngagement * 100) / 100,
    saves: val!.avgSaves,
    count: val!.count,
  }));

  if (chartData.length === 0) return null;

  return (
    <ChartSection title="By Format">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
          <XAxis dataKey="name" tick={{ fill: '#999', fontSize: 11 }} />
          <YAxis tick={{ fill: '#999', fontSize: 11 }} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="engagement" fill={CHART_COLORS.engagement} radius={[4, 4, 0, 0]} name="Avg Engagement %" />
          <Bar dataKey="saves" fill={CHART_COLORS.saves} radius={[4, 4, 0, 0]} name="Avg Saves" />
        </BarChart>
      </ResponsiveContainer>
    </ChartSection>
  );
}

// Hook Style Chart
export function HookStyleChart({
  data,
}: {
  data: Partial<Record<HookStyle, { count: number; avgEngagement: number; avgSaves: number }>>;
}) {
  const chartData = Object.entries(data).map(([key, val]) => ({
    name: HOOK_STYLE_LABELS[key as HookStyle],
    saves: Math.round(val!.avgSaves),
    count: val!.count,
  }));

  if (chartData.length === 0) return null;

  return (
    <ChartSection title="By Hook Style (Avg Saves)">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
          <XAxis type="number" tick={{ fill: '#999', fontSize: 11 }} />
          <YAxis dataKey="name" type="category" tick={{ fill: '#999', fontSize: 10 }} width={90} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="saves" fill={CHART_COLORS.saves} radius={[0, 4, 4, 0]} name="Avg Saves" />
        </BarChart>
      </ResponsiveContainer>
    </ChartSection>
  );
}

// Pillar Chart
export function PillarChart({
  data,
}: {
  data: Partial<Record<ContentPillar, { count: number; totalDMs: number; avgEngagement: number }>>;
}) {
  const chartData = Object.entries(data).map(([key, val]) => ({
    name: PILLAR_LABELS[key as ContentPillar],
    dms: val!.totalDMs,
    count: val!.count,
  }));

  if (chartData.length === 0) return null;

  return (
    <ChartSection title="DMs by Pillar">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
          <XAxis dataKey="name" tick={{ fill: '#999', fontSize: 10 }} />
          <YAxis tick={{ fill: '#999', fontSize: 11 }} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="dms" fill={CHART_COLORS.dms} radius={[4, 4, 0, 0]} name="Total DMs" />
        </BarChart>
      </ResponsiveContainer>
    </ChartSection>
  );
}

// Trend Chart
export function TrendChart({
  data,
}: {
  data: Array<{ weekId: string; avgEngagement: number; totalPosts: number }>;
}) {
  if (data.length < 2) return null;

  const chartData = data.map((d) => ({
    week: d.weekId.replace(/^\d{4}-/, ''),
    engagement: d.avgEngagement,
    posts: d.totalPosts,
  }));

  return (
    <ChartSection title="Engagement Trend">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
          <XAxis dataKey="week" tick={{ fill: '#999', fontSize: 11 }} />
          <YAxis tick={{ fill: '#999', fontSize: 11 }} />
          <Tooltip {...tooltipStyle} />
          <Line
            type="monotone"
            dataKey="engagement"
            stroke={CHART_COLORS.engagement}
            strokeWidth={2}
            dot={{ r: 4, fill: CHART_COLORS.engagement }}
            name="Avg Engagement %"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartSection>
  );
}
