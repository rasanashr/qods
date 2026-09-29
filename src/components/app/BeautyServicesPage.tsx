"use client";

import { useNav } from "@/lib/nav-store";
import { beautyServices } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Sparkles,
  Clock,
} from "lucide-react";

export function BeautyServicesPage() {
  const setView = useNav((s) => s.setView);

  const availableCount = beautyServices.filter((s) => s.isAvailable).length;

  return (
    <>
      {/* هدر صفحه */}
      <header className="sticky top-0 z-30 bg-gradient-to-b from-pink-600 to-rose-600 text-white shadow-lg">
        <div className="px-4 pt-3 pb-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setView("home")}
            aria-label="بازگشت به خانه"
            className="size-9 rounded-full bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center ring-1 ring-white/15"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold">خدمات زیبایی</h1>
            <p className="text-[11px] text-white/80">
              {availableCount.toLocaleString("fa-IR")} سرویس فعال از{" "}
              {beautyServices.length.toLocaleString("fa-IR")}
            </p>
          </div>
          <div className="size-9 rounded-full bg-white/15 flex items-center justify-center ring-1 ring-white/15">
            <Sparkles className="size-5" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto thin-scrollbar bg-muted/30 pb-2">
        {/* بنر معرفی */}
        <section className="px-4 pt-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-600 text-white p-4 shadow-md">
            <div className="pointer-events-none absolute -top-6 -left-6 size-24 rounded-full bg-white/10 blur-lg" />
            <div className="pointer-events-none absolute bottom-2 -right-4 size-20 rounded-full bg-white/10 blur-md" />
            <div className="relative flex items-center gap-3">
              <div className="text-4xl shrink-0">✨</div>
              <div>
                <h3 className="text-sm font-bold">خدمات زیبایی شبکه قدس</h3>
                <p className="text-[11px] text-white/85 mt-0.5">
                  رزرو و خرید خدمات زیبایی از بهترین سالن‌ها و کلینیک‌ها
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* گرید خدمات */}
        <section className="px-4 py-4">
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <span className="inline-block w-1 h-4 bg-pink-500 rounded-full" />
            سرویس‌های زیبایی
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {beautyServices.map((service) => (
              <button
                key={service.id}
                type="button"
                disabled={!service.isAvailable}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all text-center",
                  service.isAvailable
                    ? "bg-card border-border/70 hover:shadow-md cursor-pointer active:scale-95"
                    : "bg-muted/50 border-border/40 opacity-60 cursor-not-allowed"
                )}
              >
                {/* آیکن */}
                <div
                  className={cn(
                    "size-14 rounded-2xl flex items-center justify-center text-3xl shrink-0",
                    service.color
                  )}
                >
                  {service.emoji}
                </div>

                {/* عنوان */}
                <div className="text-sm font-bold text-foreground">
                  {service.label}
                </div>

                {/* توضیحات */}
                <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
                  {service.description}
                </p>

                {/* badge وضعیت */}
                {service.isAvailable ? (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-md">
                    فعال
                  </span>
                ) : (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-0.5 text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                    <Clock className="size-2.5" />
                    به‌زودی
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* بخش اطلاع‌رسانی */}
        <section className="px-4 pt-2 pb-4">
          <div className="bg-pink-50 border border-pink-100 rounded-xl p-3 flex items-start gap-2">
            <Clock className="size-5 text-pink-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-pink-800 leading-relaxed">
              خدمات زیبایی شبکه قدس به‌زودی راه‌اندازی می‌شود. تا آن زمان می‌توانید سایر خدمات سوپر اپ را استفاده کنید. برای اطلاع از زمان راه‌اندازی، اطلاع‌رسانی خواهد شد.
            </p>
          </div>
        </section>

        {/* فوتر */}
        <footer className="px-4 py-6 text-center">
          <div className="text-[11px] text-muted-foreground">
            خدمات زیبایی شبکه قدس © ۱۴۰۴
          </div>
          <div className="text-[10px] text-muted-foreground/70 mt-0.5">
            ارائه شده توسط رسا نشر
          </div>
        </footer>
      </main>
    </>
  );
}
