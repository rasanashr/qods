"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Package,
  Building2,
  PackageSearch,
  Utensils,
  Phone,
  Newspaper,
  Image as ImageIcon,
  Settings,
  LogOut,
  ChevronLeft,
  ListOrdered,
} from "lucide-react";

const menu = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/users", label: "کاربران", icon: Users },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/properties", label: "املاک", icon: Building2 },
  { href: "/admin/lost-found", label: "اشیاء گمشده", icon: PackageSearch },
  { href: "/admin/classifieds", label: "نیازمندی‌ها", icon: ListOrdered },
  { href: "/admin/restaurants", label: "رستوران‌ها", icon: Utensils },
  { href: "/admin/sama137", label: "سامانه ۱۳۷", icon: Phone },
  { href: "/admin/news", label: "اخبار", icon: Newspaper },
  { href: "/admin/banners", label: "بنرها", icon: ImageIcon },
  { href: "/admin/settings", label: "تنظیمات", icon: Settings },
];

export function AdminSidebar({
  adminName,
  adminRole,
  onLogout,
}: {
  adminName: string;
  adminRole: string;
  onLogout: () => Promise<void>;
}) {
  const pathname = usePathname();

  return (
    <aside
      dir="rtl"
      className="hidden lg:flex flex-col w-64 bg-card border-l border-border/70 shadow-sm"
    >
      {/* لوگو */}
      <div className="p-4 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
            ق
          </div>
          <div>
            <div className="text-sm font-bold">شبکه قدس</div>
            <div className="text-[10px] text-muted-foreground">پنل مدیریت</div>
          </div>
        </div>
      </div>

      {/* منو */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
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

      {/* فوتر ساید‌بار — ادمین + خروج */}
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
  );
}

export const mobileMenu = menu;
