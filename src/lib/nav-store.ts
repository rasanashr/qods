import { create } from "zustand";

export type AppView =
  | "home"
  | "discover"
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
  postMenuOpen: boolean;
  setView: (v: AppView) => void;
  openProduct: (id: string) => void;
  setPostMenuOpen: (v: boolean) => void;
};

export const useNav = create<NavState>((set) => ({
  view: "home",
  selectedProductId: null,
  postMenuOpen: false,
  setView: (view) => set({ view, postMenuOpen: false }),
  openProduct: (id) => set({ view: "product-detail", selectedProductId: id, postMenuOpen: false }),
  setPostMenuOpen: (postMenuOpen) => set({ postMenuOpen }),
}));
