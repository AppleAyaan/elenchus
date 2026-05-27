import { HeroSection } from "@/components/hero/hero-section";
import { DemoSection } from "@/components/sections/demo-section";

export default function Home() {
  return (
    <main className="h-screen snap-y snap-mandatory overflow-y-auto bg-[#f5f5f0]">
      <HeroSection />
      <DemoSection />
    </main>
  );
}
