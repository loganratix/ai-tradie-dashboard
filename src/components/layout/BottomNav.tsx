import { ClipboardList, BarChart3, Settings } from 'lucide-react';

type Tab = 'board' | 'analytics' | 'settings';

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: typeof ClipboardList }[] = [
  { id: 'board', label: 'Board', icon: ClipboardList },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around pb-safe"
      style={{
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        paddingTop: '8px',
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex flex-col items-center gap-1 min-w-[64px] py-1"
            style={{ color: isActive ? 'var(--accent)' : 'var(--text-tertiary)' }}
          >
            <Icon size={22} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
