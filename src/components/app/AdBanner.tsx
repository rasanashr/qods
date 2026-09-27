"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, Sparkles, X } from "lucide-react";

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  gradient: string;
  emoji: string;
};

const fallbackBanners: Banner[] = [
  {
    id: "b1",
    title: "تخفیف ویژه پاییزه فروشگاه قدس",
    subtitle: "تا ۴۰٪ تخفیف روی لوازم خانگی — فقط تا پایان هفته",
    cta: "خرید کن",
    gradient: "from-orange-500 via-rose-500 to-pink-600",
    emoji: "🎉",
  },
  {
    id: "b2",
    title: "به پیامرسان قدس بپیوندید",
    subtitle: "گفتگوی امن، سریع و کاملاً رایگان برای شهروندان",
    cta: "دانلود",
    gradient: "from-sky-500 via-cyan-500 to-blue-600",
    emoji: "💬",
  },
];

export function AdBanner() {
  const [banners, setBanners] = useState<Banner[]>(fallbackBanners);
  const [idx, setIdx] = useState(0);
  const [closed, setClosed] = useState(false);

  // بارگذاری بنرهای تبلیغاتی از دیتابیس
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/public/banners?position=ad_banner");
        const data = await res.json();
        if (active && Array.isArray(data.banners) && data.banners.length > 0) {
          setBanners(data.banners);
        }
      } catch {
        // fallback
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (closed) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % banners.length), 6000);
    return () => clearInterval(t);
  }, [closed, banners.length]);

  if (closed) return null;
  const b = banners[idx];

  return (
    <section aria-label="بنر تبلیغاتی" className="px-4 pt-5">
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-gradient-to-br text-white p-4 shadow-md animate-fade-in-up",
          b.gradient
        )}
      >
        {/* دکورهای تزئینی */}
        <div className="pointer-events-none absolute -top-6 -right-6 size-24 rounded-full bg-white/10 blur-lg" />
        <div className="pointer-events-none absolute -bottom-8 -left-4 size-32 rounded-full bg-white/10 blur-xl" />

        <button
          type="button"
          aria-label="بستن بنر"
          onClick={() => setClosed(true)}
          className="absolute top-2 left-2 size-6 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center backdrop-blur"
        >
          <X className="size-3.5" />
        </button>

        <div className="relative flex items-center gap-3">
          <div className="text-4xl shrink-0 drop-shadow">{b.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-0.5">
              <Sparkles className="size-3.5 text-yellow-200" />
              <span className="text-[10px] font-medium bg-white/20 backdrop-blur px-1.5 py-0.5 rounded">
                تبلیغ
              </span>
            </div>
            <h3 className="text-sm font-bold leading-snug">{b.title}</h3>
            <p className="text-[11px] text-white/85 mt-0.5 line-clamp-1">
              {b.subtitle}
            </p>
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-1 bg-white text-primary text-[11px] font-bold px-3 py-1 rounded-lg shadow active:scale-95 transition-transform"
            >
              {b.cta}
              <ChevronLeft className="size-3.5" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* اندیکاتورها */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1">
          {banners.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 rounded-full transition-all",
                i === idx ? "w-4 bg-white" : "w-1 bg-white/40"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
