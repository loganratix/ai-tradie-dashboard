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
    <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {message && (
        <div
          style={{
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: 600,
            background: '#22c55e20',
            color: '#86efac',
            border: '1px solid #22c55e40',
          }}
        >
          {message}
        </div>
      )}

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

      <Section title="Import">
        <ActionButton
          icon={<Upload size={16} />}
          label="Restore from Backup"
          description="Paste a full backup JSON to restore all data."
          onClick={() => setShowImport(!showImport)}
        />
        {showImport && (
          <div style={{ marginTop: '10px' }}>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste backup JSON here..."
              rows={6}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '13px',
                color: '#e5e5e5',
                background: '#0a0a0a',
                border: '1px solid #222',
                outline: 'none',
                resize: 'none',
                fontFamily: 'monospace',
                marginBottom: '8px',
              }}
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
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#fff',
                background: !importJson.trim() ? '#222' : '#2563EB',
                border: 'none',
                cursor: !importJson.trim() ? 'default' : 'pointer',
                opacity: !importJson.trim() ? 0.4 : 1,
              }}
            >
              Restore
            </button>
          </div>
        )}
      </Section>

      <Section title="Data">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 0' }}>
          <Database size={16} color="#666" />
          <span style={{ fontSize: '13px', color: '#888' }}>
            {allContent.length} content pieces, {storageUsed()} used
          </span>
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
      style={{
        borderRadius: '16px',
        padding: '16px',
        background: '#111',
        border: '1px solid #222',
      }}
    >
      <h3
        style={{
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          color: '#666',
          marginBottom: '12px',
        }}
      >
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
      style={{
        width: '100%',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '10px 0',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: danger ? '#ef4444' : '#e5e5e5',
      }}
    >
      <div style={{ marginTop: '2px' }}>{icon}</div>
      <div>
        <p style={{ fontSize: '14px', fontWeight: 500 }}>{label}</p>
        <p style={{ fontSize: '12px', marginTop: '2px', color: '#666' }}>
          {description}
        </p>
      </div>
    </button>
  );
}
