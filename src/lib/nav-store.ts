import { create } from "zustand";

export type AppView =
  | "home"
  | "amlak"
  | "lostfound"
  | "sama137"
  | "food"
  | "store"
  | "product-detail"
  | "auth"
  | "profile"
  | "classifieds"
  | "post-classified"
  | "post-lost-found"
  | "post-sama137";

type NavState = {
  view: AppView;
  selectedProductId: string | null;
  setView: (v: AppView) => void;
  openProduct: (id: string) => void;
};

export const useNav = create<NavState>((set) => ({
  view: "home",
  selectedProductId: null,
  setView: (view) => set({ view }),
  openProduct: (id) => set({ view: "product-detail", selectedProductId: id }),
}));
