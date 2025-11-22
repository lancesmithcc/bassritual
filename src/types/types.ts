export interface RampableParam {
    value: number;      // Target value
    rampTime?: number;  // Transition time in seconds
}

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

export interface VoiceStep {
    duration: number;   // Seconds
    params: Partial<VoiceConfig>;
}

export interface Scene {
    id: string;
    name: string;
    patterns: Record<string, VoiceStep[]>; // v1: [], v2: []
}
