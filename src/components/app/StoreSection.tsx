"use client";

import { useEffect, useState } from "react";
import { products as fallbackProducts, type ProductItem } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useNav } from "@/lib/nav-store";
import { ChevronLeft, Star, Wallet, ShoppingBag } from "lucide-react";

export function StoreSection() {
  const openProduct = useNav((s) => s.openProduct);
  const [products, setProducts] = useState<ProductItem[]>(fallbackProducts);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/public/products");
        const data = await res.json();
        if (active && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      } catch {
        // fallback
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section aria-label="فروشگاه قدس" className="pt-5 pb-2">
      <div className="flex items-center justify-between px-4 mb-2">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="inline-block w-1 h-4 bg-primary rounded-full" />
            فروشگاه قدس
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            لوازم خانگی با خرید قسطی
          </p>
        </div>
        <button
          type="button"
          className="text-[11px] text-primary font-medium flex items-center gap-0.5 hover:underline"
        >
          همه محصولات
          <ChevronLeft className="size-3.5" />
        </button>
      </div>

      <div
        dir="rtl"
        className="flex gap-3 overflow-x-auto no-scrollbar px-4 py-2 snap-x snap-mandatory"
      >
        {products.map((p) => (
          <article
            key={p.id}
            onClick={() => openProduct(p.id)}
            className={cn(
              "snap-start shrink-0 w-44 rounded-2xl bg-card border border-border/70 shadow-sm",
              "hover:shadow-md transition-shadow overflow-hidden flex flex-col cursor-pointer"
            )}
          >
            {/* تصویر محصول */}
            <div
              className={cn(
                "relative aspect-square flex items-center justify-center text-5xl",
                p.bg
              )}
            >
              {p.emoji}
              {p.discount && (
                <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow">
                  ٪{p.discount.toLocaleString("fa-IR")} تخفیف
                </span>
              )}
              <button
                type="button"
                aria-label="افزودن به سبد خرید"
                className="absolute bottom-2 left-2 size-8 rounded-full bg-white/95 text-primary shadow-md flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <ShoppingBag className="size-4" />
              </button>
            </div>

            {/* اطلاعات محصول */}
            <div className="p-3 flex-1 flex flex-col">
              <span className="text-[10px] text-muted-foreground font-medium">
                {p.brand}
              </span>
              <h4 className="text-xs font-bold leading-snug line-clamp-2 mt-0.5 min-h-[2rem]">
                {p.name}
              </h4>

              {/* امتیاز */}
              <div className="mt-1.5 flex items-center gap-1">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span className="text-[11px] font-bold tabular-nums">
                  {p.rating.toLocaleString("fa-IR")}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  ({p.soldCount} فروش)
                </span>
              </div>

              {/* قیمت */}
              <div className="mt-2 space-y-0.5">
                {p.originalPrice && (
                  <span className="text-[10px] text-muted-foreground line-through tabular-nums">
                    {p.originalPrice}
                  </span>
                )}
                <p className="text-sm font-extrabold text-primary tabular-nums">
                  {p.price}
                </p>
              </div>

              {/* خرید قسطی */}
              <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-1 rounded-md self-start">
                <Wallet className="size-3" />
                <span className="font-medium">{p.installment}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
