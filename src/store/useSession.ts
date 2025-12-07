import { create } from 'zustand';
import type { VoiceConfig, Scene } from '../types/types';
import BassEngine from '../audio/BassEngine';
import { PLANETARY_TUNINGS, CONSCIOUSNESS_STATES } from '../data/presets';
import { FIBONACCI_MODES } from '../utils/fibonacci';
import { BASE_VOICES } from '../data/baseVoices';

const cloneVoice = (v: VoiceConfig): VoiceConfig => ({
    ...v,
    frequency: { ...v.frequency },
    pulseRate: { ...v.pulseRate },
    dutyCycle: { ...v.dutyCycle },
    pulseShape: { ...v.pulseShape },
    volume: { ...v.volume },
    pan: { ...v.pan },
    filterCutoff: { ...v.filterCutoff }
});

interface SessionState {
    voices: VoiceConfig[];
    masterVolume: number;
    scene: Scene | null;
    currentPlanetId: string | null;
    currentStateId: string | null;
    currentFibModeId: string | null;

    // Actions
    setVoiceParam: (voiceId: string, param: keyof VoiceConfig, value: any) => void;
    toggleVoice: (voiceId: string) => void;
    setMasterVolume: (vol: number) => void;
    loadPlanet: (planetId: string) => void;
    loadState: (stateId: string) => void;
    applyFibonacci: (mode: string) => void;
}

export const useSession = create<SessionState>((set) => ({
    voices: BASE_VOICES.map(cloneVoice),
    masterVolume: -6,
    scene: null,
    currentPlanetId: null,
    currentStateId: null,
    currentFibModeId: null,

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

    loadPlanet: (planetId: string) => {
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

    loadState: (stateId: string) => {
        const cState = CONSCIOUSNESS_STATES.find(s => s.id === stateId);
        if (!cState) return;

        set(state => {
            const newVoices = state.voices.map(v => {
                const newVoice = { ...v };
                // Update Pulse Rate for all voices to match the state
                newVoice.pulseRate = {
                    value: cState.rate,
                    rampTime: 4 // Slow transition for state change
                };

                BassEngine.updateVoice(newVoice);
                return newVoice;
            });
            return { voices: newVoices, currentStateId: stateId };
        });
    },

    applyFibonacci: (modeId: string) => {
        console.log(`Applying Fibonacci Mode: ${modeId}`);
        const mode = FIBONACCI_MODES.find(m => m.id === modeId);
        if (!mode) return;

        set(state => {
            // Get the first enabled voice's frequency as the base, or just the first voice
            const baseVoice = state.voices.find(v => v.enabled) || state.voices[0];
            if (!baseVoice) return state;

            const baseFreq = baseVoice.frequency.value;
            console.log(`Base Frequency: ${baseFreq}Hz`);

            const fibFreqs = mode.generator(baseFreq);
            console.log(`Generated Frequencies:`, fibFreqs);

            const newVoices = state.voices.map((v, i) => {
                if (i >= fibFreqs.length) return v;

                const newVoice = { ...v };
                newVoice.frequency = {
                    value: fibFreqs[i],
                    rampTime: 3
                };

                // Enable all voices for Fibonacci
                newVoice.enabled = true;

                // Ensure volume is audible if it was off
                if (newVoice.volume.value < 0.1) {
                    newVoice.volume = { ...newVoice.volume, value: 0.8, rampTime: 2 };
                }

                console.log(`Updating Voice ${newVoice.id}: ${newVoice.frequency.value}Hz`);
                BassEngine.updateVoice(newVoice);

                return newVoice;
            });

            return { voices: newVoices, currentFibModeId: modeId };
        });
    }
}));
