import { useEffect, useRef } from 'react';

export function HeroSection({ reducedEffects, onToggleReducedEffects }) {
  const heroRef = useRef(null);
  const layerRef = useRef(null);
  const heroBackgroundUrl = `${import.meta.env.BASE_URL}assets/thumbnails/hero-bg.svg`;

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
      <div className="hero-content container" data-reveal>
        <p className="hero-kicker">Press Start On The Decade</p>
        <h1>1990s Gaming Retrospective</h1>
        <p>
          Retro pixels. Modern presentation. Play a side-scrolling tribute and revisit the games that shaped
          a generation.
        </p>
        <div className="hero-actions">
          <button type="button" className="cta-button" onClick={scrollToGame}>
            Start The Journey
          </button>
          <button type="button" className="secondary-button" onClick={onToggleReducedEffects}>
            Toggle Reduced Effects
          </button>
        </div>
      </div>
      <div className="hero-overlay" aria-hidden="true" />
    </header>
  );
}
