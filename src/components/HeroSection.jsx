import { useEffect, useRef } from 'react';

export function HeroSection({ reducedEffects, onToggleReducedEffects }) {
  const heroRef = useRef(null);
  const layerRef = useRef(null);
  const heroBackgroundUrl = `${import.meta.env.BASE_URL}assets/thumbnails/hero-bg.svg`;
  const heroPosterUrl = `${import.meta.env.BASE_URL}assets/thumbnails/showcase-arcade.svg`;
  const heroSidecarUrl = `${import.meta.env.BASE_URL}assets/thumbnails/showcase-console.svg`;

  useEffect(() => {
    if (reducedEffects) {
      if (layerRef.current) {
        layerRef.current.style.transform = 'translate3d(0, 0, 0)';
      }
      return;
    }

    const heroNode = heroRef.current;
    const layerNode = layerRef.current;
    if (!heroNode || !layerNode) {
      return;
    }

    const handleMove = (event) => {
      const rect = heroNode.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = ((event.clientX - centerX) / rect.width) * 30;
      const offsetY = ((event.clientY - centerY) / rect.height) * 18;
      layerNode.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    };

    heroNode.addEventListener('mousemove', handleMove);
    return () => heroNode.removeEventListener('mousemove', handleMove);
  }, [reducedEffects]);

  const scrollToGame = () => {
    const target = document.getElementById('game-section');
    if (!target) {
      return;
    }
    target.scrollIntoView({ behavior: reducedEffects ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <header className="hero" ref={heroRef}>
      <div
        className="hero-bg-layer"
        ref={layerRef}
        aria-hidden="true"
        style={{ '--hero-image': `url(${heroBackgroundUrl})` }}
      />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-content container">
        <div className="hero-copy" data-reveal>
          <p className="hero-kicker">Press Start On The Decade</p>
          <h1>1990s Gaming Retrospective</h1>
          <p>
            Retro pixels. Modern presentation. Play a side-scrolling tribute, browse the landmark releases,
            and relive the console wars with a cleaner, sharper visual language.
          </p>
          <div className="hero-marquee">
            <span>12 landmark games</span>
            <span>playable side-scroller</span>
            <span>pixel art showcase</span>
          </div>
          <div className="hero-actions">
            <button type="button" className="cta-button" onClick={scrollToGame}>
              Start The Journey
            </button>
            <button type="button" className="secondary-button" onClick={onToggleReducedEffects}>
              Toggle Reduced Effects
            </button>
          </div>
        </div>
        <div className="hero-visual" data-reveal>
          <article className="hero-poster hero-poster-primary">
            <img src={heroPosterUrl} alt="Arcade-inspired poster art" />
            <div className="hero-poster-copy">
              <span className="hero-poster-label">Featured Mood</span>
              <strong>Arcades, cartridges, and after-school marathons</strong>
            </div>
          </article>
          <article className="hero-poster hero-poster-secondary">
            <img src={heroSidecarUrl} alt="Living room console illustration" />
            <div className="hero-scoreboard">
              <div>
                <span>Era</span>
                <strong>1990-1999</strong>
              </div>
              <div>
                <span>Platforms</span>
                <strong>Console + PC + handheld</strong>
              </div>
              <div>
                <span>Style</span>
                <strong>Neon CRT / pixel modernism</strong>
              </div>
            </div>
          </article>
        </div>
      </div>
      <div className="hero-overlay" aria-hidden="true" />
    </header>
  );
}
