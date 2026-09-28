"use client";

import { useNav } from "@/lib/nav-store";
import { useAuth } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import {
  X,
  ListOrdered,
  PackageSearch,
  Phone,
  Building2,
  ChevronLeft,
  LogIn,
} from "lucide-react";

const menuItems = [
  {
    id: "post-classified",
    label: "ثبت آگهی نیازمندی",
    description: "آگهی رایگان، ویژه یا فوری",
    emoji: "📢",
    icon: ListOrdered,
    color: "bg-emerald-50 text-emerald-700",
    requiresAuth: true,
  },
  {
    id: "post-lost-found",
    label: "ثبت مورد اشیاء گمشده",
    description: "گم‌شده یا پیدا‌شده",
    emoji: "🔍",
    icon: PackageSearch,
    color: "bg-sky-50 text-sky-700",
    requiresAuth: true,
  },
  {
    id: "post-sama137",
    label: "ثبت درخواست سامانه ۱۳۷",
    description: "گزارش مشکل شهری با کد رهگیری",
    emoji: "📞",
    icon: Phone,
    color: "bg-amber-50 text-amber-700",
    requiresAuth: true,
  },
  {
    id: "amlak",
    label: "ثبت آگهی املاک",
    description: "فروش یا رهن و اجاره",
    emoji: "🏠",
    icon: Building2,
    color: "bg-teal-50 text-teal-700",
    requiresAuth: false,
    soon: true,
  },
] as const;

export function PostMenu() {
  const { postMenuOpen, setPostMenuOpen, setView } = useNav();
  const isAuthenticated = useAuth((s) => s.isAuthenticated);

  if (!postMenuOpen) return null;

  const handleClick = (item: (typeof menuItems)[number]) => {
    if (item.requiresAuth && !isAuthenticated) {
      setView("auth");
      return;
    }
    setView(item.id as never);
  };

  return (
    <>
      {/* پوشش پس‌زمینه */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        onClick={() => setPostMenuOpen(false)}
      />

      {/* bottom sheet */}
      <div
        dir="rtl"
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card rounded-t-3xl shadow-2xl border-t border-border/70 animate-slide-up"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* دستگیر بالای شیت */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* هدر شیت */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-border/60">
          <h2 className="text-sm font-bold">ثبت مورد جدید</h2>
          <button
            type="button"
            onClick={() => setPostMenuOpen(false)}
            aria-label="بستن"
            className="size-8 rounded-full bg-muted flex items-center justify-center"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* لیست آیتم‌ها */}
        <div className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleClick(item)}
                disabled={item.soon}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-right",
                  item.soon
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-muted"
                )}
              >
                <div
                  className={cn(
                    "size-11 rounded-xl flex items-center justify-center shrink-0",
                    item.color
                  )}
                >
                  <Icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{item.label}</span>
                    {item.soon && (
                      <span className="text-[9px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded">
                        به‌زودی
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {item.description}
                  </div>
                </div>
                <ChevronLeft className="size-4 text-muted-foreground shrink-0" />
              </button>
            );
          })}
        </div>

        {/* هشدار ورود */}
        {!isAuthenticated && (
          <div className="px-4 pb-3">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-center gap-2">
              <LogIn className="size-4 text-amber-600 shrink-0" />
              <p className="text-[11px] text-amber-800">
                برای ثبت آگهی، مورد اشیاء گمشده و درخواست ۱۳۷، ابتدا با شماره موبایل وارد شوید.
              </p>
            </div>
          </div>
        )}

        {/* فوتر */}
        <div className="px-4 py-2 border-t border-border/40">
          <button
            type="button"
            onClick={() => setPostMenuOpen(false)}
            className="w-full text-center text-xs text-muted-foreground font-bold py-2"
          >
            انصراف
          </button>
        </div>
      </div>
    </>
  );
}
