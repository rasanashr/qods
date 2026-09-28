"use client";

import { useEffect, useMemo, useState } from "react";
import { useNav } from "@/lib/nav-store";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Search,
  Flame,
  Package,
  Search as SearchIcon,
  Newspaper,
  Building2,
  PackageSearch,
  ListOrdered,
  MapPin,
  Clock,
  Tag,
  TrendingUp,
} from "lucide-react";

type FeedItem = {
  id: string;
  type: "classified" | "lostfound" | "news" | "property";
  title: string;
  description: string;
  emoji: string;
  badge?: string;
  badgeColor?: string;
  location?: string;
  timeAgo?: string;
  price?: string;
  href?: string;
};

type Tab = "all" | "classified" | "lostfound" | "news" | "property";

const tabs: { id: Tab; label: string; emoji: string }[] = [
  { id: "all", label: "همه", emoji: "📋" },
  { id: "classified", label: "نیازمندی‌ها", emoji: "📢" },
  { id: "lostfound", label: "اشیاء گمشده", emoji: "🔍" },
  { id: "news", label: "اخبار", emoji: "📰" },
  { id: "property", label: "املاک", emoji: "🏠" },
];

export function DiscoverPage() {
  const setView = useNav((s) => s.setView);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");

  // بارگذاری همه داده‌ها از API‌های عمومی
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [classifiedsRes, lostFoundRes, newsRes, propertiesRes] = await Promise.all([
          fetch("/api/public/classifieds"),
          fetch("/api/public/lost-found"),
          fetch("/api/public/news"),
          fetch("/api/public/properties"),
        ]);

        const [classifiedsData, lostFoundData, newsData, propertiesData] = await Promise.all([
          classifiedsRes.json(),
          lostFoundRes.json(),
          newsRes.json(),
          propertiesRes.json(),
        ]);

        if (!active) return;

        const feed: FeedItem[] = [];

        // آگهی‌های نیازمندی‌ها
        if (Array.isArray(classifiedsData.items)) {
          classifiedsData.items.slice(0, 20).forEach((it: Record<string, unknown>) => {
            feed.push({
              id: `c-${it.id as string}`,
              type: "classified",
              title: it.title as string,
              description: (it.description as string) || "",
              emoji: (it.emoji as string) || "📦",
              badge: (it.categoryLabel as string) || "نیازمندی",
              badgeColor: (it.badgeColor as string) || "bg-emerald-50 text-emerald-700",
              location: it.location as string,
              timeAgo: it.timeAgo as string,
              price: it.price as string,
            });
          });
        }

        // اشیاء گمشده
        if (Array.isArray(lostFoundData.items)) {
          lostFoundData.items.slice(0, 20).forEach((it: Record<string, unknown>) => {
            feed.push({
              id: `lf-${it.id as string}`,
              type: "lostfound",
              title: it.title as string,
              description: (it.description as string) || "",
              emoji: (it.emoji as string) || "📦",
              badge: it.status === "lost" ? "گم‌شده" : "پیدا‌شده",
              badgeColor: it.status === "lost" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700",
              location: it.location as string,
              timeAgo: it.timeAgo as string,
            });
          });
        }

        // اخبار
        if (Array.isArray(newsData.news)) {
          newsData.news.slice(0, 10).forEach((it: Record<string, unknown>) => {
            feed.push({
              id: `n-${it.id as string}`,
              type: "news",
              title: it.title as string,
              description: (it.excerpt as string) || "",
              emoji: (it.emoji as string) || "📰",
              badge: (it.category as string) || "خبر",
              badgeColor: "bg-cyan-50 text-cyan-700",
              timeAgo: it.timeAgo as string,
            });
          });
        }

        // املاک
        if (Array.isArray(propertiesData.properties)) {
          propertiesData.properties.slice(0, 15).forEach((it: Record<string, unknown>) => {
            feed.push({
              id: `p-${it.id as string}`,
              type: "property",
              title: it.title as string,
              description: `${it.dealLabel || ""} · ${it.location || ""}`,
              emoji: (it.emoji as string) || "🏠",
              badge: (it.dealLabel as string) || "املاک",
              badgeColor: (it.badgeColor as string) || "bg-teal-50 text-teal-700",
              location: it.location as string,
              timeAgo: it.timeAgo as string,
              price: it.price as string,
            });
          });
        }

        setItems(feed);
      } catch {
        // ignore
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // فیلتر و مرتب‌سازی
  const filtered = useMemo(() => {
    let list = items.slice();
    if (activeTab !== "all") {
      list = list.filter((it) => it.type === activeTab);
    }
    if (query.trim()) {
      const q = query.trim();
      list = list.filter(
        (it) =>
          it.title.includes(q) ||
          it.description.includes(q) ||
          (it.location && it.location.includes(q))
      );
    }
    return list;
  }, [items, activeTab, query]);

  // آمار سریع
  const stats = useMemo(() => {
    return {
      classified: items.filter((i) => i.type === "classified").length,
      lostfound: items.filter((i) => i.type === "lostfound").length,
      news: items.filter((i) => i.type === "news").length,
      property: items.filter((i) => i.type === "property").length,
      total: items.length,
    };
  }, [items]);

  const handleItemClick = (item: FeedItem) => {
    switch (item.type) {
      case "classified":
        setView("classifieds");
        break;
      case "lostfound":
        setView("lostfound");
        break;
      case "news":
        setView("home");
        break;
      case "property":
        setView("amlak");
        break;
    }
  };

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
            <h1 className="text-base font-bold">کاوش</h1>
            <p className="text-[11px] text-white/80">
              {stats.total.toLocaleString("fa-IR")} مورد در شبکه قدس
            </p>
          </div>
        </div>

        {/* جعبه جستجو */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-white/95 rounded-xl px-3 py-2.5 shadow-sm">
            <Search className="size-4.5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو در همه آگهی‌ها، اخبار، املاک…"
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto thin-scrollbar bg-muted/30 pb-2">
        {/* آمار سریع */}
        <section className="px-4 pt-3">
          <div className="grid grid-cols-4 gap-2">
            <StatCard
              value={stats.classified.toLocaleString("fa-IR")}
              label="آگهی"
              emoji="📢"
              onClick={() => setView("classifieds")}
            />
            <StatCard
              value={stats.lostfound.toLocaleString("fa-IR")}
              label="اشیاء"
              emoji="🔍"
              onClick={() => setView("lostfound")}
            />
            <StatCard
              value={stats.property.toLocaleString("fa-IR")}
              label="املاک"
              emoji="🏠"
              onClick={() => setView("amlak")}
            />
            <StatCard
              value={stats.news.toLocaleString("fa-IR")}
              label="اخبار"
              emoji="📰"
              onClick={() => setView("home")}
            />
          </div>
        </section>

        {/* تب‌های فیلتر */}
        <section className="pt-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-4">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  activeTab === t.id
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-card border border-border/70 text-foreground hover:bg-muted"
                )}
              >
                <span>{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* عنوان لیست */}
        <section className="px-4 pt-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            {activeTab === "all" ? "آخرین موارد" : tabs.find((t) => t.id === activeTab)?.label}
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {filtered.length.toLocaleString("fa-IR")} مورد یافت شد
          </p>
        </section>

        {/* لیست feed */}
        <section className="px-4 pt-3 pb-4 space-y-2">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="size-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin mx-auto mb-3" />
              <p className="text-sm">در حال بارگذاری…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-5xl mb-2">🔍</div>
              <p className="text-sm">موردی یافت نشد</p>
            </div>
          ) : (
            filtered.map((item) => (
              <FeedCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
            ))
          )}
        </section>

        {/* فوتر */}
        <footer className="px-4 py-6 text-center">
          <div className="text-[11px] text-muted-foreground">
            کاوش شبکه قدس © ۱۴۰۴
          </div>
          <div className="text-[10px] text-muted-foreground/70 mt-0.5">
            ارائه شده توسط رسا نشر
          </div>
        </footer>
      </main>
    </>
  );
}

function StatCard({
  value,
  label,
  emoji,
  onClick,
}: {
  value: string;
  label: string;
  emoji: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-card border border-border/70 rounded-xl p-2 text-center shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="text-base">{emoji}</div>
      <div className="mt-0.5 text-base font-extrabold text-foreground tabular-nums">{value}</div>
      <div className="text-[9px] text-muted-foreground">{label}</div>
    </button>
  );
}

function FeedCard({ item, onClick }: { item: FeedItem; onClick: () => void }) {
  const typeIcons = {
    classified: ListOrdered,
    lostfound: PackageSearch,
    news: Newspaper,
    property: Building2,
  };
  const TypeIcon = typeIcons[item.type];
  const typeLabels = {
    classified: "نیازمندی",
    lostfound: "اشیاء گمشده",
    news: "خبر",
    property: "املاک",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-right bg-card border border-border/70 rounded-xl p-3 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        {/* آیکن */}
        <div className="size-12 rounded-lg bg-muted flex items-center justify-center text-2xl shrink-0">
          {item.emoji}
        </div>

        <div className="flex-1 min-w-0">
          {/* نشان‌ها */}
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md", item.badgeColor || "bg-muted")}>
              {item.badge}
            </span>
            <span className="text-[9px] text-muted-foreground inline-flex items-center gap-0.5">
              <TypeIcon className="size-2.5" />
              {typeLabels[item.type]}
            </span>
          </div>

          <h4 className="text-sm font-bold leading-snug line-clamp-2">{item.title}</h4>

          {item.description && (
            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* فوتر کارت */}
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground min-w-0">
              {item.price && (
                <span className="font-bold text-primary tabular-nums truncate">
                  {item.price}
                </span>
              )}
              {item.location && (
                <span className="inline-flex items-center gap-0.5 truncate">
                  <MapPin className="size-2.5 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </span>
              )}
            </div>
            {item.timeAgo && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground shrink-0">
                <Clock className="size-2.5" />
                {item.timeAgo}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
