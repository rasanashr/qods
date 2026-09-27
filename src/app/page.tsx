import { MobileFrame } from "@/components/app/MobileFrame";
import { AppHeader } from "@/components/app/AppHeader";
import { ServiceGrid } from "@/components/app/ServiceGrid";
import { HeroCarousel } from "@/components/app/HeroCarousel";
import { ClassifiedsSection } from "@/components/app/ClassifiedsSection";
import { NewsSection } from "@/components/app/NewsSection";
import { AdBanner } from "@/components/app/AdBanner";
import { StoreSection } from "@/components/app/StoreSection";
import { BottomNav } from "@/components/app/BottomNav";
import { HomeView } from "@/components/app/HomeView";

export default function Home() {
  return (
    <MobileFrame>
      <HomeView />
      <BottomNav />
    </MobileFrame>
  );
}
