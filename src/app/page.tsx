import { MotionConfig } from "motion/react";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Problem } from "@/components/landing/problem";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { Cta } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { JsonLd } from "@/components/landing/json-ld";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-[100dvh] bg-[#F8F7FC] text-[#151B45] antialiased">
        <JsonLd />
        <Header />
        <Hero />
        <Stats />
        <Problem />
        <HowItWorks />
        <Features />
        <Testimonials />
        <Pricing />
        <Faq />
        <Cta />
        <Footer />
      </main>
    </MotionConfig>
  );
}
