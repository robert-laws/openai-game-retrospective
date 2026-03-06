const BASE = `${import.meta.env.BASE_URL}assets/thumbnails/`;

const showcaseItems = [
  {
    title: 'Arcade Fever',
    image: `${BASE}showcase-arcade.svg`,
    blurb: 'Fighting games, cabinet crowds, and neon marquees made public play feel like an event.'
  },
  {
    title: 'Living Room Legends',
    image: `${BASE}showcase-console.svg`,
    blurb: 'Cartridge and CD systems turned weekends into split-screen rivalries and epic save files.'
  },
  {
    title: 'Portable Obsession',
    image: `${BASE}showcase-handheld.svg`,
    blurb: 'Link cables and backpack handhelds kept the decade alive long after leaving the TV behind.'
  }
];

export function ShowcaseSection() {
  return (
    <section className="showcase-section container" aria-labelledby="showcase-title">
      <div className="showcase-copy section-heading" data-reveal>
        <p className="section-kicker">Memory Card Gallery</p>
        <h2 id="showcase-title">Why The Decade Still Feels Electric</h2>
        <p>
          The 1990s were not one aesthetic. They were arcades, couch co-op, late-night RPG saves, and
          handheld trades. This section gives the page a stronger visual identity before dropping into the
          playable tribute and retrospective catalog.
        </p>
      </div>

      <div className="showcase-grid">
        {showcaseItems.map((item) => (
          <article className="showcase-card" key={item.title} data-reveal>
            <img src={item.image} alt={item.title} loading="lazy" />
            <div className="showcase-card-body">
              <h3>{item.title}</h3>
              <p>{item.blurb}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="showcase-stats" data-reveal>
        <div className="showcase-stat">
          <strong>12</strong>
          <span>era-defining games</span>
        </div>
        <div className="showcase-stat">
          <strong>3</strong>
          <span>distinct play spaces</span>
        </div>
        <div className="showcase-stat">
          <strong>1</strong>
          <span>playable tribute</span>
        </div>
      </div>
    </section>
  );
}
