// pages/HomePage.tsx

import { About } from '@/components/home/About';
import Features from '@/components/home/Features';
import { Hero } from '@/components/home/Hero';
import Testimonials from '@/components/home/Testimonials';
import { AccessifyMarquee } from '@/components/shared/Marquee';
import CtaSection from '@/components/home/CtaSection';
import Footer from '@/components/shared/Footer';
import HomePageLightBackground from '@/components/shared/HomePageLightBackground';

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[linear-gradient(145deg,#ffffff_0%,#f5f8ff_48%,#fdf6fa_100%)] transition-colors duration-300 dark:bg-none dark:bg-slate-950">
      <main className="relative isolate w-full overflow-hidden px-0">
        <HomePageLightBackground />
        <Hero />
        <div className="-mt-4 sm:-mt-10">
          <AccessifyMarquee />
        </div>
        <div className="-mt-8 sm:-mt-30">
          <About />
        </div>
        <div className="-mt-12 sm:mt-0">
          <Features />
        </div>
        <div className="-mt-6 sm:-mt-280">
          <Testimonials />
        </div>
        <div className="-mt-20 sm:-mt-10">
          <CtaSection />
        </div>
        <div className="mt-8 sm:mt-12">
          <Footer />
        </div>
      </main>
    </div>
  );
}
