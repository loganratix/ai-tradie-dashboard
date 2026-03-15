import { useCallback, useMemo, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type {
  ContentPiece,
  ContentStatus,
  DashboardState,
  PerformanceMetrics,
} from '../types/content';
import { getWeekId } from '../types/content';
import { SEED_CONTENT } from '../data/seed';

const DEFAULT_STATE: DashboardState = {
  content: [],
  activeWeek: getWeekId(),
  version: 1,
};

export function useContentStore() {
  const [state, setState] = useLocalStorage<DashboardState>(
    'ai-tradie-dashboard-state',
    DEFAULT_STATE
  );

  // Seed on first load if empty, or re-seed if version is outdated
  const seeded = useRef(false);
  useEffect(() => {
    if (!seeded.current) {
      if (state.content.length === 0 || state.version < 2) {
        seeded.current = true;
        setState(() => ({ content: SEED_CONTENT, activeWeek: getWeekId(), version: 2 }));
      }
    }
  }, [state.content.length, state.version, setState]);

  const setActiveWeek = useCallback(
    (weekId: string) => {
      setState((prev) => ({ ...prev, activeWeek: weekId }));
    },
    [setState]
  );

  const addContent = useCallback(
    (pieces: ContentPiece[]) => {
      setState((prev) => {
        const existingIds = new Set(prev.content.map((c) => c.id));
        const newPieces = pieces.filter((p) => !existingIds.has(p.id));
        return { ...prev, content: [...prev.content, ...newPieces] };
      });
    },
    [setState]
  );

  const updateContent = useCallback(
    (id: string, partial: Partial<ContentPiece>) => {
      setState((prev) => ({
        ...prev,
        content: prev.content.map((c) =>
          c.id === id ? { ...c, ...partial } : c
        ),
      }));
    },
    [setState]
  );

  const updateStatus = useCallback(
    (id: string, status: ContentStatus) => {
      setState((prev) => ({
        ...prev,
        content: prev.content.map((c) =>
          c.id === id
            ? {
                ...c,
                status,
                datePosted:
                  status === 'posted'
                    ? new Date().toISOString().split('T')[0]
                    : c.datePosted,
              }
            : c
        ),
      }));
    },
    [setState]
  );

  const updateMetrics = useCallback(
    (id: string, metrics: PerformanceMetrics) => {
      setState((prev) => ({
        ...prev,
        content: prev.content.map((c) =>
          c.id === id ? { ...c, metrics } : c
        ),
      }));
    },
    [setState]
  );

  const updateNotes = useCallback(
    (id: string, notes: string) => {
      setState((prev) => ({
        ...prev,
        content: prev.content.map((c) =>
          c.id === id ? { ...c, notes } : c
        ),
      }));
    },
    [setState]
  );

  const deleteContent = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        content: prev.content.filter((c) => c.id !== id),
      }));
    },
    [setState]
  );

  const weekContent = useMemo(
    () => state.content.filter((c) => c.weekId === state.activeWeek),
    [state.content, state.activeWeek]
  );

  const allContent = state.content;

  const postedContent = useMemo(
    () => state.content.filter((c) => c.status === 'posted' && c.metrics),
    [state.content]
  );

  const importData = useCallback(
    (json: string) => {
      try {
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed)) {
          const pieces: ContentPiece[] = parsed.map((p: Partial<ContentPiece>) => ({
            id: p.id || crypto.randomUUID(),
            title: p.title || 'Untitled',
            hook: p.hook || '',
            body: p.body || '',
            caption: p.caption || '',
            filmingNotes: p.filmingNotes || '',
            format: p.format || 'reel',
            pillar: p.pillar || 'ai-tools',
            hookStyle: p.hookStyle || 'curiosity-gap',
            frameworkTags: p.frameworkTags || [],
            status: p.status || 'idea',
            weekId: p.weekId || state.activeWeek,
            datePosted: p.datePosted || null,
            metrics: p.metrics || null,
            notes: p.notes || '',
          }));
          addContent(pieces);
          return { success: true, count: pieces.length };
        } else if (parsed.content && Array.isArray(parsed.content)) {
          setState(parsed as DashboardState);
          return { success: true, count: parsed.content.length };
        }
        return { success: false, count: 0 };
      } catch {
        return { success: false, count: 0 };
      }
    },
    [addContent, setState, state.activeWeek]
  );

  const exportAll = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const clearAll = useCallback(() => {
    setState(DEFAULT_STATE);
  }, [setState]);

  return {
    state,
    activeWeek: state.activeWeek,
    setActiveWeek,
    weekContent,
    allContent,
    postedContent,
    addContent,
    updateContent,
    updateStatus,
    updateMetrics,
    updateNotes,
    deleteContent,
    importData,
    exportAll,
    clearAll,
  };
}
