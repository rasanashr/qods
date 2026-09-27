"use client";

import { cn } from "@/lib/utils";

/**
 * قاب موبایل: روی دسکتاپ، محتوا را در یک گوشی شبیه‌سازی‌شده با عرض ۳۹۰ پیکسل
 * در وسط صفحه نمایش می‌دهد. روی موبایل واقعی، تمام صفحه را اشغال می‌کند.
 */
export function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-gradient-to-br from-slate-200 via-slate-100 to-emerald-50 flex items-stretch sm:items-center justify-center sm:py-6"
    >
      {/* گوشی شبیه‌سازی‌شده فقط روی sm به بالا */}
      <div
        className={cn(
          "w-full sm:w-[400px] bg-background shadow-2xl sm:rounded-[2.2rem] overflow-hidden",
          "sm:ring-[10px] sm:ring-slate-900/90 sm:border sm:border-slate-300",
          "relative flex flex-col",
          "h-screen sm:h-[860px] sm:max-h-[92vh]"
        )}
      >
        {/* ناتچ (فقط دسکتاپ) */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900/90 z-50 rounded-b-2xl" />

        {children}
      </div>
    </div>
  );
}
