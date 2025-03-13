import { create } from 'zustand';

interface AssetsState {
  assets: any[];
  setAssets: (assets: any[]) => void;
  clearAssets: () => void;
  setSelectedAsset: (selectedAsset: any) => void;
  selectedAsset: any;
  clearSelectedAsset: () => void;
}

const assetsStore = create<AssetsState>((set) => ({
  assets: [],
  setAssets: (assets: any[]) => set({ assets }),
  clearAssets: () => set({ assets: [] }),
  setSelectedAsset: (selectedAsset: any) => set({ selectedAsset }),
  selectedAsset: null,
  clearSelectedAsset: () => set({ selectedAsset: null })
}));

export default assetsStore;