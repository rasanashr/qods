"use client";

import { useState } from "react";
import { useNav } from "@/lib/nav-store";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Phone,
  PlusCircle,
  ClipboardList,
  Headphones,
  AlertCircle,
  Plus,
} from "lucide-react";
import { MyRequests } from "@/components/app/MyRequests";

type Tab = "tracking" | "new";

export function Sama137Page() {
  const setView = useNav((s) => s.setView);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const [tab, setTab] = useState<Tab>("tracking");

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

        {/* دکمه ثبت درخواست جدید */}
        <div className="px-4 pb-2">
          <button
            type="button"
            onClick={() => setView(isAuthenticated ? "post-sama137" : "auth")}
            className="w-full inline-flex items-center justify-center gap-2 bg-white text-primary text-sm font-bold py-2.5 rounded-xl shadow active:scale-[0.98] transition-transform"
          >
            <PlusCircle className="size-4" />
            ثبت درخواست جدید
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto thin-scrollbar bg-muted/30 pb-2">
        {/* بنر راهنما */}
        <section className="px-4 pt-3">
          <div className="flex items-start gap-2 bg-sky-50 border border-sky-100 rounded-xl p-3">
            <AlertCircle className="size-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-sky-900">
                راهنما
              </p>
              <p className="text-[10px] text-sky-800/80 leading-relaxed mt-0.5">
                با دکمه بالا می‌تونید درخواست جدید ثبت کنید. درخواست‌های قبلی خودتون رو هم در زیر ببینید و پیگیری کنید.
              </p>
            </div>
          </div>
        </section>

        {!isAuthenticated && (
          <section className="px-4 pt-3">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
              <AlertCircle className="size-5 text-amber-600 shrink-0" />
              <p className="text-[11px] text-amber-800">
                برای ثبت درخواست جدید، ابتدا با شماره موبایل وارد شوید.
              </p>
            </div>
          </section>
        )}

        <MyRequests />

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
