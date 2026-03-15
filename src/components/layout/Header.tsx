import { ChevronLeft, ChevronRight, Plus, Download } from 'lucide-react';
import { weekIdToLabel, shiftWeek } from '../../types/content';

interface HeaderProps {
  activeWeek: string;
  onWeekChange: (weekId: string) => void;
  onImport: () => void;
  onExport: () => void;
  activeTab: string;
}

export function Header({ activeWeek, onWeekChange, onImport, onExport, activeTab }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 pt-safe"
      style={{ background: '#0a0a0a', borderBottom: '1px solid #222' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
        }}
      >
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
          AI Tradie
        </h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {activeTab === 'board' && (
            <button
              onClick={onImport}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#111',
                border: '1px solid #222',
                cursor: 'pointer',
                color: '#e5e5e5',
              }}
            >
              <Plus size={18} />
            </button>
          )}
          <button
            onClick={onExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#111',
              border: '1px solid #222',
              cursor: 'pointer',
              color: '#e5e5e5',
            }}
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {activeTab === 'board' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px 14px',
          }}
        >
          <button
            onClick={() => onWeekChange(shiftWeek(activeWeek, -1))}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#111',
              border: '1px solid #222',
              cursor: 'pointer',
              color: '#e5e5e5',
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#888' }}>
            {weekIdToLabel(activeWeek)}
          </span>
          <button
            onClick={() => onWeekChange(shiftWeek(activeWeek, 1))}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#111',
              border: '1px solid #222',
              cursor: 'pointer',
              color: '#e5e5e5',
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </header>
  );
}
