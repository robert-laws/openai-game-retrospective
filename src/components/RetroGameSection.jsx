import { useMemo } from 'react';
import { useRetroGame } from '../game/useRetroGame';

const statusLabel = {
  ready: 'Ready',
  running: 'Running',
  won: 'Cleared',
  lost: 'Time Over'
};

export function RetroGameSection() {
  const { canvasRef, hud, audioOn, toggleAudio, queueJump, setMovement, resetState } = useRetroGame();

  const controls = useMemo(
    () => [
      { key: 'left', label: 'Left' },
      { key: 'right', label: 'Right' },
      { key: 'jump', label: 'Jump' }
    ],
    []
  );

  const startControl = (control) => (event) => {
    event.preventDefault();
    if (control === 'jump') {
      queueJump();
      return;
    }
    setMovement(control, true);
  };

  const stopControl = (control) => (event) => {
    event.preventDefault();
    if (control === 'jump') {
      return;
    }
    setMovement(control, false);
  };

  return (
    <section id="game-section" className="game-section container" aria-labelledby="game-title">
      <div className="section-heading" data-reveal>
        <p className="section-kicker">Playable Tribute</p>
        <h2 id="game-title">Pixel Side-Scroller</h2>
        <p>
          Use <strong>Arrow Left</strong>, <strong>Arrow Right</strong>, and <strong>Space</strong> to move.
          Collect rings, dodge hazards, and reach the finish gate before the timer expires.
        </p>
      </div>

      <div className="game-hud" data-reveal>
        <div className="hud-chip">
          <span>Score</span>
          <strong>{hud.score}</strong>
        </div>
        <div className="hud-chip">
          <span>Time</span>
          <strong>{hud.timeLeft}s</strong>
        </div>
        <div className="hud-chip">
          <span>Progress</span>
          <strong>{hud.progress}%</strong>
        </div>
        <div className="hud-chip">
          <span>Collectibles</span>
          <strong>
            {hud.collected}/{hud.totalCollectibles}
          </strong>
        </div>
        <div className="hud-chip">
          <span>Status</span>
          <strong>{statusLabel[hud.status]}</strong>
        </div>
      </div>

      <div className="game-actions" data-reveal>
        <button type="button" className="secondary-button" onClick={toggleAudio}>
          {audioOn ? 'Mute Chiptune' : 'Enable Chiptune'}
        </button>
        <button type="button" className="secondary-button" onClick={resetState}>
          Restart Level
        </button>
      </div>

      <div className="canvas-wrap" data-reveal>
        <canvas
          ref={canvasRef}
          className="game-canvas"
          aria-label="Retro side-scroller game area"
          role="img"
        />
      </div>

      <div className="touch-controls" aria-label="Touch game controls" data-reveal>
        {controls.map((control) => (
          <button
            key={control.key}
            type="button"
            className="touch-button"
            aria-label={control.label}
            onMouseDown={startControl(control.key)}
            onMouseUp={stopControl(control.key)}
            onMouseLeave={stopControl(control.key)}
            onTouchStart={startControl(control.key)}
            onTouchEnd={stopControl(control.key)}
            onTouchCancel={stopControl(control.key)}
          >
            {control.label}
          </button>
        ))}
      </div>
    </section>
  );
}
