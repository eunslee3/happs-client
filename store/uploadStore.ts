import { create } from 'zustand';

interface UploadState {
  progress: number;
  fileObjs: any[];
  submittedForm: any;
  setSubmittedForm: (submittedForm: any) => void;
  setProgress: (progress: number) => void;
  setFileObjs: (fileObjs: any[]) => void;
  clearProgress: () => void;
  clearFileObjs: () => void;
  clearSubmittedForm: () => void;
}

const uploadStore = create<UploadState>((set) => ({
  progress: 0,
  fileObjs: [],
  submittedForm: {},
  setSubmittedForm: (submittedForm: any) => set({ submittedForm }),
  setProgress: (progress: number) => set({ progress }),
  setFileObjs: (fileObjs: any[]) => set({ fileObjs }),
  clearFileObjs: () => set({ fileObjs: [] }),
  clearProgress: () => set({ progress: 0 }),
  clearSubmittedForm: () => set({ submittedForm: {} }),
}));

export default uploadStore;