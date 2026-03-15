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
    <header className="sticky top-0 z-50 pt-safe" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-base font-bold tracking-tight">AI Tradie</h1>
        <div className="flex gap-2">
          {activeTab === 'board' && (
            <button
              onClick={onImport}
              className="flex items-center justify-center w-9 h-9 rounded-lg"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <Plus size={18} />
            </button>
          )}
          <button
            onClick={onExport}
            className="flex items-center justify-center w-9 h-9 rounded-lg"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {activeTab === 'board' && (
        <div className="flex items-center justify-between px-4 pb-3">
          <button
            onClick={() => onWeekChange(shiftWeek(activeWeek, -1))}
            className="flex items-center justify-center w-9 h-9 rounded-lg"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {weekIdToLabel(activeWeek)}
          </span>
          <button
            onClick={() => onWeekChange(shiftWeek(activeWeek, 1))}
            className="flex items-center justify-center w-9 h-9 rounded-lg"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </header>
  );
}
