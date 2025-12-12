import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IGlobalStateType, IStateType } from "./types";

const initData: IStateType = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL + "/api/v1",
  token: "",
  theme: "light",
  permissions: [],
};

export const useGlobal = create<IGlobalStateType>()(
  persist(
    (set) => ({
      ...initData,

      actions: {
        set,
        reset: (state) =>
          set({
            ...initData,
            ...state,
          }),
        logout: () =>
          set({
            token: "",
            permissions: [],
          }),
      },
    }),
    // Persistent configuration(localStorage)
    {
      name: "project-name",
      partialize: ({ 
        token,
        theme,
      }) => ({
        token,
        theme,
      }),
    }
  )
);
