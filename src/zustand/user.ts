import { create } from "zustand";

export type UserState = {
  // name: null | string;
  isLoggedIn: boolean;

  login: () => void;
  logout: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  name: null,
  isLoggedIn: false,

  login: () => {
    set({
      // name: name,
      isLoggedIn: true,
    });
  },
  logout: () => {
    set({
      // name: null,
      isLoggedIn: false,
    });
  },
}));
