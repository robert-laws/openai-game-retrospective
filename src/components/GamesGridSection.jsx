import { gamesData } from '../data/gamesData';

const toEmbedUrl = (url) => {
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }
  return url;
};

export function GamesGridSection() {
  return (
    <section className="games-section container" aria-labelledby="games-title">
      <div className="section-heading" data-reveal>
        <p className="section-kicker">Hall Of Classics</p>
        <h2 id="games-title">12 Defining Games Of The 1990s</h2>
        <p>
          A curated cross-genre snapshot of titles that shaped design trends, player culture, and modern game
          development.
        </p>
      </div>

      <div className="games-grid">
        {gamesData.map((game) => (
          <article key={game.id} className="game-card" data-reveal>
            <img src={game.thumbnail} alt={`${game.title} pixel art thumbnail`} loading="lazy" />
            <div className="game-card-body">
              <h3>{game.title}</h3>
              <p className="meta">
                <span>{game.year}</span>
                <span>{game.platform}</span>
              </p>
              <p>{game.description}</p>
              <p className="fun-fact">
                <strong>Fun Fact:</strong> {game.funFact}
              </p>

              {game.embedTrailer ? (
                <div className="trailer-embed">
                  <iframe
                    src={toEmbedUrl(game.trailerUrl)}
                    title={`${game.title} trailer`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ) : (
                <a href={game.trailerUrl} target="_blank" rel="noreferrer" className="trailer-link">
                  Watch Trailer
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
