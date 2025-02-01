import { create } from 'zustand';

interface AssetsState {
  assets: any[];
  setAssets: (assets: any[]) => void;
  clearAssets: () => void;
}

const assetsStore = create<AssetsState>((set) => ({
  assets: [],
  setAssets: (assets: any[]) => set({ assets }),
  clearAssets: () => set({ assets: [] }),
}));

export default assetsStore;