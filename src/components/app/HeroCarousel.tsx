"use client";

import { useCallback, useEffect, useState } from "react";
import { carouselSlides as fallbackSlides } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

const AUTO_INTERVAL = 4000;

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  gradient: string;
  emoji: string;
};

export function HeroCarousel() {
  const [banners, setBanners] = useState<Banner[]>(fallbackSlides);
  const [index, setIndex] = useState(0);
  const count = banners.length;

  // بارگذاری بنرها از دیتابیس
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/public/banners?position=home_carousel");
        const data = await res.json();
        if (active && Array.isArray(data.banners) && data.banners.length > 0) {
          setBanners(data.banners);
        }
      } catch {
        // در صورت خطا، fallback استفاده می‌شود
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const go = useCallback((i: number) => setIndex((i + count) % count), [count]);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, AUTO_INTERVAL);
    return () => clearInterval(t);
  }, [count]);

  return (
    <section aria-label="اسلایدر شبکه قدس" className="px-4 pt-2 pb-1">
      <div className="relative overflow-hidden rounded-2xl shadow-md">
        {/* استک لایه‌ها برای انیمیشن cross-fade */}
        <div className="relative h-40">
          {banners.map((slide, i) => (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="اسلاید"
              aria-label={`${i + 1} از ${count}: ${slide.title}`}
              aria-hidden={i !== index}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out",
                "bg-gradient-to-br text-white p-4 flex flex-col justify-between",
                slide.gradient,
                i === index ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              {/* دکور دایره‌های شیشه‌ای */}
              <div className="pointer-events-none absolute -top-8 -left-8 size-32 rounded-full bg-white/10 blur-xl" />
              <div className="pointer-events-none absolute bottom-2 -right-4 size-24 rounded-full bg-white/10 blur-md" />

              <div className="relative flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-[10px] font-medium bg-white/20 backdrop-blur px-2 py-0.5 rounded-md ring-1 ring-white/15">
                    شبکه قدس
                  </span>
                  <h3 className="mt-2 text-base font-bold leading-tight drop-shadow-sm">
                    {slide.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-white/85 line-clamp-2 leading-relaxed">
                    {slide.subtitle}
                  </p>
                </div>
                <div className="text-3xl shrink-0 -mt-1 -mr-1 drop-shadow">
                  {slide.emoji}
                </div>
              </div>

              <div className="relative flex items-center justify-between">
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-1 bg-white text-primary text-[11px] font-bold",
                    "px-3 py-1.5 rounded-lg shadow-sm active:scale-95 transition-transform"
                  )}
                >
                  {slide.cta}
                  <ChevronLeft className="size-3.5" strokeWidth={2.5} />
                </button>
                <div className="flex items-center gap-1">
                  {banners.map((_, di) => (
                    <button
                      key={di}
                      type="button"
                      aria-label={`اسلاید ${di + 1}`}
                      onClick={() => go(di)}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        di === index
                          ? "w-5 bg-white"
                          : "w-1.5 bg-white/50 hover:bg-white/70"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
