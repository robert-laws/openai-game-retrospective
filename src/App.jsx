import { useEffect, useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { ShowcaseSection } from './components/ShowcaseSection';
import { RetroGameSection } from './components/RetroGameSection';
import { GamesGridSection } from './components/GamesGridSection';
import { TimelineSection } from './components/TimelineSection';
import { FooterSection } from './components/FooterSection';

const REDUCED_EFFECTS_KEY = 'retro.reduceEffects';

const getInitialReducedEffects = () => {
  const stored = window.localStorage.getItem(REDUCED_EFFECTS_KEY);
  if (stored === 'true') {
    return true;
  }
  if (stored === 'false') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export default function App() {
  const [reducedEffects, setReducedEffects] = useState(getInitialReducedEffects);

  useEffect(() => {
    window.localStorage.setItem(REDUCED_EFFECTS_KEY, String(reducedEffects));
    document.body.classList.toggle('reduced-effects', reducedEffects);
  }, [reducedEffects]);

  useEffect(() => {
    const revealTargets = document.querySelectorAll('[data-reveal]');

    if (reducedEffects) {
      revealTargets.forEach((item) => item.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [reducedEffects]);

  return (
    <div className="app-shell">
      <HeroSection
        reducedEffects={reducedEffects}
        onToggleReducedEffects={() => setReducedEffects((current) => !current)}
      />
      <main id="main-content">
        <ShowcaseSection />
        <RetroGameSection />
        <GamesGridSection />
        <TimelineSection />
      </main>
      <FooterSection />
    </div>
  );
}
