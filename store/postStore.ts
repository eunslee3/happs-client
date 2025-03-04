import { create } from 'zustand';

interface PostState {
  posts: any[];
  selectedPost: any;
  setPosts: (posts: any[]) => void;
  setSelectedPost: (selectedPost: any) => void;
  clearAssets: () => void;
}

const postStore = create<PostState>((set) => ({
  posts: [],
  selectedPost: {},
  setPosts: (posts: any[]) => set({ posts }),
  setSelectedPost: (selectedPost: any) => set({ selectedPost}),
  clearAssets: () => set({ posts: [] }),
}));

export default postStore;