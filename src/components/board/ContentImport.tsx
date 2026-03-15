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
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="pb-safe"
        style={{
          width: '100%',
          maxWidth: '480px',
          borderRadius: '16px 16px 0 0',
          padding: '20px',
          background: '#111',
          border: '1px solid #222',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Import Content</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#666" />
          </button>
        </div>

        <p style={{ fontSize: '13px', marginBottom: '12px', color: '#888' }}>
          Paste JSON from Claude's /ai-tradie-content weekly output, or a full dashboard backup.
        </p>

        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          placeholder='[{"title": "...", "hook": "...", "format": "reel", ...}]'
          rows={8}
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
            marginBottom: '12px',
          }}
        />

        {message && (
          <p style={{
            fontSize: '13px',
            marginBottom: '12px',
            color: message.includes('Invalid') ? '#ef4444' : '#86efac',
          }}>
            {message}
          </p>
        )}

        <button
          onClick={handleImport}
          disabled={!json.trim()}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#fff',
            background: !json.trim() ? '#222' : '#2563EB',
            border: 'none',
            cursor: !json.trim() ? 'default' : 'pointer',
            opacity: !json.trim() ? 0.4 : 1,
          }}
        >
          Import
        </button>
      </div>
    </div>
  );
}
