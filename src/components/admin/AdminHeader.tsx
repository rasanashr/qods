"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { mobileMenu } from "./AdminSidebar";

export function AdminHeader({
  adminName,
  adminRole,
  onLogout,
}: {
  adminName: string;
  adminRole: string;
  onLogout: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header
        dir="rtl"
        className="lg:hidden sticky top-0 z-40 bg-card border-b border-border/70 shadow-sm"
      >
        <div className="px-4 py-2.5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="باز کردن منو"
            className="size-9 rounded-lg bg-muted flex items-center justify-center"
          >
            <Menu className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
              ق
            </div>
            <span className="text-sm font-bold">شبکه قدس · پنل مدیریت</span>
          </div>
        </div>
      </header>

      {/* دراور موبایل */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          dir="rtl"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <aside
            className="relative w-72 max-w-[85%] bg-card shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  ق
                </div>
                <div>
                  <div className="text-sm font-bold">شبکه قدس</div>
                  <div className="text-[10px] text-muted-foreground">پنل مدیریت</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="بستن"
                className="size-8 rounded-lg bg-muted flex items-center justify-center"
              >
                <X className="size-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
              {mobileMenu.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                      active
                        ? "bg-primary text-primary-foreground font-bold"
                        : "text-foreground/80 hover:bg-muted"
                    )}
                  >
                    <Icon className="size-4.5 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {active && <ChevronLeft className="size-4" />}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-border/70 p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {adminName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate">{adminName}</div>
                  <div className="text-[10px] text-muted-foreground">{adminRole}</div>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
              >
                <LogOut className="size-4" />
                خروج از حساب
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
