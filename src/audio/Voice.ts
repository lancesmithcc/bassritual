import * as Tone from 'tone';
import type { VoiceConfig, RampableParam } from '../types/types';

export class Voice {
    public id: string;

    // Nodes
    private oscillator: Tone.Oscillator;
    private pulseGain: Tone.Gain;
    private filter: Tone.Filter;
    private panner: Tone.Panner;
    private volume: Tone.Gain;
    private lfo: Tone.LFO;

    constructor(id: string, destination: Tone.ToneAudioNode) {
        this.id = id;

        // 1. Volume (Output)
        this.volume = new Tone.Gain(0).connect(destination);

        // 2. Panner
        this.panner = new Tone.Panner(0).connect(this.volume);

        // 3. Filter
        this.filter = new Tone.Filter(2000, "lowpass").connect(this.panner);

        // 4. Pulse Gain (Modulated by LFO)
        this.pulseGain = new Tone.Gain(0).connect(this.filter);

        // 5. Oscillator
        this.oscillator = new Tone.Oscillator(40, "sine").connect(this.pulseGain);

        // 6. LFO (Controls Pulse Gain)
        // Frequency: 6Hz, Min: 0, Max: 1
        this.lfo = new Tone.LFO(6, 0, 1).start();
        this.lfo.sync(); // Sync to Transport
        this.lfo.connect(this.pulseGain.gain);

        // Start Oscillator
        this.oscillator.start();
    }

    public update(config: VoiceConfig) {
        const now = Tone.now();

        // Enable/Disable (via Volume)
        if (!config.enabled) {
            this.volume.gain.rampTo(0, 0.1, now);
            return;
        }

        // Oscillator
        this.applyRamp(this.oscillator.frequency, config.frequency, now);
        if (this.oscillator.type !== config.waveform) {
            this.oscillator.type = config.waveform;
        }

        // Pulse (LFO)
        this.applyRamp(this.lfo.frequency, config.pulseRate, now);

        // Duty Cycle & Pulse Shape
        // Map pulseShape to LFO type. 
        // 0 = Triangle (Smoother than Square), 1 = Sine (Very smooth)
        // We avoid Square to prevent "farting" artifacts at low frequencies.
        if (config.pulseShape.value < 0.5) {
            this.lfo.type = "triangle";
        } else {
            this.lfo.type = "sine";
        }

        // Mix
        this.applyRamp(this.volume.gain, config.volume, now);
        this.applyRamp(this.panner.pan, config.pan, now);

        // Dynamic Filter Tracking
        // Track the oscillator frequency to remove harsh harmonics from low notes
        // We use a multiplier (8x) to keep the character but cut the clicky highs.
        // We clamp it to the user's filterCutoff setting.
        const targetFreq = config.frequency.value;
        const trackingFreq = Math.min(config.filterCutoff.value, targetFreq * 8);

        // Create a temporary target for the filter ramp
        const filterTarget = {
            value: trackingFreq,
            rampTime: config.frequency.rampTime // Sync with pitch change
        };

        this.applyRamp(this.filter.frequency, filterTarget, now);
    }

    private applyRamp(param: Tone.Param<any> | Tone.Signal<any>, target: RampableParam, now: number) {
        // Check if param has rampTo method (Tone.Param)
        if ('rampTo' in param) {
            (param as any).rampTo(target.value, target.rampTime || 0.1, now);
        } else {
            // Fallback for Signals if needed
            (param as any).value = target.value;
        }
    }
}
