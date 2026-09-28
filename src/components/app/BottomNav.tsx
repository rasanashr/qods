"use client";

import { Home, Search, Plus, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNav } from "@/lib/nav-store";
import { useAuth } from "@/lib/auth-store";

type TabId = "home" | "discover" | "post" | "messages" | "profile";

const tabs: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: "home", label: "خانه", icon: Home },
  { id: "discover", label: "کاوش", icon: Search },
  { id: "post", label: "ثبت", icon: Plus },
  { id: "messages", label: "پیام‌ها", icon: MessageCircle },
  { id: "profile", label: "پروفایل", icon: User },
];

export function BottomNav() {
  const [active, setActive] = useState<TabId>("home");
  const { setView, view, setPostMenuOpen } = useNav();
  const isAuthenticated = useAuth((s) => s.isAuthenticated);

  const handleClick = (id: TabId) => {
    setActive(id);

    if (id === "home") {
      if (view !== "home") {
        setView("home");
      }
      return;
    }

    if (id === "discover") {
      setView("discover");
      return;
    }

    if (id === "post") {
      // باز کردن منوی ثبت (bottom sheet)
      setPostMenuOpen(true);
      // فعال نگه‌داشتن تب قبلی (ثبت نباید active بشه)
      return;
    }

    if (id === "profile") {
      setView(isAuthenticated ? "profile" : "auth");
    }
  };

  // تعیین تب فعال بر اساس view فعلی
  const currentTab: TabId =
    view === "discover" ? "discover"
    : view === "profile" || view === "auth" ? "profile"
    : view === "home" ? "home"
    : "home";

  return (
    <nav
      aria-label="منوی پایین"
      className="sticky bottom-0 z-30 bg-card/95 backdrop-blur border-t border-border/70 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-end justify-around px-1 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id && (tab.id === "home" ? view === "home" : tab.id === "discover" ? view === "discover" : tab.id === "profile" ? (view === "profile" || view === "auth") : false);

          if (tab.id === "post") {
            // دکمه میانی برجسته
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleClick(tab.id)}
                aria-label={tab.label}
                className="relative -mt-4 flex flex-col items-center justify-center"
              >
                <span
                  className={cn(
                    "size-12 rounded-2xl bg-primary text-primary-foreground",
                    "flex items-center justify-center shadow-md active:scale-95 transition-transform"
                  )}
                >
                  <Icon className="size-6" strokeWidth={2.4} />
                </span>
                <span className="text-[10px] text-primary font-bold mt-1">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleClick(tab.id)}
              aria-label={tab.label}
              aria-current={isActive}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
            >
              <Icon
                className={cn(
                  "size-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
                strokeWidth={isActive ? 2.4 : 1.9}
              />
              <span
                className={cn(
                  "text-[10px] transition-colors",
                  isActive
                    ? "text-primary font-bold"
                    : "text-muted-foreground"
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
