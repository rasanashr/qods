import { create } from "zustand";

export type AppView =
  | "home"
  | "discover"
  | "city-services"
  | "amlak"
  | "lostfound"
  | "sama137"
  | "food"
  | "store"
  | "sim-card"
  | "beauty"
  | "product-detail"
  | "auth"
  | "profile"
  | "classifieds"
  | "post-classified"
  | "post-lost-found"
  | "post-sama137"
  | "messenger"
  | "new-chat"
  | "chat-detail";

type NavState = {
  view: AppView;
  selectedProductId: string | null;
  selectedConversationId: string | null;
  postMenuOpen: boolean;
  setView: (v: AppView) => void;
  openProduct: (id: string) => void;
  openChat: (id: string) => void;
  setPostMenuOpen: (v: boolean) => void;
};

export const useNav = create<NavState>((set) => ({
  view: "home",
  selectedProductId: null,
  selectedConversationId: null,
  postMenuOpen: false,
  setView: (view) => set({ view, postMenuOpen: false }),
  openProduct: (id) => set({ view: "product-detail", selectedProductId: id, postMenuOpen: false }),
  openChat: (id) =>
    set({ view: "chat-detail", selectedConversationId: id, postMenuOpen: false }),
  setPostMenuOpen: (postMenuOpen) => set({ postMenuOpen }),
}));
