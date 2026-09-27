"use client";

import { useEffect } from "react";
import { useNav } from "@/lib/nav-store";
import { AppHeader } from "@/components/app/AppHeader";
import { ServiceGrid } from "@/components/app/ServiceGrid";
import { HeroCarousel } from "@/components/app/HeroCarousel";
import { ClassifiedsSection } from "@/components/app/ClassifiedsSection";
import { NewsSection } from "@/components/app/NewsSection";
import { AdBanner } from "@/components/app/AdBanner";
import { StoreSection } from "@/components/app/StoreSection";
import { AmlakPage } from "@/components/app/AmlakPage";
import { LostFoundPage } from "@/components/app/LostFoundPage";
import { Sama137Page } from "@/components/app/Sama137Page";
import { FoodOrderPage } from "@/components/app/FoodOrderPage";
import { StorePage } from "@/components/app/StorePage";
import { ProductDetailPage } from "@/components/app/ProductDetailPage";
import { AuthPage } from "@/components/app/AuthPage";
import { ProfilePage } from "@/components/app/ProfilePage";
import { ClassifiedsPage } from "@/components/app/ClassifiedsPage";
import { PostClassifiedForm } from "@/components/app/PostClassifiedForm";
import { PostLostFoundForm } from "@/components/app/PostLostFoundForm";
import { PostSama137Form } from "@/components/app/PostSama137Form";

export function HomeView() {
  const view = useNav((s) => s.view);
  const setView = useNav((s) => s.setView);

  // اسکرول به بالا هنگام تغییر ویو
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [view]);

  if (view === "amlak") {
    return <AmlakPage />;
  }

  if (view === "lostfound") {
    return <LostFoundPage />;
  }

  if (view === "sama137") {
    return <Sama137Page />;
  }

  if (view === "food") {
    return <FoodOrderPage />;
  }

  if (view === "store") {
    return <StorePage />;
  }

  if (view === "product-detail") {
    return <ProductDetailPage />;
  }

  if (view === "auth") {
    return <AuthPage />;
  }

  if (view === "profile") {
    return <ProfilePage />;
  }

  if (view === "classifieds") {
    return <ClassifiedsPage />;
  }

  if (view === "post-classified") {
    return <PostClassifiedForm />;
  }

  if (view === "post-lost-found") {
    return <PostLostFoundForm />;
  }

  if (view === "post-sama137") {
    return <PostSama137Form />;
  }

  // به‌روزرسانی state هنگام برگشت از منوی پایین
  void setView;

  return (
    <>
      <AppHeader />
      <main className="flex-1 overflow-y-auto thin-scrollbar bg-muted/30 pb-2">
        {/* گرید خدمات */}
        <ServiceGrid />

        {/* اسلایدر اصلی */}
        <HeroCarousel />

        {/* نیازمندی‌ها — کارت‌های افقی */}
        <ClassifiedsSection />

        {/* اخبار شهر */}
        <NewsSection />

        {/* بنر تبلیغاتی */}
        <AdBanner />

        {/* فروشگاه — لوازم خانگی */}
        <StoreSection />

        {/* فوتر کوچک */}
        <footer className="px-4 py-6 text-center">
          <div className="text-[11px] text-muted-foreground">
            شبکه قدس © ۱۴۰۴ — سوپر اپ شهروندان
          </div>
          <div className="text-[10px] text-muted-foreground/70 mt-0.5">
            ارائه شده توسط رسا نشر
          </div>
        </footer>
      </main>
    </>
  );
}
