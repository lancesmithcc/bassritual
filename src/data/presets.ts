import type { VoiceConfig } from '../types/types';

export interface PlanetaryTuning {
    id: string;
    name: string;
    color: string;
    symbol: string;
    description: string;
    voices: Partial<VoiceConfig>[];
}

export interface ConsciousnessState {
    id: string;
    name: string;
    rate: number;
    description: string;
}

export const CONSCIOUSNESS_STATES: ConsciousnessState[] = [
    { id: 'delta', name: 'DELTA (2.5Hz)', rate: 2.5, description: "in a state of deep regeneration." },
    { id: 'theta', name: 'THETA (6.0Hz)', rate: 6.0, description: "through the gateway of the subconscious." },
    { id: 'alpha', name: 'ALPHA (10.0Hz)', rate: 10.0, description: "with relaxed, lucid awareness." },
    { id: 'beta', name: 'BETA (20.0Hz)', rate: 20.0, description: "with active, analytical focus." },
    { id: 'gamma', name: 'GAMMA (40.0Hz)', rate: 40.0, description: "at the peak of cognitive processing." }
];

export const PLANETARY_TUNINGS: PlanetaryTuning[] = [
    {
        id: 'ohm',
        name: 'OHM (Earth)',
        color: '#39ff14', // Neon Green
        symbol: '🜨',
        description: "Connect with the Earth's primal vibration",
        voices: [
            { id: 'v1', enabled: true, frequency: { value: 136.10, rampTime: 3 }, dutyCycle: { value: 0.5 }, volume: { value: 0.9, rampTime: 2 } },
            { id: 'v2', enabled: true, frequency: { value: 204.15, rampTime: 3 }, dutyCycle: { value: 0.4 }, volume: { value: 0.7, rampTime: 2 } },
            { id: 'v3', enabled: true, frequency: { value: 68.05, rampTime: 3 }, dutyCycle: { value: 0.6 }, volume: { value: 0.8, rampTime: 2 } }
        ]
    },
    {
        id: 'sol',
        name: 'SOL (Sun)',
        color: '#FFD700', // Gold
        symbol: '☉',
        description: "Ignite your inner vitality and will",
        voices: [
            { id: 'v1', enabled: true, frequency: { value: 126.22, rampTime: 3 }, dutyCycle: { value: 0.6 }, volume: { value: 0.9, rampTime: 2 } },
            { id: 'v2', enabled: true, frequency: { value: 189.33, rampTime: 3 }, dutyCycle: { value: 0.4 }, volume: { value: 0.7, rampTime: 2 } },
            { id: 'v3', enabled: true, frequency: { value: 252.44, rampTime: 3 }, dutyCycle: { value: 0.3 }, volume: { value: 0.6, rampTime: 2 } }
        ]
    },
    {
        id: 'luna',
        name: 'LUNA (Moon)',
        color: '#E0FFFF', // Light Cyan
        symbol: '☾',
        description: "Flow with emotional tides and intuition",
        voices: [
            { id: 'v1', enabled: true, frequency: { value: 210.42, rampTime: 3 }, dutyCycle: { value: 0.5 }, volume: { value: 0.8, rampTime: 2 } },
            { id: 'v2', enabled: true, frequency: { value: 105.21, rampTime: 3 }, dutyCycle: { value: 0.4 }, volume: { value: 0.8, rampTime: 2 } },
            { id: 'v3', enabled: true, frequency: { value: 315.63, rampTime: 3 }, dutyCycle: { value: 0.3 }, volume: { value: 0.5, rampTime: 2 } }
        ]
    },
    {
        id: 'mercury',
        name: 'MERCURY',
        color: '#00BFFF', // Deep Sky Blue
        symbol: '☿',
        description: "Sharpen communication and intellect",
        voices: [
            { id: 'v1', enabled: true, frequency: { value: 141.27, rampTime: 3 }, dutyCycle: { value: 0.5 }, volume: { value: 0.9, rampTime: 2 } },
            { id: 'v2', enabled: true, frequency: { value: 211.90, rampTime: 3 }, dutyCycle: { value: 0.4 }, volume: { value: 0.7, rampTime: 2 } },
            { id: 'v3', enabled: true, frequency: { value: 70.63, rampTime: 3 }, dutyCycle: { value: 0.6 }, volume: { value: 0.8, rampTime: 2 } }
        ]
    },
    {
        id: 'venus',
        name: 'VENUS',
        color: '#FF69B4', // Hot Pink
        symbol: '♀',
        description: "Harmonize with the frequency of love",
        voices: [
            { id: 'v1', enabled: true, frequency: { value: 221.23, rampTime: 3 }, dutyCycle: { value: 0.5 }, volume: { value: 0.8, rampTime: 2 } },
            { id: 'v2', enabled: true, frequency: { value: 110.61, rampTime: 3 }, dutyCycle: { value: 0.4 }, volume: { value: 0.8, rampTime: 2 } },
            { id: 'v3', enabled: true, frequency: { value: 278.75, rampTime: 3 }, dutyCycle: { value: 0.3 }, volume: { value: 0.6, rampTime: 2 } }
        ]
    },
    {
        id: 'mars',
        name: 'MARS',
        color: '#FF4500', // Orange Red
        symbol: '♂',
        description: "Channel aggressive forward momentum",
        voices: [
            { id: 'v1', enabled: true, frequency: { value: 144.72, rampTime: 2 }, dutyCycle: { value: 0.7 }, volume: { value: 0.9, rampTime: 1 } },
            { id: 'v2', enabled: true, frequency: { value: 217.08, rampTime: 2 }, dutyCycle: { value: 0.4 }, volume: { value: 0.7, rampTime: 1 } },
            { id: 'v3', enabled: true, frequency: { value: 72.36, rampTime: 2 }, dutyCycle: { value: 0.6 }, volume: { value: 0.8, rampTime: 1 } }
        ]
    },
    {
        id: 'jupiter',
        name: 'JUPITER',
        color: '#9370DB', // Medium Purple
        symbol: '♃',
        description: "Expand your consciousness and abundance",
        voices: [
            { id: 'v1', enabled: true, frequency: { value: 183.58, rampTime: 4 }, dutyCycle: { value: 0.5 }, volume: { value: 0.9, rampTime: 2 } },
            { id: 'v2', enabled: true, frequency: { value: 91.79, rampTime: 4 }, dutyCycle: { value: 0.4 }, volume: { value: 0.8, rampTime: 2 } },
            { id: 'v3', enabled: true, frequency: { value: 367.16, rampTime: 4 }, dutyCycle: { value: 0.3 }, volume: { value: 0.6, rampTime: 2 } }
        ]
    },
    {
        id: 'saturn',
        name: 'SATURN',
        color: '#8A2BE2', // Blue Violet
        symbol: '♄',
        description: "Structure your reality with discipline",
        voices: [
            { id: 'v1', enabled: true, frequency: { value: 147.85, rampTime: 4 }, dutyCycle: { value: 0.5 }, volume: { value: 0.9, rampTime: 2 } },
            { id: 'v2', enabled: true, frequency: { value: 73.92, rampTime: 4 }, dutyCycle: { value: 0.4 }, volume: { value: 0.8, rampTime: 2 } },
            { id: 'v3', enabled: true, frequency: { value: 36.96, rampTime: 4 }, dutyCycle: { value: 0.6 }, volume: { value: 0.9, rampTime: 2 } }
        ]
    },
    {
        id: 'uranus',
        name: 'URANUS',
        color: '#00FFFF', // Aqua
        symbol: '♅',
        description: "Spark innovation and sudden change",
        voices: [
            { id: 'v1', enabled: true, frequency: { value: 207.36, rampTime: 3 }, dutyCycle: { value: 0.5 }, volume: { value: 0.8, rampTime: 2 } },
            { id: 'v2', enabled: true, frequency: { value: 311.04, rampTime: 3 }, dutyCycle: { value: 0.4 }, volume: { value: 0.7, rampTime: 2 } },
            { id: 'v3', enabled: true, frequency: { value: 103.68, rampTime: 3 }, dutyCycle: { value: 0.6 }, volume: { value: 0.8, rampTime: 2 } }
        ]
    },
    {
        id: 'neptune',
        name: 'NEPTUNE',
        color: '#20B2AA', // Light Sea Green
        symbol: '♆',
        description: "Dissolve boundaries into the mystical",
        voices: [
            { id: 'v1', enabled: true, frequency: { value: 211.44, rampTime: 5 }, dutyCycle: { value: 0.5 }, volume: { value: 0.8, rampTime: 2 } },
            { id: 'v2', enabled: true, frequency: { value: 105.72, rampTime: 5 }, dutyCycle: { value: 0.4 }, volume: { value: 0.8, rampTime: 2 } },
            { id: 'v3', enabled: true, frequency: { value: 317.16, rampTime: 5 }, dutyCycle: { value: 0.3 }, volume: { value: 0.6, rampTime: 2 } }
        ]
    },
    {
        id: 'pluto',
        name: 'PLUTO',
        color: '#DC143C', // Crimson
        symbol: '♇',
        description: "Undergo deep transformation and rebirth",
        voices: [
            { id: 'v1', enabled: true, frequency: { value: 140.25, rampTime: 4 }, dutyCycle: { value: 0.5 }, volume: { value: 0.9, rampTime: 2 } },
            { id: 'v2', enabled: true, frequency: { value: 70.12, rampTime: 4 }, dutyCycle: { value: 0.4 }, volume: { value: 0.8, rampTime: 2 } },
            { id: 'v3', enabled: true, frequency: { value: 35.06, rampTime: 4 }, dutyCycle: { value: 0.6 }, volume: { value: 0.9, rampTime: 2 } }
        ]
    },
    {
        id: 'chiron',
        name: 'CHIRON',
        color: '#40E0D0', // Turquoise
        symbol: '⚷',
        description: "Bridge the wound to find healing",
        voices: [
            { id: 'v1', enabled: true, frequency: { value: 172.86, rampTime: 3 }, dutyCycle: { value: 0.5 }, volume: { value: 0.9, rampTime: 2 } },
            { id: 'v2', enabled: true, frequency: { value: 259.29, rampTime: 3 }, dutyCycle: { value: 0.4 }, volume: { value: 0.7, rampTime: 2 } },
            { id: 'v3', enabled: true, frequency: { value: 86.43, rampTime: 3 }, dutyCycle: { value: 0.6 }, volume: { value: 0.8, rampTime: 2 } }
        ]
    }
];
