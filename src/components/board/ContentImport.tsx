import { useState } from 'react';
import { X } from 'lucide-react';

interface ContentImportProps {
  open: boolean;
  onClose: () => void;
  onImport: (json: string) => { success: boolean; count: number };
}

export function ContentImport({ open, onClose, onImport }: ContentImportProps) {
  const [json, setJson] = useState('');
  const [message, setMessage] = useState('');

  if (!open) return null;

  const handleImport = () => {
    const result = onImport(json);
    if (result.success) {
      setMessage(`Imported ${result.count} content pieces`);
      setJson('');
      setTimeout(() => {
        setMessage('');
        onClose();
      }, 1500);
    } else {
      setMessage('Invalid JSON format. Paste an array of content objects.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-lg rounded-t-2xl p-5 pb-safe"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold">Import Content</h2>
          <button onClick={onClose}>
            <X size={20} style={{ color: 'var(--text-tertiary)' }} />
          </button>
        </div>

        <p className="text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Paste JSON from Claude's /ai-tradie-content weekly output, or a full dashboard backup.
        </p>

        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          placeholder='[{"title": "...", "hook": "...", "format": "reel", ...}]'
          rows={8}
          className="w-full px-3 py-3 rounded-lg text-[13px] text-white outline-none resize-none mb-3 font-mono"
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
          }}
        />

        {message && (
          <p className="text-[13px] mb-3" style={{ color: message.includes('Invalid') ? 'var(--fw-hormozi)' : 'var(--status-posted)' }}>
            {message}
          </p>
        )}

        <button
          onClick={handleImport}
          disabled={!json.trim()}
          className="w-full py-3 rounded-lg text-[14px] font-semibold text-white disabled:opacity-40"
          style={{ background: 'var(--accent)' }}
        >
          Import
        </button>
      </div>
    </div>
  );
}
