import { create } from 'zustand';
import type { VoiceConfig, Scene } from '../types/types';
import BassEngine from '../audio/BassEngine';
import { PLANETARY_TUNINGS, CONSCIOUSNESS_STATES } from '../data/presets';

interface SessionState {
    voices: VoiceConfig[];
    masterVolume: number;
    scene: Scene | null;
    currentPresetId: string | null;

    // Actions
    setVoiceParam: (voiceId: string, param: keyof VoiceConfig, value: any) => void;
    toggleVoice: (voiceId: string) => void;
    setMasterVolume: (vol: number) => void;
    loadPreset: (presetId: string) => void;
}

const initialVoices: VoiceConfig[] = [
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

export const useSession = create<SessionState>((set, get) => ({
    voices: initialVoices,
    masterVolume: -6,
    scene: null,
    currentPlanetId: null,
    currentStateId: null,

    setVoiceParam: (voiceId, param, value) => {
        set(state => {
            const newVoices = state.voices.map(v => {
                if (v.id === voiceId) {
                    const newVoice = { ...v, [param]: value };
                    // Update Audio Engine
                    BassEngine.updateVoice(newVoice);
                    return newVoice;
                }
                return v;
            });
            return { voices: newVoices };
        });
    },

    toggleVoice: (voiceId) => {
        set(state => {
            const newVoices = state.voices.map(v => {
                if (v.id === voiceId) {
                    const newVoice = { ...v, enabled: !v.enabled };
                    BassEngine.updateVoice(newVoice);
                    return newVoice;
                }
                return v;
            });
            return { voices: newVoices };
        });
    },

    setMasterVolume: (vol) => set({ masterVolume: vol }),

    loadPlanet: (planetId) => {
        const planet = PLANETARY_TUNINGS.find(p => p.id === planetId);
        if (!planet) return;

        // Apply Theme Color
        if (planet.color) {
            document.documentElement.style.setProperty('--color-primary', planet.color);
        }

        set(state => {
            const newVoices = state.voices.map(v => {
                const planetVoice = planet.voices.find(pv => pv.id === v.id);
                if (planetVoice) {
                    const mergedVoice = { ...v, ...planetVoice };

                    const mergeParam = (curr: any, target: any) => {
                        if (!target) return curr;
                        return { ...curr, ...target };
                    };

                    mergedVoice.frequency = mergeParam(v.frequency, planetVoice.frequency);
                    mergedVoice.dutyCycle = mergeParam(v.dutyCycle, planetVoice.dutyCycle);
                    mergedVoice.volume = mergeParam(v.volume, planetVoice.volume);

                    // Preserve current pulse rate from state (don't overwrite with planet defaults if any)
                    // Planet data no longer has pulseRate, so this is safe.

                    BassEngine.updateVoice(mergedVoice);
                    return mergedVoice;
                }
                return v;
            });
            return { voices: newVoices, currentPlanetId: planetId };
        });
    },

    loadState: (stateId) => {
        const cState = CONSCIOUSNESS_STATES.find(s => s.id === stateId);
        if (!cState) return;

        set(state => {
            const newVoices = state.voices.map(v => {
                const newVoice = { ...v };
                // Update Pulse Rate for all voices to match the state
                // We might want slight variations per voice for phasing?
                // For now, sync them all to the state rate.

                // Optional: Add slight detune to pulse rate for richness?
                // Let's keep it simple first.

                newVoice.pulseRate = {
                    value: cState.rate,
                    rampTime: 4 // Slow transition for state change
                };

                BassEngine.updateVoice(newVoice);
                return newVoice;
            });
            return { voices: newVoices, currentStateId: stateId };
        });
    }
}));
