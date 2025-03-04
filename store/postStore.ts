import { create } from 'zustand';

interface PostState {
  posts: any[];
  selectedPost: any;
  setPosts: (posts: any[]) => void;
  setSelectedPost: (selectedPost: any) => void;
  clearAssets: () => void;
  clearSelectedPost: () => void;
}

const postStore = create<PostState>((set) => ({
  posts: [],
  selectedPost: {},
  setPosts: (posts: any[]) => set({ posts }),
  setSelectedPost: (selectedPost: any) => set({ selectedPost}),
  clearAssets: () => set({ posts: [] }),
  clearSelectedPost: () => set({ selectedPost: {} }),
}));

export default postStore;