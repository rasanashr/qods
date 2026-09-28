import { MobileFrame } from "@/components/app/MobileFrame";
import { BottomNav } from "@/components/app/BottomNav";
import { HomeView } from "@/components/app/HomeView";
import { PostMenu } from "@/components/app/PostMenu";

export default function Home() {
  return (
    <MobileFrame>
      <HomeView />
      <BottomNav />
      <PostMenu />
    </MobileFrame>
  );
}
