"use client";

import { useState, useEffect } from "react";
import { Search, Bell, MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // به‌روزرسانی اولیه با تأخیر جزئی برای جلوگیری از رندر آبشاری
    const initialTimer = setTimeout(() => setNow(new Date()), 50);
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(t);
    };
  }, []);

  const timeStr =
    now?.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }) ?? "—";

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-b from-primary to-primary/95 text-primary-foreground shadow-lg">
      {/* نوار بالا: لوگو + لوکیشن + اعلان */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="size-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/20">
            <span className="text-xl font-black">ق</span>
          </div>
          <div className="leading-tight">
            <h1 className="text-base font-bold">شبکه قدس</h1>
            <div className="flex items-center gap-1 text-[11px] text-white/80">
              <MapPin className="size-3" />
              <span>قدس، منطقه ۳</span>
              <ChevronDown className="size-3 opacity-70" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="ساعت"
            className="text-[11px] tabular-nums bg-white/10 px-2 py-1 rounded-md ring-1 ring-white/10"
          >
            {timeStr}
          </button>
          <button
            aria-label="اعلان‌ها"
            className="relative size-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center ring-1 ring-white/15"
          >
            <Bell className="size-4.5" />
            <span className="absolute top-1.5 left-1.5 size-2 bg-rose-400 rounded-full ring-2 ring-primary" />
          </button>
        </div>
      </div>

      {/* جعبه جستجو */}
      <div className="px-4 pb-3">
        <div
          className={cn(
            "flex items-center gap-2 bg-white/95 rounded-xl px-3 py-2.5",
            "shadow-sm focus-within:ring-2 focus-within:ring-white/50 transition-all"
          )}
        >
          <Search className="size-4.5 text-muted-foreground" />
          <input
            type="text"
            inputMode="search"
            placeholder="جستجو در شبکه قدس…"
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
          <button
            type="button"
            aria-label="جستجوی صوتی"
            className="text-primary/70 hover:text-primary transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4.5"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
