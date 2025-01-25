import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

interface UserState {
  user: any | null; // any type cause I'm fucking lazy
  setUser: (user: any) => void;
  clearUser: () => void;
}

const userStore = create(
  persist<UserState>((set) => ({
  user: null, // Initial state
  setUser: (user: any) => set({ user }),
  clearUser: () => set({ user: null }),
}),
{
  name: 'user-storage',
  storage: createJSONStorage(() => AsyncStorage)
}
));

export default userStore;