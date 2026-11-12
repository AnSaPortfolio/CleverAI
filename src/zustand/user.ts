import { create } from "zustand";

export type UserState = {
  // email: null | string;
  isLoggedIn: boolean;

  login: () => void;
  logout: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  // email: null,
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
