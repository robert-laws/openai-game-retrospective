import { useRef } from 'react';
import { timelineData } from '../data/timelineData';

export function TimelineSection() {
  const railRef = useRef(null);

  const scrollRail = (direction) => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    const amount = rail.clientWidth * 0.72;
    rail.scrollBy({ left: amount * direction, behavior: 'smooth' });
  };

  const onRailKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollRail(1);
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollRail(-1);
    }
  };

  return (
    <section className="timeline-section container" aria-labelledby="timeline-title">
      <div className="section-heading" data-reveal>
        <p className="section-kicker">Era Milestones</p>
        <h2 id="timeline-title">The 1990s In Fast Forward</h2>
        <p>Browse major moments that moved gaming from cartridge roots into online and cinematic eras.</p>
      </div>

      <div className="timeline-controls" data-reveal>
        <button type="button" className="secondary-button" onClick={() => scrollRail(-1)}>
          Previous
        </button>
        <button type="button" className="secondary-button" onClick={() => scrollRail(1)}>
          Next
        </button>
      </div>

      <div
        className="timeline-rail"
        ref={railRef}
        tabIndex={0}
        onKeyDown={onRailKeyDown}
        aria-label="Timeline carousel"
        data-reveal
      >
        {timelineData.map((entry) => (
          <article className="timeline-card" key={`${entry.year}-${entry.event}`}>
            <p className="year">{entry.year}</p>
            <h3>{entry.event}</h3>
            {entry.platform ? <p className="platform-tag">{entry.platform}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
