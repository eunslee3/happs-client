import { create } from 'zustand';

interface UploadState {
  progress: number;
  fileObjs: any[];
  submittedForm: any;
  isUploading: boolean;
  setSubmittedForm: (submittedForm: any) => void;
  setIsUploading: (isUploading: boolean) => void;
  setProgress: (progress: number) => void;
  setFileObjs: (fileObjs: any[]) => void;
  clearProgress: () => void;
  clearFileObjs: () => void;
  clearSubmittedForm: () => void;
  isUploadingPfp: boolean;
  setIsUploadingPfp: (isUploading: boolean) => void;
}

const uploadStore = create<UploadState>((set) => ({
  progress: 0,
  fileObjs: [],
  submittedForm: {},
  isUploading: false,
  setIsUploading: (isUploading: boolean) => set({ isUploading }),
  clearFile: () => set({ fileObjs: [] }),
  setSubmittedForm: (submittedForm: any) => set({ submittedForm }),
  setProgress: (progress: number) => set({ progress }),
  setFileObjs: (fileObjs: any[]) => set({ fileObjs }),
  clearFileObjs: () => set({ fileObjs: [] }),
  clearProgress: () => set({ progress: 0 }),
  clearSubmittedForm: () => set({ submittedForm: {} }),
  isUploadingPfp: false,
  setIsUploadingPfp: (isUploadingPfp: boolean) => set({ isUploadingPfp })
}));

export default uploadStore;