import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  phone: string;
  name: string;
  joinedAt: string;
  avatarColor: string;
  stats: {
    requests: number;
    listings: number;
    orders: number;
  };
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, name?: string) => void;
  logout: () => void;
  updateProfile: (name: string) => void;
};

// رنگ‌های تصادفی برای آواتار
const avatarColors = [
  "bg-teal-500",
  "bg-emerald-500",
  "bg-sky-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-purple-500",
  "bg-orange-500",
];

function pickColor(phone: string): string {
  // بر اساس آخرین رقم شماره، یک رنگ انتخاب می‌کنیم
  const lastDigit = phone.replace(/\D/g, "").slice(-1);
  const idx = parseInt(lastDigit) % avatarColors.length;
  return avatarColors[idx] || avatarColors[0];
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (phone: string, name?: string) => {
        const user: User = {
          phone,
          name: name?.trim() || `کاربر ${phone.slice(-4)}`,
          joinedAt: new Date().toLocaleDateString("fa-IR"),
          avatarColor: pickColor(phone),
          stats: {
            requests: 3,
            listings: 1,
            orders: 2,
          },
        };
        set({ user, isAuthenticated: true });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (name: string) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, name: name.trim() || state.user.name }
            : null,
        })),
    }),
    {
      name: "quds-auth",
      // فقط در client-side ذخیره می‌شود
      skipHydration: false,
    }
  )
);
