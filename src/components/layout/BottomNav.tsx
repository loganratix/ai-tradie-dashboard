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
      className="pb-safe"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        background: '#0a0a0a',
        borderTop: '1px solid #222',
        paddingTop: '10px',
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              minWidth: '64px',
              padding: '4px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? '#2563EB' : '#666',
              transition: 'color 0.15s',
            }}
          >
            <Icon size={22} />
            <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 500 }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
