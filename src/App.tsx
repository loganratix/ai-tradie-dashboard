import { useState } from 'react';
import { useContentStore } from './hooks/useContentStore';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { ContentList } from './components/board/ContentList';
import { ContentImport } from './components/board/ContentImport';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';

type Tab = 'board' | 'analytics' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('board');
  const [importOpen, setImportOpen] = useState(false);

  const store = useContentStore();

  const handleExportClick = () => {
    const json = store.exportAll();
    navigator.clipboard.writeText(json).catch(() => {});
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Header
        activeWeek={store.activeWeek}
        onWeekChange={store.setActiveWeek}
        onImport={() => setImportOpen(true)}
        onExport={handleExportClick}
        activeTab={activeTab}
      />

      <main className="flex-1 overflow-y-auto hide-scrollbar" style={{ paddingBottom: '80px' }}>
        {activeTab === 'board' && (
          <ContentList
            content={store.weekContent}
            onStatusChange={store.updateStatus}
            onMetricsChange={store.updateMetrics}
            onNotesChange={store.updateNotes}
            onDelete={store.deleteContent}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView postedContent={store.postedContent} />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            allContent={store.allContent}
            postedContent={store.postedContent}
            onExportAll={store.exportAll}
            onImportData={store.importData}
            onClearAll={store.clearAll}
          />
        )}
      </main>

      <BottomNav active={activeTab} onChange={setActiveTab} />

      <ContentImport
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={store.importData}
      />
    </div>
  );
}
