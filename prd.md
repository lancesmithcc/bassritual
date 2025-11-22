PRD: BASS RITUAL CONSOLEVersion: 1.0Status: Ready for DevelopmentPlatform: Web (Desktop First)Core Concept: A browser-based, code-centric soundstation for rhythmic low-frequency meditation.1. Product VisionThe Vibe: A "Hacker’s Meditation Tool." The user controls a precise, high-fidelity audio engine using a raw, monochrome terminal interface.The Visual Hook: A strict ASCII text interface overlaying a smooth, high-frame-rate, neon-green oscilloscope visualization.The Audio Hook: Three interlocking bass voices that pulse in perfect mathematical synchronization, capable of morphing properties over time without audio glitches.2. Technical ArchitectureComponentTechnologyReasonFrameworkReact + ViteFast HMR, functional component architecture.LanguageTypeScriptStrict typing required for the complex data models.StateZustandGlobal store to bridge the UI (React) and Audio (Tone.js).Audio EngineTone.js (v14.7+)Web Audio wrapper for scheduling and signal processing.VisualsHTML5 CanvasHigh-performance 2D rendering for the background waveform.HostingNetlifyStatic site deployment.3. Audio Engine SpecificationsThis is the core of the product. The engine must run independently of the UI render cycle to prevent stutter.3.1. The Sync Guarantee (Critical)To ensure the "hypnotic" effect, voices must never drift.Clock Source: Tone.Transport is the single source of truth.LFO Locking: All amplitude modulation is driven by Tone.LFO nodes with .sync() enabled. This locks the pulse phase to the Transport timeline. Changing speed (Hz) does not reset the phase.3.2. Signal Path (Per Voice)Code snippet[Tone.Oscillator] --> [Tone.GainNode (Pulse)] --> [Tone.Filter] --> [Tone.Panner] --> [Master Bus]
                                ^
                                |
                        [Tone.LFO (Synced)]
3.3. Morphing Logic (The "Glide")Rule: No parameter changes instantly.Implementation: All updates use param.rampTo(value, time).Result: If the user changes pitch from 40Hz to 60Hz, the engine slides the frequency over the defined duration, creating a "siren" or "doppler" effect rather than a step change.4. Visual Design & UX4.1. The Layering StrategyThe app consists of two distinct visual layers sitting in a stack (CSS Z-Index):Layer 0 (Background): The OscilloscopeTech: HTML5 Canvas (<canvas>).Appearance: A single, neon-green (#39ff14) line drawing the Master Output waveform.Effect: "Phosphor Persistence" (fading trails) and subtle glow.Reference:Getty ImagesLayer 1 (Foreground): The TerminalTech: React DOM overlaid on top.Style: Transparent background. Monospace font (Fira Code / VT323).Elements: Text-based sliders, tables, and status indicators.4.2. Interaction ModelMouse: Minimal usage.Keyboard: Primary control method.Arrows: Navigate the grid.[ / ]: Decrease/Increase values.Space: Play/Pause.1-9: Trigger Scene Switch.5. Data Model (TypeScript Interfaces)This schema defines how the app thinks.TypeScript// 1. The Morphable Value
export interface RampableParam {
  value: number;      // Target value
  rampTime?: number;  // Transition time in seconds
}

// 2. The Voice State
export interface VoiceConfig {
  id: string;         // "v1", "v2", "v3"
  enabled: boolean;
  
  // Oscillator
  frequency: RampableParam; // 20-200Hz
  waveform: 'sine' | 'triangle' | 'sawtooth'; 
  
  // The Pulse (Rhythm)
  pulseRate: RampableParam; // LFO Frequency (Hz)
  dutyCycle: RampableParam; // LFO Pulse Width (0.1 - 0.9)
  pulseShape: RampableParam; // 0 (Square) to 1 (Sine)
  
  // Mix
  volume: RampableParam;
  pan: RampableParam;
  filterCutoff: RampableParam;
}

// 3. The Sequencer Data
export interface VoiceStep {
  duration: number;   // Seconds
  params: Partial<VoiceConfig>;
}

export interface Scene {
  id: string;
  name: string;
  patterns: Record<string, VoiceStep[]>; // v1: [], v2: []
}
6. UI View ModesMode A: The Mixer (Live)A dashboard showing the current state of the 3 voices.Dynamic Feedback: The numbers for FREQ and RATE must update visually as they ramp in the audio engine.Plaintext┌── BASS RITUAL ─────────────────────────────────────────┐
│ MASTER: -6dB | TIME: 142.5s | SCENE: [2] DEEP DIVE     │
├────────────────────────────────────────────────────────┤
│ > V1 [ON]  FREQ: 40.0Hz   PULSE: 6.0Hz   DUTY: 50%     │
│   V2 [ON]  FREQ: 72.0Hz   PULSE: 8.0Hz   DUTY: 30%     │
│   V3 [OFF] ...                                         │
└────────────────────────────────────────────────────────┘
Mode B: The Pattern EditorA tracker-style table for defining the VoiceStep arrays.7. Implementation RoadmapPhase 1: The Skeleton (Days 1-2)Task: Set up React + Vite + Tone.js.Deliverable: A blank screen that plays a 40Hz sine wave when you click "Start."Files: BassEngine.ts, App.tsx.Phase 2: The Visuals (Day 3)Task: Implement the Layering (Canvas behind text).Deliverable: A neon waveform that reacts to the sine wave, with static ASCII text floating on top.Files: Visualizer.tsx, Layout.css.Phase 3: The Control (Days 4-5)Task: Build the Zustand store and connect UI inputs to the Engine.Deliverable: You can change the pitch and speed using keyboard controls, and hear the smooth "gliding" transitions.Files: useSession.ts, Dashboard.tsx.Phase 4: The Sequencer (Day 6)Task: Implement queueScene logic.Deliverable: The ability to script a 2-minute composition where the bass evolves automatically.8. Constraints & SafetyAutoplay: The app must show a "Press Any Key to Initialize" screen to satisfy browser AudioContext policies.Limiter: A hard limiter at -1dB is required on the Master Output to prevent digital clipping when 3 bass voices sum together.