import * as Tone from 'tone';
import { Voice } from './Voice';
import type { VoiceConfig } from '../types/types';

class BassEngine {
    private static instance: BassEngine;
    private voices: Map<string, Voice> = new Map();
    private isInitialized: boolean = false;
    private limiter: Tone.Limiter | null = null;
    private analyser: Tone.Analyser | null = null;

    private constructor() { }

    public static getInstance(): BassEngine {
        if (!BassEngine.instance) {
            BassEngine.instance = new BassEngine();
        }
        return BassEngine.instance;
    }

    public async initialize() {
        if (this.isInitialized) return;

        await Tone.start();
        console.log("Tone.js Context Started");

        // Master Limiter to prevent clipping
        this.limiter = new Tone.Limiter(-1).toDestination();

        // Analyser for visuals
        this.analyser = new Tone.Analyser("waveform", 2048);
        this.limiter.connect(this.analyser);

        // Create 3 Voices
        ['v1', 'v2', 'v3'].forEach(id => {
            const voice = new Voice(id, this.limiter!);
            this.voices.set(id, voice);
        });

        Tone.Transport.start();
        this.isInitialized = true;
    }

    public updateVoice(config: VoiceConfig) {
        if (!this.isInitialized) return;
        const voice = this.voices.get(config.id);
        if (voice) {
            voice.update(config);
        }
    }

    public getAnalyser(): Tone.Analyser {
        if (!this.analyser) {
            throw new Error("Engine not initialized");
        }
        return this.analyser;
    }

    public stop() {
        Tone.Transport.stop();
        // this.voices.forEach(v => {
        //     // v.stop() if implemented
        // });
    }

    public getTransportState(): string {
        return Tone.Transport.state;
    }

    public queueScene(scene: any) { // TODO: Use Scene type properly
        // Simple sequencer implementation
        if (!scene.patterns) return;

        Object.entries(scene.patterns).forEach(([voiceId, steps]) => {
            let time = 0;
            (steps as any[]).forEach(step => {
                Tone.Transport.schedule((t) => {
                    // Merge params with voice id
                    // Note: This is a simplified update. Real update might need more logic.
                    this.updateVoice({ id: voiceId, ...step.params });
                }, time);
                time += step.duration;
            });
        });

        console.log("Scene Queued:", scene.name);
    }
}

export default BassEngine.getInstance();
