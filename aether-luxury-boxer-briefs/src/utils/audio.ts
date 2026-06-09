/**
 * SPDX-License-Identifier: Apache-2.0
 */

// Sound state managed via localStorage for persistence across reloading
const STORAGE_KEY = 'aether_audio_muted';
let isMutedGlobal = typeof localStorage !== 'undefined' 
  ? localStorage.getItem(STORAGE_KEY) === 'true'
  : false;

const BGM_STORAGE_KEY = 'aether_bgm_enabled';
let bgmEnabledGlobal = typeof localStorage !== 'undefined'
  ? localStorage.getItem(BGM_STORAGE_KEY) !== 'false' // Default to true if not set
  : true;

let bgmContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let currentBgmActive = false;
let currentChordIndex = 0;
let scheduledOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
let sequencerInterval: any = null;

const IN_BROWSER = typeof window !== 'undefined';

// Luxury Ambient Pad Chord Progression (Eno-esque modular warm synth pads)
const CHORDS = [
  // 1. Em9: E2 (82.4Hz), G3 (196Hz), B3 (246.9Hz), D4 (293.7Hz), F#4 (370Hz)
  [82.41, 196.00, 246.94, 293.66, 369.99],
  // 2. Cmaj9: C2 (65.4Hz), G3 (196Hz), B3 (246.9Hz), E4 (329.6Hz), G4 (392Hz)
  [65.41, 196.00, 246.94, 329.63, 392.00],
  // 3. Gmaj7: G2 (98Hz), D3 (146.8Hz), B3 (246.9Hz), F#4 (370Hz), A4 (440Hz)
  [98.00, 146.83, 246.94, 369.99, 440.00],
  // 4. Asus4/7: A2 (110Hz), E3 (164.8Hz), G3 (196Hz), C#4 (277.2Hz), E4 (329.6Hz)
  [110.00, 164.81, 196.00, 277.18, 329.63]
];

export function isBGMEnabled(): boolean {
  return bgmEnabledGlobal;
}

export function isBGMRunning(): boolean {
  return currentBgmActive;
}

export function toggleBGM(): boolean {
  bgmEnabledGlobal = !bgmEnabledGlobal;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(BGM_STORAGE_KEY, String(bgmEnabledGlobal));
  }
  
  if (bgmEnabledGlobal && !isMutedGlobal) {
    startBGM();
  } else {
    stopBGM();
  }
  return bgmEnabledGlobal;
}

export function startBGM() {
  if (!IN_BROWSER) return;
  if (currentBgmActive) return;
  if (isMutedGlobal || !bgmEnabledGlobal) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    if (!bgmContext) {
      bgmContext = new AudioContextClass();
    }
    
    if (bgmContext.state === 'suspended') {
      bgmContext.resume();
    }
    
    if (!masterGain) {
      masterGain = bgmContext.createGain();
      masterGain.connect(bgmContext.destination);
    }
    
    // Increased background volume for richer audible presence
    masterGain.gain.setValueAtTime(0.20, bgmContext.currentTime);

    currentBgmActive = true;
    currentChordIndex = 0;
    
    // Play first chord immediately
    playNextBgmChord();
    
    // Cycle chords every 6.5 seconds with beautiful fade overlap
    if (sequencerInterval) {
      clearInterval(sequencerInterval);
    }
    sequencerInterval = setInterval(() => {
      if (currentBgmActive && !isMutedGlobal && bgmEnabledGlobal) {
        currentChordIndex = (currentChordIndex + 1) % CHORDS.length;
        playNextBgmChord();
      }
    }, 6500);

  } catch (e) {
    // Fail silently
  }
}

export function stopBGM() {
  currentBgmActive = false;
  if (sequencerInterval) {
    clearInterval(sequencerInterval);
    sequencerInterval = null;
  }
  
  // Fade out scheduled voices
  if (bgmContext) {
    const now = bgmContext.currentTime;
    scheduledOscillators.forEach(voice => {
      try {
        voice.gain.gain.cancelScheduledValues(now);
        voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
        voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
        setTimeout(() => {
          try {
            voice.osc.stop();
          } catch (e) {}
        }, 550);
      } catch (e) {}
    });
    scheduledOscillators = [];
  }
}

function playNextBgmChord() {
  if (!bgmContext || !masterGain || isMutedGlobal || !bgmEnabledGlobal) return;
  
  try {
    if (bgmContext.state === 'suspended') {
      bgmContext.resume();
    }
    
    const now = bgmContext.currentTime;
    const notes = CHORDS[currentChordIndex];
    
    const fadeInTime = 2.5;
    const sustainTime = 2.0;
    const fadeOutTime = 2.5;
    const totalTime = fadeInTime + sustainTime + fadeOutTime; // 7.0 seconds total chord voice duration
    
    notes.forEach((freq, idx) => {
      if (!bgmContext || !masterGain) return;
      const osc = bgmContext.createOscillator();
      const voiceGain = bgmContext.createGain();
      const filter = bgmContext.createBiquadFilter();
      
      // Detuned warm triangle/sine waves
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      
      // Slight detune for luxurious analog chorusing
      const detuneAmount = (Math.random() - 0.5) * 8; // -4 to +4 cents
      osc.detune.setValueAtTime(detuneAmount, now);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(idx === 0 ? 150 : 250, now);
      filter.frequency.exponentialRampToValueAtTime(idx === 0 ? 200 : 320, now + fadeInTime);
      filter.frequency.exponentialRampToValueAtTime(idx === 0 ? 120 : 180, now + totalTime);
      
      voiceGain.gain.setValueAtTime(0.0, now);
      // Increased target amplitude for each synth node
      const targetVolume = idx === 0 ? 0.40 : 0.22;
      voiceGain.gain.linearRampToValueAtTime(targetVolume, now + fadeInTime);
      voiceGain.gain.setValueAtTime(targetVolume, now + fadeInTime + sustainTime);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + totalTime);
      
      osc.connect(filter);
      filter.connect(voiceGain);
      voiceGain.connect(masterGain);
      
      osc.start(now);
      osc.stop(now + totalTime);
      
      const voiceItem = { osc, gain: voiceGain };
      scheduledOscillators.push(voiceItem);
      
      setTimeout(() => {
        scheduledOscillators = scheduledOscillators.filter(item => item !== voiceItem);
      }, totalTime * 1000 + 400);
    });
  } catch (error) {
    // Fail silently in restricted sandbox environment
  }
}

export function toggleMute(): boolean {
  isMutedGlobal = !isMutedGlobal;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, String(isMutedGlobal));
  }
  if (isMutedGlobal) {
    stopBGM();
  } else {
    if (bgmEnabledGlobal) {
      startBGM();
    }
  }
  return isMutedGlobal;
}

export function getMuteState(): boolean {
  return isMutedGlobal;
}

// 1. Play clean, minimal UI click sound via Web Audio API synth
export function playClickSound() {
  if (isMutedGlobal) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    // Gentle premium high-pitched chic
    osc.frequency.setValueAtTime(950, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.08);
    
    // Increased from 0.015 to 0.09
    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Fail silently in restricted sandbox
  }
}

// 2. Play soft slide/whoosh switch sound during navigation or color switch
export function playSwitchSound() {
  if (isMutedGlobal) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    // Slow luxurious sweep
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.25);
    
    // Increased from 0.02 to 0.12
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) {}
}

// 3. Dynamic Success/Add-to-Trunk premium synthesized acoustic chime
export function playSuccessSound() {
  if (isMutedGlobal) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const playChimeNote = (frequency: number, delayAction: number, decayAction: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + delayAction);
      
      // Increased from 0.025 to 0.14 for each note
      gain.gain.setValueAtTime(0.14, ctx.currentTime + delayAction);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delayAction + decayAction);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + delayAction);
      osc.stop(ctx.currentTime + delayAction + decayAction);
    };
    
    // Luxury chord arpeggio: C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz)
    playChimeNote(523.25, 0.0, 0.18);
    playChimeNote(659.25, 0.08, 0.22);
    playChimeNote(783.99, 0.16, 0.35);
  } catch (e) {}
}

// 4. Subtle, rapid haptic vibration feedback for mobile screen interaction
export function playHapticFeedback() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      // Gentle, tactile tap feedback (12ms vibrator pulse)
      navigator.vibrate(12);
    } catch (e) {
      // Safe fallback under restricted frame context
    }
  }
}
