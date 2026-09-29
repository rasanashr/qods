"use client";

import { services } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useNav } from "@/lib/nav-store";

export function ServiceGrid() {
  const setView = useNav((s) => s.setView);

  const handleClick = (id: string) => {
    // خدمات شهری، املاک، اشیاء گمشده، سفارش غذا، فروشگاه، نیازمندی‌ها و سیم کارت پیاده‌سازی شده
    if (id === "khadamat-shahri") {
      setView("city-services");
    } else if (id === "ashyae-gomshode") {
      setView("lostfound");
    } else if (id === "sefare-ghaza") {
      setView("food");
    } else if (id === "foroushgah") {
      setView("store");
    } else if (id === "niazmandiha") {
      setView("classifieds");
    } else if (id === "amlak") {
      setView("amlak");
    } else if (id === "sim-card") {
      setView("sim-card");
    } else if (id === "khadamat-zibaei") {
      setView("beauty");
    } else if (id === "payamresan") {
      setView("messenger");
    }
  };

  return (
    <section aria-label="خدمات شبکه قدس" className="px-4 py-4">
      <div className="grid grid-cols-4 gap-x-2 gap-y-4">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handleClick(s.id)}
              aria-label={s.label}
              className="group flex flex-col items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl p-1"
            >
              <div className="relative">
                <div
                  className={cn(
                    "size-14 rounded-2xl flex items-center justify-center transition-transform group-active:scale-95 group-hover:shadow-md",
                    s.iconBg
                  )}
                >
                  <Icon className={cn("size-6", s.iconColor)} strokeWidth={1.9} />
                </div>
                {s.badge && (
                  <span
                    className={cn(
                      "absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full",
                      "bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center",
                      "ring-2 ring-card"
                    )}
                  >
                    {s.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium text-foreground/85 text-center leading-tight">
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
