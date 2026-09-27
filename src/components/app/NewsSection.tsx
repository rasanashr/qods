"use client";

import { useEffect, useState } from "react";
import { news as fallbackNews } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ChevronLeft, Clock, BookOpen } from "lucide-react";

type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  timeAgo: string;
  readTime: string;
  emoji: string;
  accent: string;
};

export function NewsSection() {
  const [newsList, setNewsList] = useState<NewsItem[]>(fallbackNews);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/public/news");
        const data = await res.json();
        if (active && Array.isArray(data.news) && data.news.length > 0) {
          setNewsList(data.news);
        }
      } catch {
        // fallback
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (newsList.length === 0) return null;
  const [featured, ...rest] = newsList;

  return (
    <section aria-label="اخبار شهر قدس" className="pt-5">
      <div className="flex items-center justify-between px-4 mb-2">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="inline-block w-1 h-4 bg-primary rounded-full" />
            اخبار شهر
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            آخرین رویدادهای قدس
          </p>
        </div>
        <button
          type="button"
          className="text-[11px] text-primary font-medium flex items-center gap-0.5 hover:underline"
        >
          همه اخبار
          <ChevronLeft className="size-3.5" />
        </button>
      </div>

      <div className="px-4 space-y-3">
        {/* خبر اصلی بزرگ */}
        <article className="rounded-2xl bg-card border border-border/70 shadow-sm overflow-hidden">
          <div className="flex items-stretch">
            <div className="relative w-28 bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center text-5xl shrink-0">
              {featured.emoji}
              <span
                className={cn(
                  "absolute top-2 left-2 size-2 rounded-full ring-2 ring-card",
                  featured.accent,
                  "animate-pulse-dot"
                )}
                aria-hidden
              />
            </div>
            <div className="flex-1 min-w-0 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                  {featured.category}
                </span>
                <span className="text-[10px] text-rose-600 font-medium flex items-center gap-0.5">
                  <span className="size-1.5 rounded-full bg-rose-500" />
                  زنده
                </span>
              </div>
              <h3 className="text-sm font-bold leading-snug line-clamp-2">
                {featured.title}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {featured.excerpt}
              </p>
              <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {featured.timeAgo}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="size-3" />
                  {featured.readTime}
                </span>
              </div>
            </div>
          </div>
        </article>

        {/* بقیه خبرها — لیست فشرده */}
        <div className="space-y-2">
          {rest.map((n) => (
            <article
              key={n.id}
              className="flex items-stretch gap-3 rounded-xl bg-card border border-border/70 p-2 hover:shadow-sm transition-shadow"
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-lg flex items-center justify-center text-2xl shrink-0",
                  "bg-gradient-to-br from-muted to-muted/60 ring-1 ring-border/40"
                )}
              >
                {n.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className={cn(
                      "inline-block w-1.5 h-1.5 rounded-full",
                      n.accent
                    )}
                  />
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {n.category}
                  </span>
                </div>
                <h4 className="text-xs font-bold leading-snug line-clamp-1">
                  {n.title}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                  {n.excerpt}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Clock className="size-2.5" />
                    {n.timeAgo}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <BookOpen className="size-2.5" />
                    {n.readTime}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
