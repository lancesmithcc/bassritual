import type { VoiceConfig } from '../types/types';

export const BASE_VOICES: VoiceConfig[] = [
    {
        id: 'v1', enabled: true,
        frequency: { value: 40, rampTime: 2 }, waveform: 'sine',
        pulseRate: { value: 6, rampTime: 2 }, dutyCycle: { value: 0.5 }, pulseShape: { value: 0 },
        volume: { value: 1, rampTime: 0.5 }, pan: { value: 0 }, filterCutoff: { value: 2000 }
    },
    {
        id: 'v2', enabled: true,
        frequency: { value: 72, rampTime: 2 }, waveform: 'sine',
        pulseRate: { value: 8, rampTime: 2 }, dutyCycle: { value: 0.3 }, pulseShape: { value: 0 },
        volume: { value: 0.8, rampTime: 0.5 }, pan: { value: -0.2 }, filterCutoff: { value: 2000 }
    },
    {
        id: 'v3', enabled: false,
        frequency: { value: 110, rampTime: 2 }, waveform: 'sine',
        pulseRate: { value: 4, rampTime: 2 }, dutyCycle: { value: 0.5 }, pulseShape: { value: 0 },
        volume: { value: 0.6, rampTime: 0.5 }, pan: { value: 0.2 }, filterCutoff: { value: 1000 }
    }
];
