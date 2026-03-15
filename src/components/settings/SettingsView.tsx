import { useState } from 'react';
import { Copy, Download, Upload, Trash2, Database } from 'lucide-react';
import type { ContentPiece } from '../../types/content';
import { useAnalytics } from '../../hooks/useAnalytics';

interface SettingsViewProps {
  allContent: ContentPiece[];
  postedContent: ContentPiece[];
  onExportAll: () => string;
  onImportData: (json: string) => { success: boolean; count: number };
  onClearAll: () => void;
}

export function SettingsView({
  allContent,
  postedContent,
  onExportAll,
  onImportData,
  onClearAll,
}: SettingsViewProps) {
  const { report } = useAnalytics(postedContent);
  const [message, setMessage] = useState('');
  const [importJson, setImportJson] = useState('');
  const [showImport, setShowImport] = useState(false);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessage(`${label} copied to clipboard`);
      setTimeout(() => setMessage(''), 2000);
    } catch {
      setMessage('Failed to copy. Try again.');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const storageUsed = () => {
    try {
      const data = localStorage.getItem('ai-tradie-dashboard-state');
      return data ? `${(data.length / 1024).toFixed(1)} KB` : '0 KB';
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="px-4 py-4 flex flex-col gap-3">
      {message && (
        <div
          className="rounded-lg px-4 py-2.5 text-[13px] font-medium"
          style={{ background: 'var(--status-posted)', color: '#000' }}
        >
          {message}
        </div>
      )}

      {/* Export section */}
      <Section title="Export">
        <ActionButton
          icon={<Copy size={16} />}
          label="Copy Performance Report"
          description="Structured JSON for Claude. Paste into a conversation to update the content skill."
          onClick={() => copyToClipboard(JSON.stringify(report, null, 2), 'Performance report')}
        />
        <ActionButton
          icon={<Download size={16} />}
          label="Copy Full Backup"
          description="All content data. Use to restore on another device or recover data."
          onClick={() => copyToClipboard(onExportAll(), 'Full backup')}
        />
      </Section>

      {/* Import section */}
      <Section title="Import">
        <ActionButton
          icon={<Upload size={16} />}
          label="Restore from Backup"
          description="Paste a full backup JSON to restore all data."
          onClick={() => setShowImport(!showImport)}
        />
        {showImport && (
          <div className="mt-2">
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste backup JSON here..."
              rows={6}
              className="w-full px-3 py-3 rounded-lg text-[13px] text-white outline-none resize-none mb-2 font-mono"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
            />
            <button
              onClick={() => {
                const result = onImportData(importJson);
                if (result.success) {
                  setMessage(`Restored ${result.count} content pieces`);
                  setImportJson('');
                  setShowImport(false);
                } else {
                  setMessage('Invalid backup format');
                }
              }}
              disabled={!importJson.trim()}
              className="w-full py-2.5 rounded-lg text-[13px] font-semibold text-white disabled:opacity-40"
              style={{ background: 'var(--accent)' }}
            >
              Restore
            </button>
          </div>
        )}
      </Section>

      {/* Data section */}
      <Section title="Data">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <Database size={16} style={{ color: 'var(--text-tertiary)' }} />
            <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
              {allContent.length} content pieces, {storageUsed()} used
            </span>
          </div>
        </div>
        <ActionButton
          icon={<Trash2 size={16} />}
          label="Clear All Data"
          description="Permanently delete all content and metrics. This cannot be undone."
          danger
          onClick={() => {
            if (confirm('Are you sure? This will delete ALL content and metrics permanently.')) {
              onClearAll();
              setMessage('All data cleared');
            }
          }}
        />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <h3 className="text-[12px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function ActionButton({
  icon,
  label,
  description,
  danger,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-start gap-3 py-3 rounded-lg"
      style={{ color: danger ? 'var(--fw-hormozi)' : 'var(--text)' }}
    >
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-[14px] font-medium">{label}</p>
        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
          {description}
        </p>
      </div>
    </button>
  );
}
