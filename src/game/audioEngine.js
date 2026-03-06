const NOTE_PATTERN = [262, 330, 392, 523, 440, 392, 330, 294];
let noteIndex = 0;

let audioContext;
let masterGain;
let musicGain;
let musicOsc;
let musicTimer;
let audioEnabled = false;

const ensureGraph = () => {
  if (audioContext) {
    return;
  }

  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context) {
    return;
  }

  audioContext = new Context();
  masterGain = audioContext.createGain();
  masterGain.gain.value = 0.15;
  masterGain.connect(audioContext.destination);

  musicGain = audioContext.createGain();
  musicGain.gain.value = 0.0001;
  musicGain.connect(masterGain);

  musicOsc = audioContext.createOscillator();
  musicOsc.type = 'square';
  musicOsc.frequency.value = NOTE_PATTERN[0];
  musicOsc.connect(musicGain);
  musicOsc.start();

  musicTimer = window.setInterval(() => {
    if (!musicOsc || !audioContext) {
      return;
    }
    noteIndex = (noteIndex + 1) % NOTE_PATTERN.length;
    musicOsc.frequency.setValueAtTime(NOTE_PATTERN[noteIndex], audioContext.currentTime);
  }, 180);
};

const setMusicLevel = (target) => {
  if (!musicGain || !audioContext) {
    return;
  }
  musicGain.gain.cancelScheduledValues(audioContext.currentTime);
  musicGain.gain.linearRampToValueAtTime(target, audioContext.currentTime + 0.15);
};

const playTone = (frequency, duration, type = 'square', volume = 0.1) => {
  if (!audioEnabled || !audioContext) {
    return;
  }

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = volume;

  osc.connect(gain);
  gain.connect(masterGain);

  const now = audioContext.currentTime;
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.start(now);
  osc.stop(now + duration);
};

export const unlockAudio = async () => {
  ensureGraph();
  if (!audioContext) {
    return;
  }
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }
};

export const setAudioEnabled = async (enabled) => {
  audioEnabled = enabled;

  if (enabled) {
    await unlockAudio();
    setMusicLevel(0.08);
    return;
  }

  if (!audioContext) {
    return;
  }
  setMusicLevel(0.0001);
};

export const playJump = () => playTone(660, 0.12, 'square', 0.08);

export const playCollect = () => {
  playTone(1047, 0.08, 'triangle', 0.09);
  window.setTimeout(() => playTone(1319, 0.09, 'triangle', 0.08), 55);
};

export const playHit = () => playTone(165, 0.2, 'sawtooth', 0.12);

export const playWin = () => {
  playTone(784, 0.1, 'triangle', 0.09);
  window.setTimeout(() => playTone(988, 0.1, 'triangle', 0.09), 80);
  window.setTimeout(() => playTone(1319, 0.16, 'triangle', 0.1), 180);
};

export const disposeAudio = () => {
  if (musicTimer) {
    window.clearInterval(musicTimer);
    musicTimer = undefined;
  }
  if (musicOsc) {
    musicOsc.stop();
    musicOsc.disconnect();
    musicOsc = undefined;
  }
  if (musicGain) {
    musicGain.disconnect();
    musicGain = undefined;
  }
  if (masterGain) {
    masterGain.disconnect();
    masterGain = undefined;
  }
  if (audioContext) {
    audioContext.close();
    audioContext = undefined;
  }
};
