"use client";

import { classifieds } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ChevronLeft, MapPin, Clock } from "lucide-react";

export function ClassifiedsSection() {
  return (
    <section aria-label="نیازمندی‌ها" className="pt-5">
      <SectionHeader
        title="نیازمندی‌ها"
        subtitle="آگهی‌های فعال شهر قدس"
        actionLabel="همه آگهی‌ها"
      />

      <div className="relative">
        <div
          dir="rtl"
          className="flex gap-3 overflow-x-auto no-scrollbar px-4 py-2 snap-x snap-mandatory scroll-pl-4"
        >
          {classifieds.map((c) => (
            <article
              key={c.id}
              className={cn(
                "snap-start shrink-0 w-64 rounded-2xl bg-card border border-border/70",
                "shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              )}
            >
              <div className="flex items-stretch gap-3 p-3">
                {/* تصویر آگهی — اموجی روی گرادینت رنگی */}
                <div className="size-24 rounded-xl bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center text-4xl shrink-0 ring-1 ring-border/40">
                  {c.emoji}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <span
                      className={cn(
                        "inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-md mb-1",
                        c.badgeColor
                      )}
                    >
                      {c.category}
                    </span>
                    <h4 className="text-sm font-bold text-foreground leading-snug line-clamp-2">
                      {c.title}
                    </h4>
                  </div>

                  <div className="mt-1 space-y-1">
                    <p className="text-sm font-extrabold text-primary tabular-nums">
                      {c.price}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MapPin className="size-3" />
                      <span className="truncate">{c.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="size-3" />
                      <span>{c.timeAgo}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* فوتر کارت */}
              <div className="flex items-center justify-between px-3 py-2 border-t border-border/50 bg-muted/30">
                <button
                  type="button"
                  className="text-[11px] text-primary font-bold hover:underline"
                >
                  نمایش شماره
                </button>
                <button
                  type="button"
                  className="text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5"
                >
                  جزئیات
                  <ChevronLeft className="size-3" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  title,
  subtitle,
  actionLabel,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 mb-2">
      <div>
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <span className="inline-block w-1 h-4 bg-primary rounded-full" />
          {title}
        </h2>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {actionLabel && (
        <button
          type="button"
          className="text-[11px] text-primary font-medium flex items-center gap-0.5 hover:underline"
        >
          {actionLabel}
          <ChevronLeft className="size-3.5" />
        </button>
      )}
    </div>
  );
}
