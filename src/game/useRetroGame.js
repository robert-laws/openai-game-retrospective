import { useCallback, useEffect, useRef, useState } from 'react';
import {
  disposeAudio,
  playCollect,
  playHit,
  playJump,
  playWin,
  setAudioEnabled,
  unlockAudio
} from './audioEngine';

const AUDIO_ENABLED_KEY = 'retro.audioEnabled';

const VIEW_WIDTH = 960;
const VIEW_HEIGHT = 320;
const GROUND_Y = 262;
const LEVEL_END_X = 3200;
const START_TIME = 90;
const PLAYER_SPEED = 260;
const JUMP_VELOCITY = 560;
const GRAVITY = 1480;

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

const intersectsRect = (a, b) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

const intersectsCircle = (rect, circle) => {
  const closestX = clamp(circle.x, rect.x, rect.x + rect.w);
  const closestY = clamp(circle.y, rect.y, rect.y + rect.h);
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  return dx * dx + dy * dy <= circle.r * circle.r;
};

const makeCollectibles = () => {
  const points = [
    [240, 210],
    [360, 186],
    [520, 220],
    [690, 210],
    [860, 180],
    [1020, 220],
    [1220, 200],
    [1410, 190],
    [1600, 220],
    [1780, 200],
    [1980, 176],
    [2160, 220],
    [2340, 190],
    [2540, 170],
    [2720, 220],
    [2940, 188]
  ];

  return points.map(([x, y], index) => ({ id: `coin-${index}`, x, y, r: 12, collected: false }));
};

const makeObstacles = () => [
  { id: 'obs-1', x: 460, y: 228, w: 40, h: 34 },
  { id: 'obs-2', x: 760, y: 212, w: 46, h: 50 },
  { id: 'obs-3', x: 1160, y: 218, w: 64, h: 44 },
  { id: 'obs-4', x: 1480, y: 206, w: 48, h: 56 },
  { id: 'obs-5', x: 1860, y: 218, w: 60, h: 44 },
  { id: 'obs-6', x: 2240, y: 214, w: 42, h: 48 },
  { id: 'obs-7', x: 2640, y: 204, w: 52, h: 58 },
  { id: 'obs-8', x: 2860, y: 218, w: 56, h: 44 }
];

const createInitialState = () => ({
  score: 0,
  timeLeft: START_TIME,
  status: 'ready',
  player: {
    x: 62,
    y: GROUND_Y - 44,
    w: 30,
    h: 44,
    vx: 0,
    vy: 0,
    onGround: true
  },
  collectibles: makeCollectibles(),
  obstacles: makeObstacles(),
  hitCooldown: 0,
  cameraX: 0,
  completion: 0
});

const toHudState = (state) => {
  const collectedCount = state.collectibles.filter((item) => item.collected).length;
  return {
    score: state.score,
    status: state.status,
    timeLeft: Math.max(0, Math.ceil(state.timeLeft)),
    progress: Math.round(state.completion),
    collected: collectedCount,
    totalCollectibles: state.collectibles.length
  };
};

const drawBackground = (ctx, cameraX) => {
  const skyGradient = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  skyGradient.addColorStop(0, '#100328');
  skyGradient.addColorStop(1, '#182b5c');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

  ctx.globalAlpha = 0.24;
  for (let i = 0; i < 70; i += 1) {
    const x = ((i * 131) % VIEW_WIDTH) - ((cameraX * 0.1) % VIEW_WIDTH);
    const y = (i * 53) % 170;
    ctx.fillStyle = i % 2 ? '#b8f8ff' : '#d4d3ff';
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.globalAlpha = 1;

  const mountainOffset = cameraX * 0.35;
  ctx.fillStyle = '#272f73';
  for (let i = -2; i < 10; i += 1) {
    const baseX = i * 180 - (mountainOffset % 180);
    ctx.beginPath();
    ctx.moveTo(baseX, GROUND_Y);
    ctx.lineTo(baseX + 90, 140);
    ctx.lineTo(baseX + 180, GROUND_Y);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = '#0b1837';
  ctx.fillRect(0, GROUND_Y, VIEW_WIDTH, VIEW_HEIGHT - GROUND_Y);

  for (let x = -32; x < VIEW_WIDTH + 32; x += 32) {
    ctx.fillStyle = (Math.floor((x + cameraX) / 32) % 2 === 0) ? '#1d2960' : '#152150';
    ctx.fillRect(x, GROUND_Y, 32, 28);
    ctx.fillStyle = '#0f1640';
    ctx.fillRect(x, GROUND_Y + 28, 32, VIEW_HEIGHT - (GROUND_Y + 28));
  }
};

const drawObstacles = (ctx, obstacles, cameraX) => {
  obstacles.forEach((obstacle) => {
    const x = obstacle.x - cameraX;
    const y = obstacle.y;
    if (x + obstacle.w < -8 || x > VIEW_WIDTH + 8) {
      return;
    }

    ctx.fillStyle = '#ff4f87';
    ctx.fillRect(x, y, obstacle.w, obstacle.h);
    ctx.fillStyle = '#201445';
    for (let i = 0; i < obstacle.w; i += 12) {
      ctx.beginPath();
      ctx.moveTo(x + i, y);
      ctx.lineTo(x + i + 6, y - 10);
      ctx.lineTo(x + i + 12, y);
      ctx.closePath();
      ctx.fill();
    }
  });
};

const drawCollectibles = (ctx, collectibles, cameraX) => {
  collectibles.forEach((collectible) => {
    if (collectible.collected) {
      return;
    }

    const x = collectible.x - cameraX;
    const y = collectible.y;
    if (x + collectible.r < -8 || x - collectible.r > VIEW_WIDTH + 8) {
      return;
    }

    ctx.strokeStyle = '#ffe16a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, collectible.r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#ff9d00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, collectible.r - 4, 0, Math.PI * 2);
    ctx.stroke();
  });
};

const drawGoal = (ctx, cameraX) => {
  const flagX = LEVEL_END_X - cameraX;
  ctx.fillStyle = '#d6e7ff';
  ctx.fillRect(flagX, 110, 6, 152);
  ctx.fillStyle = '#43f6ff';
  ctx.fillRect(flagX + 6, 116, 50, 34);
  ctx.fillStyle = '#0e1a3f';
  ctx.fillRect(flagX + 12, 123, 12, 10);
  ctx.fillRect(flagX + 30, 123, 12, 10);
};

const drawPlayer = (ctx, player, cameraX, status) => {
  const x = player.x - cameraX;
  const y = player.y;
  if (status === 'lost') {
    ctx.globalAlpha = 0.55;
  }

  ctx.fillStyle = '#29b6ff';
  ctx.fillRect(x, y, player.w, player.h);

  ctx.fillStyle = '#ffed93';
  ctx.fillRect(x + 4, y + 6, player.w - 8, 12);

  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(x + 6, y + 10, 4, 4);
  ctx.fillRect(x + player.w - 10, y + 10, 4, 4);

  ctx.fillStyle = '#2a5fff';
  ctx.fillRect(x + 2, y + player.h - 8, player.w - 4, 6);

  ctx.globalAlpha = 1;
};

const drawStatusOverlay = (ctx, status) => {
  if (status === 'running') {
    return;
  }

  ctx.fillStyle = 'rgba(9, 11, 28, 0.64)';
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

  ctx.fillStyle = '#d8efff';
  ctx.font = '28px "Press Start 2P", monospace';
  ctx.textAlign = 'center';

  if (status === 'ready') {
    ctx.fillText('PRESS ARROWS + SPACE', VIEW_WIDTH / 2, VIEW_HEIGHT / 2 - 8);
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.fillStyle = '#89ffcd';
    ctx.fillText('TO BEGIN THE STAGE', VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + 32);
  }

  if (status === 'won') {
    ctx.fillText('LEVEL CLEARED', VIEW_WIDTH / 2, VIEW_HEIGHT / 2 - 8);
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.fillStyle = '#89ffcd';
    ctx.fillText('PRESS RESTART FOR ANOTHER RUN', VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + 32);
  }

  if (status === 'lost') {
    ctx.fillText('TIME OVER', VIEW_WIDTH / 2, VIEW_HEIGHT / 2 - 8);
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.fillStyle = '#ff86ba';
    ctx.fillText('PRESS RESTART TO TRY AGAIN', VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + 32);
  }
};

export const useRetroGame = () => {
  const canvasRef = useRef(null);
  const stateRef = useRef(createInitialState());
  const controlsRef = useRef({ left: false, right: false, jumpQueued: false });
  const rafRef = useRef();
  const hudClockRef = useRef(0);

  const [audioOn, setAudioOn] = useState(() => window.localStorage.getItem(AUDIO_ENABLED_KEY) === 'true');
  const [hud, setHud] = useState(toHudState(stateRef.current));

  const resetState = useCallback(() => {
    stateRef.current = createInitialState();
    hudClockRef.current = 0;
    setHud(toHudState(stateRef.current));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(AUDIO_ENABLED_KEY, String(audioOn));
    setAudioEnabled(audioOn);
  }, [audioOn]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.target instanceof HTMLElement) {
        const interactive = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'];
        if (interactive.includes(event.target.tagName)) {
          return;
        }
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        controlsRef.current.left = true;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        controlsRef.current.right = true;
      }

      if (event.key === ' ' || event.code === 'Space') {
        event.preventDefault();
        controlsRef.current.jumpQueued = true;
      }
    };

    const onKeyUp = (event) => {
      if (event.key === 'ArrowLeft') {
        controlsRef.current.left = false;
      }
      if (event.key === 'ArrowRight') {
        controlsRef.current.right = false;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const queueJump = useCallback(() => {
    controlsRef.current.jumpQueued = true;
  }, []);

  const setMovement = useCallback((direction, active) => {
    if (direction === 'left') {
      controlsRef.current.left = active;
    }
    if (direction === 'right') {
      controlsRef.current.right = active;
    }
  }, []);

  const toggleAudio = useCallback(async () => {
    if (!audioOn) {
      await unlockAudio();
    }
    setAudioOn((current) => !current);
  }, [audioOn]);

  useEffect(() => {
    const updateGame = (delta) => {
      const state = stateRef.current;
      const controls = controlsRef.current;

      state.hitCooldown = Math.max(0, state.hitCooldown - delta);

      if (state.status === 'ready' && (controls.left || controls.right || controls.jumpQueued)) {
        state.status = 'running';
      }

      const player = state.player;

      if (state.status === 'running') {
        state.timeLeft -= delta;
        if (state.timeLeft <= 0) {
          state.timeLeft = 0;
          state.status = 'lost';
        }

        player.vx = 0;
        if (controls.left) {
          player.vx -= PLAYER_SPEED;
        }
        if (controls.right) {
          player.vx += PLAYER_SPEED;
        }

        if (controls.jumpQueued && player.onGround) {
          player.vy = -JUMP_VELOCITY;
          player.onGround = false;
          playJump();
        }

        controls.jumpQueued = false;

        player.vy += GRAVITY * delta;
        player.x += player.vx * delta;
        player.y += player.vy * delta;

        if (player.x < 0) {
          player.x = 0;
        }
        if (player.x > LEVEL_END_X - player.w) {
          player.x = LEVEL_END_X - player.w;
        }

        if (player.y + player.h >= GROUND_Y) {
          player.y = GROUND_Y - player.h;
          player.vy = 0;
          player.onGround = true;
        }

        for (const obstacle of state.obstacles) {
          if (!intersectsRect(player, obstacle)) {
            continue;
          }
          if (state.hitCooldown > 0) {
            continue;
          }

          state.score = Math.max(0, state.score - 25);
          state.hitCooldown = 0.9;
          player.x = Math.max(0, player.x - 110);
          player.vx = 0;
          player.vy = -220;
          player.onGround = false;
          playHit();
        }

        for (const collectible of state.collectibles) {
          if (collectible.collected) {
            continue;
          }

          if (!intersectsCircle(player, collectible)) {
            continue;
          }

          collectible.collected = true;
          state.score += 100;
          playCollect();
        }

        if (player.x >= LEVEL_END_X - 80) {
          state.status = 'won';
          state.score += Math.max(0, Math.floor(state.timeLeft * 2));
          playWin();
        }
      }

      state.completion = clamp((player.x / LEVEL_END_X) * 100, 0, 100);
      state.cameraX = clamp(player.x - VIEW_WIDTH * 0.35, 0, LEVEL_END_X - VIEW_WIDTH);
    };

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      const pixelRatio = window.devicePixelRatio || 1;
      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;

      const expectedWidth = Math.floor(cssWidth * pixelRatio);
      const expectedHeight = Math.floor(cssHeight * pixelRatio);
      if (canvas.width !== expectedWidth || canvas.height !== expectedHeight) {
        canvas.width = expectedWidth;
        canvas.height = expectedHeight;
      }

      const scaleX = cssWidth / VIEW_WIDTH;
      const scaleY = cssHeight / VIEW_HEIGHT;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      ctx.setTransform(pixelRatio * scaleX, 0, 0, pixelRatio * scaleY, 0, 0);

      const state = stateRef.current;
      drawBackground(ctx, state.cameraX);
      drawGoal(ctx, state.cameraX);
      drawObstacles(ctx, state.obstacles, state.cameraX);
      drawCollectibles(ctx, state.collectibles, state.cameraX);
      drawPlayer(ctx, state.player, state.cameraX, state.status);
      drawStatusOverlay(ctx, state.status);
    };

    let previousTime = performance.now();

    const frame = (time) => {
      const delta = Math.min(0.033, (time - previousTime) / 1000);
      previousTime = time;

      updateGame(delta);
      render();

      hudClockRef.current += delta;
      if (hudClockRef.current >= 0.08) {
        hudClockRef.current = 0;
        setHud(toHudState(stateRef.current));
      }

      rafRef.current = window.requestAnimationFrame(frame);
    };

    rafRef.current = window.requestAnimationFrame(frame);

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
      disposeAudio();
    };
  }, []);

  return {
    canvasRef,
    hud,
    audioOn,
    toggleAudio,
    queueJump,
    setMovement,
    resetState
  };
};
