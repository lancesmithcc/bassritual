import { useEffect } from 'react';
import { useSession } from '../store/useSession';
import './Dashboard.css';
import BassEngine from '../audio/BassEngine';
import * as Tone from 'tone';
import { PLANETARY_TUNINGS, CONSCIOUSNESS_STATES } from '../data/presets';
import Knob from './Knob';
import Slider from './Slider';

export default function Dashboard() {
    const { voices, toggleVoice, setVoiceParam } = useSession();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === ' ') {
                if (BassEngine.getTransportState() === 'started') {
                    BassEngine.stop();
                } else {
                    BassEngine.initialize().then(() => Tone.Transport.start());
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="lcars-container">
            <div className="lcars-header-row">
                <div className="lcars-elbow-top"></div>
                <div className="lcars-header-bar">
                    <span className="lcars-title">
                        ACUTONICS // CONSOLE
                        <span className="lcars-symbol">
                            {PLANETARY_TUNINGS.find(p => p.id === useSession.getState().currentPlanetId)?.symbol || ""}
                        </span>
                    </span>
                    <div className="status-bar">
                        <span className="preset-selector">
                            PLANET:
                            <select
                                className="preset-dropdown"
                                onChange={(e) => useSession.getState().loadPlanet(e.target.value)}
                                value={useSession.getState().currentPlanetId || ""}
                            >
                                <option value="" disabled>SELECT</option>
                                {PLANETARY_TUNINGS.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </span>
                        <span className="preset-selector" style={{ marginLeft: '20px' }}>
                            STATE:
                            <select
                                className="preset-dropdown"
                                onChange={(e) => useSession.getState().loadState(e.target.value)}
                                value={useSession.getState().currentStateId || ""}
                            >
                                <option value="" disabled>SELECT</option>
                                {CONSCIOUSNESS_STATES.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </span>
                    </div>
                </div>
            </div>

            <div className="lcars-body-row">
                <div className="lcars-sidebar">
                    <div className="lcars-block"></div>
                    <div className="lcars-block"></div>
                    <div className="lcars-block-fill"></div>
                </div>

                <div className="lcars-content">
                    <div className="voice-panel">
                        {voices.map((v) => (
                            <div key={v.id} className={`voice-row ${v.enabled ? 'active' : 'inactive'}`}>
                                <div
                                    className={`voice-indicator ${v.enabled ? 'on' : 'off'}`}
                                    onClick={() => toggleVoice(v.id)}
                                    style={{ cursor: 'pointer' }}
                                ></div>
                                <span className="voice-id">
                                    {v.id.toUpperCase()}
                                </span>

                                <div className="voice-controls">
                                    <Knob
                                        label="FREQ"
                                        value={v.frequency.value}
                                        min={20}
                                        max={400}
                                        onChange={(val) => setVoiceParam(v.id, 'frequency', { ...v.frequency, value: val })}
                                        unit="Hz"
                                        decimals={1}
                                    />
                                    <Knob
                                        label="PULSE"
                                        value={v.pulseRate.value}
                                        min={0.5}
                                        max={50}
                                        onChange={(val) => setVoiceParam(v.id, 'pulseRate', { ...v.pulseRate, value: val })}
                                        unit="Hz"
                                        decimals={1}
                                    />
                                    <Slider
                                        label="DUTY"
                                        value={v.dutyCycle.value * 100}
                                        min={10}
                                        max={90}
                                        onChange={(val) => setVoiceParam(v.id, 'dutyCycle', { ...v.dutyCycle, value: val / 100 })}
                                        unit="%"
                                        decimals={0}
                                    />
                                    <Slider
                                        label="VOL"
                                        value={v.volume.value}
                                        min={0}
                                        max={1}
                                        onChange={(val) => setVoiceParam(v.id, 'volume', { ...v.volume, value: val })}
                                        decimals={2}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="context-desc">
                        {(() => {
                            const planet = PLANETARY_TUNINGS.find(p => p.id === useSession.getState().currentPlanetId);
                            const state = CONSCIOUSNESS_STATES.find(s => s.id === useSession.getState().currentStateId);
                            if (planet && state) {
                                return `${planet.description} ${state.description}`;
                            } else if (planet) {
                                return planet.description;
                            } else if (state) {
                                return `Operate ${state.description}`;
                            }
                            return "Select a Planet and State to begin.";
                        })()}
                    </div>

                    <div className="controls-hint">
                        [CLICK] INDICATOR TO TOGGLE  [DRAG] KNOBS TO ADJUST  [SPACE] PLAY/PAUSE
                    </div>
                </div>
            </div>
        </div>
    );
}
