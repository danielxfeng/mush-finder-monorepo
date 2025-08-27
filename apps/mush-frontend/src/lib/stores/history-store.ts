import type { HistoryDb } from '@repo/schemas';
import { create } from 'zustand';

import { getHistoryDb } from '@/lib/indexed-db-helper';

interface HistoryStore {
  history: HistoryDb[];
  updateHistory: (newHistory: HistoryDb[]) => void;
}

const initHistory = async (set: (partial: Partial<HistoryStore>) => void): Promise<HistoryDb[]> => {
  const data = await getHistoryDb();
  set({ history: data });
  return data;
};

const useHistoryStore = create<HistoryStore>((set) => {
  const initState: HistoryStore = {
    history: [],
    updateHistory: (newHistory) => {
      set({ history: newHistory });
    },
  };

  // Async init
  void initHistory(set);

  return initState;
});

export default useHistoryStore;
