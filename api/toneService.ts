import type { VoiceConfig, RampableParam } from '../src/types/types';
import { BASE_VOICES } from '../src/data/baseVoices';
import { PLANETARY_TUNINGS, type PlanetaryTuning, CONSCIOUSNESS_STATES, type ConsciousnessState } from '../src/data/presets';
import { FIBONACCI_MODES, type FibonacciMode } from '../src/utils/fibonacci';

export interface ToneRequestPayload {
    planetId?: string;
    stateId?: string;
    fibModeId?: string;
    baseFrequency?: number;
    pulseRate?: number;
    voices?: Partial<VoiceConfig>[];
}

export interface ToneRecipe {
    voices: VoiceConfig[];
    context: {
        planet?: PlanetaryTuning;
        state?: ConsciousnessState;
        fibonacciMode?: FibonacciMode;
    };
    summary: {
        baseFrequencyHz: number;
        isochronicRateHz: number | null;
        voiceCount: number;
    };
    notes: string[];
}

const WAVEFORMS = ['sine', 'triangle', 'sawtooth'] as const;

function isFiniteNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value);
}

function cloneVoices(voices: VoiceConfig[]): VoiceConfig[] {
    return voices.map(v => ({
        ...v,
        frequency: { ...v.frequency },
        pulseRate: { ...v.pulseRate },
        dutyCycle: { ...v.dutyCycle },
        pulseShape: { ...v.pulseShape },
        volume: { ...v.volume },
        pan: { ...v.pan },
        filterCutoff: { ...v.filterCutoff }
    }));
}

function mergeRampable(base: RampableParam, incoming?: Partial<RampableParam> | number): RampableParam {
    if (incoming === undefined) return { ...base };
    if (typeof incoming === 'number') {
        return { value: incoming, rampTime: base.rampTime };
    }
    const value = isFiniteNumber(incoming.value) ? incoming.value : base.value;
    const rampTime = incoming.rampTime ?? base.rampTime;
    return { value, rampTime };
}

function mergeVoice(base: VoiceConfig, incoming?: Partial<VoiceConfig>): VoiceConfig {
    if (!incoming) return { ...base };

    const waveform = WAVEFORMS.includes(incoming.waveform as any)
        ? incoming.waveform as VoiceConfig['waveform']
        : base.waveform;

    return {
        ...base,
        id: incoming.id ?? base.id,
        enabled: typeof incoming.enabled === 'boolean' ? incoming.enabled : base.enabled,
        waveform,
        frequency: mergeRampable(base.frequency, incoming.frequency),
        pulseRate: mergeRampable(base.pulseRate, incoming.pulseRate),
        dutyCycle: mergeRampable(base.dutyCycle, incoming.dutyCycle),
        pulseShape: mergeRampable(base.pulseShape, incoming.pulseShape),
        volume: mergeRampable(base.volume, incoming.volume),
        pan: mergeRampable(base.pan, incoming.pan),
        filterCutoff: mergeRampable(base.filterCutoff, incoming.filterCutoff)
    };
}

function applyPlanet(voices: VoiceConfig[], planet?: PlanetaryTuning): VoiceConfig[] {
    if (!planet) return voices;
    return voices.map(v => {
        const match = planet.voices.find(pv => pv.id === v.id);
        return mergeVoice(v, match);
    });
}

function applyStatePulse(voices: VoiceConfig[], rate: number): VoiceConfig[] {
    if (!isFiniteNumber(rate) || rate <= 0) return voices;
    return voices.map(v => ({
        ...v,
        pulseRate: {
            value: rate,
            rampTime: v.pulseRate.rampTime ?? 2
        }
    }));
}

function applyFibonacciMode(
    voices: VoiceConfig[],
    mode: FibonacciMode | undefined,
    baseFrequency: number
): VoiceConfig[] {
    if (!mode || !isFiniteNumber(baseFrequency)) return voices;
    const freqs = mode.generator(baseFrequency);

    return voices.map((v, idx) => {
        if (idx >= freqs.length) return v;
        const freq = freqs[idx];
        return {
            ...v,
            enabled: true,
            frequency: { ...v.frequency, value: freq, rampTime: v.frequency.rampTime ?? 2 },
            // Make sure Fibonacci tones stay audible if user muted them earlier
            volume: v.volume.value < 0.1
                ? { ...v.volume, value: 0.8, rampTime: v.volume.rampTime ?? 1 }
                : v.volume
        };
    });
}

function applyVoiceOverrides(voices: VoiceConfig[], overrides?: Partial<VoiceConfig>[]): VoiceConfig[] {
    if (!overrides?.length) return voices;
    return voices.map(v => {
        const override = overrides.find(o => o.id === v.id);
        if (!override) return v;
        return mergeVoice(v, override);
    });
}

function deriveBaseFrequency(voices: VoiceConfig[]): number {
    const baseVoice = voices.find(v => v.enabled) ?? voices[0];
    return baseVoice?.frequency.value ?? BASE_VOICES[0].frequency.value;
}

function deriveCommonPulseRate(voices: VoiceConfig[]): number | null {
    if (!voices.length) return null;
    const first = voices[0].pulseRate.value;
    const allMatch = voices.every(v => v.pulseRate.value === first);
    return allMatch ? first : null;
}

export function buildToneRecipe(payload: ToneRequestPayload = {}): ToneRecipe {
    const planet = PLANETARY_TUNINGS.find(p => p.id === payload.planetId);
    const state = CONSCIOUSNESS_STATES.find(s => s.id === payload.stateId);
    const fibMode = FIBONACCI_MODES.find(f => f.id === payload.fibModeId);

    let workingVoices = cloneVoices(BASE_VOICES);
    const notes: string[] = [];

    workingVoices = applyPlanet(workingVoices, planet);

    const baseFrequency = isFiniteNumber(payload.baseFrequency)
        ? payload.baseFrequency
        : deriveBaseFrequency(workingVoices);

    const pulseRate = isFiniteNumber(payload.pulseRate)
        ? payload.pulseRate
        : state?.rate;

    if (isFiniteNumber(pulseRate)) {
        workingVoices = applyStatePulse(workingVoices, pulseRate);
    } else {
        notes.push('No state or pulseRate provided, keeping per-voice pulse rates.');
    }

    workingVoices = applyFibonacciMode(workingVoices, fibMode, baseFrequency);
    workingVoices = applyVoiceOverrides(workingVoices, payload.voices);

    const isochronicRateHz = deriveCommonPulseRate(workingVoices);
    if (!isochronicRateHz) {
        notes.push('Voices have different pulse rates; set pulseRate to a single value for isochronic synchrony.');
    }

    return {
        voices: workingVoices,
        context: {
            planet,
            state,
            fibonacciMode: fibMode
        },
        summary: {
            baseFrequencyHz: baseFrequency,
            isochronicRateHz,
            voiceCount: workingVoices.length
        },
        notes
    };
}
