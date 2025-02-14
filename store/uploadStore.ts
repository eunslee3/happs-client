import { create } from 'zustand';

interface UploadState {
  progress: number;
  fileObjs: any[];
  setProgress: (progress: number) => void;
  setFileObjs: (fileObjs: any[]) => void;
  clearProgress: () => void;
  clearFileObjs: () => void;
}

const assetsStore = create<UploadState>((set) => ({
  progress: 0,
  fileObjs: [],
  setProgress: (progress: number) => set({ progress }),
  setFileObjs: (fileObjs: any[]) => set({ fileObjs }),
  clearFileObjs: () => set({ fileObjs: [] }),
  clearProgress: () => set({ progress: 0 }),
}));

export default assetsStore;