"use client";

import { useState } from "react";
import { useNav } from "@/lib/nav-store";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Phone,
  PlusCircle,
  ClipboardList,
  Headphones,
  AlertCircle,
} from "lucide-react";
import { RequestForm } from "@/components/app/RequestForm";
import { MyRequests } from "@/components/app/MyRequests";

type Tab = "form" | "tracking";

export function Sama137Page() {
  const setView = useNav((s) => s.setView);
  const [tab, setTab] = useState<Tab>("form");

  return (
    <>
      {/* هدر صفحه */}
      <header className="sticky top-0 z-30 bg-gradient-to-b from-primary to-primary/95 text-primary-foreground shadow-lg">
        <div className="px-4 pt-3 pb-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setView("home")}
            aria-label="بازگشت به خانه"
            className="size-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center ring-1 ring-white/15"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold">سامانه ۱۳۷</h1>
            <p className="text-[11px] text-white/80">
              مرکز رسیدگی به درخواست‌های شهروندان
            </p>
          </div>
          <a
            href="tel:137"
            aria-label="تماس با ۱۳۷"
            className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition-colors text-[11px] font-bold px-3 py-1.5 rounded-full ring-1 ring-white/15"
          >
            <Phone className="size-3.5" />
            ۱۳۷
          </a>
        </div>

        {/* نوار راهنما */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-2.5 py-1.5 ring-1 ring-white/15">
            <Headphones className="size-3.5 text-white/80 shrink-0" />
            <p className="text-[10px] text-white/85 leading-tight">
              ۲۴ ساعته پاسخگوی درخواست‌های شما — متوسط زمان پاسخ: کمتر از ۲ ساعت
            </p>
          </div>
        </div>

        {/* تب‌ها */}
        <div className="px-4 pb-0">
          <div role="tablist" className="flex items-center gap-1 -mb-px">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "form"}
              onClick={() => setTab("form")}
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-all border-b-2",
                tab === "form"
                  ? "border-white text-white"
                  : "border-transparent text-white/70 hover:text-white"
              )}
            >
              <PlusCircle className="size-4" />
              ثبت درخواست
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "tracking"}
              onClick={() => setTab("tracking")}
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-all border-b-2",
                tab === "tracking"
                  ? "border-white text-white"
                  : "border-transparent text-white/70 hover:text-white"
              )}
            >
              <ClipboardList className="size-4" />
              پیگیری‌های من
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto thin-scrollbar bg-muted/30 pb-2">
        {tab === "form" ? (
          <>
            {/* بنر راهنما */}
            <section className="px-4 pt-3">
              <div className="flex items-start gap-2 bg-sky-50 border border-sky-100 rounded-xl p-3">
                <AlertCircle className="size-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold text-sky-900">
                    راهنمای تکمیل فرم
                  </p>
                  <p className="text-[10px] text-sky-800/80 leading-relaxed mt-0.5">
                    برای ثبت سریع‌تر درخواست، نوع مشکل را دقیق انتخاب کنید، آدرس کامل وارد کنید و در صورت امکان عکس یا ویدیو از محل پیوست کنید.
                  </p>
                </div>
              </div>
            </section>

            <RequestForm />
          </>
        ) : (
          <MyRequests />
        )}

        {/* فوتر */}
        <footer className="px-4 py-6 text-center">
          <div className="text-[11px] text-muted-foreground">
            سامانه ۱۳۷ شبکه قدس © ۱۴۰۴
          </div>
          <div className="text-[10px] text-muted-foreground/70 mt-0.5">
            ارائه شده توسط رسا نشر
          </div>
        </footer>
      </main>
    </>
  );
}
