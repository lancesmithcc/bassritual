import { useEffect, useState } from 'react';
import { useSession } from '../store/useSession';
import './Dashboard.css';
import BassEngine from '../audio/BassEngine';
import * as Tone from 'tone';
import { PLANETARY_TUNINGS, CONSCIOUSNESS_STATES } from '../data/presets';

export default function Dashboard() {
    const { voices, toggleVoice, setVoiceParam } = useSession();
    const [selectedRow, setSelectedRow] = useState(0);
    const [selectedCol, setSelectedCol] = useState(0); // 0: Toggle, 1: Freq, 2: Pulse, 3: Duty
    const [editing, setEditing] = useState<{ row: number, col: number } | null>(null);
    const [editValue, setEditValue] = useState("");

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (editing) {
                if (e.key === 'Enter') {
                    commitEdit();
                } else if (e.key === 'Escape') {
                    setEditing(null);
                }
                return; // Trap keys when editing
            }

            switch (e.key) {
                case 'ArrowUp':
                    setSelectedRow(prev => (prev > 0 ? prev - 1 : voices.length - 1));
                    break;
                case 'ArrowDown':
                    setSelectedRow(prev => (prev < voices.length - 1 ? prev + 1 : 0));
                    break;
                case 'ArrowLeft':
                    setSelectedCol(prev => (prev > 0 ? prev - 1 : 3));
                    break;
                case 'ArrowRight':
                    setSelectedCol(prev => (prev < 3 ? prev + 1 : 0));
                    break;
                case ' ':
                    if (BassEngine.getTransportState() === 'started') {
                        BassEngine.stop();
                    } else {
                        BassEngine.initialize().then(() => Tone.Transport.start());
                    }
                    break;
                case 'Enter':
                    if (selectedCol === 0) {
                        toggleVoice(voices[selectedRow].id);
                    } else {
                        // Start Editing
                        setEditing({ row: selectedRow, col: selectedCol });
                        const voice = voices[selectedRow];
                        let val = "";
                        if (selectedCol === 1) val = voice.frequency.value.toString();
                        if (selectedCol === 2) val = voice.pulseRate.value.toString();
                        if (selectedCol === 3) val = (voice.dutyCycle.value * 100).toString();
                        setEditValue(val);
                    }
                    break;
                case '[':
                    adjustParam(selectedRow, selectedCol, -1);
                    break;
                case ']':
                    adjustParam(selectedRow, selectedCol, 1);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedRow, selectedCol, voices, toggleVoice, setVoiceParam, editing, editValue]);

    const commitEdit = () => {
        if (!editing) return;
        const val = parseFloat(editValue);
        if (isNaN(val)) {
            setEditing(null);
            return;
        }

        const voice = voices[editing.row];
        if (editing.col === 1) {
            setVoiceParam(voice.id, 'frequency', { ...voice.frequency, value: val });
        } else if (editing.col === 2) {
            setVoiceParam(voice.id, 'pulseRate', { ...voice.pulseRate, value: val });
        } else if (editing.col === 3) {
            setVoiceParam(voice.id, 'dutyCycle', { ...voice.dutyCycle, value: Math.max(0, Math.min(100, val)) / 100 });
        }
        setEditing(null);
    };

    const adjustParam = (row: number, col: number, direction: number) => {
        const voice = voices[row];
        const step = direction;

        if (col === 1) { // Freq
            const newVal = voice.frequency.value + step * 1.0;
            setVoiceParam(voice.id, 'frequency', { ...voice.frequency, value: newVal });
        } else if (col === 2) { // Pulse
            const newVal = voice.pulseRate.value + step * 0.5;
            setVoiceParam(voice.id, 'pulseRate', { ...voice.pulseRate, value: newVal });
        } else if (col === 3) { // Duty
            const newVal = Math.max(0.1, Math.min(0.9, voice.dutyCycle.value + step * 0.05));
            setVoiceParam(voice.id, 'dutyCycle', { ...voice.dutyCycle, value: newVal });
        }
    };

    const renderParam = (row: number, col: number, label: string, value: string) => {
        const isSelected = selectedRow === row && selectedCol === col;
        const isEditingThis = editing?.row === row && editing?.col === col;

        return (
            <span className={`param ${isSelected ? 'selected-col' : ''}`}>
                {label}: {isEditingThis ? (
                    <input
                        autoFocus
                        className="edit-input"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onBlur={() => setEditing(null)} // Optional: Cancel on blur
                        onClick={e => e.stopPropagation()}
                    />
                ) : value}
            </span>
        );
    };

    // ...

    return (
        <div className="lcars-container">
            <div className="lcars-header-row">
                <div className="lcars-elbow-top"></div>
                <div className="lcars-header-bar">
                    <span className="lcars-title">
                        BASS RITUAL // CONSOLE
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
                        {voices.map((v, r) => (
                            <div key={v.id} className={`voice-row ${v.enabled ? 'active' : 'inactive'} ${selectedRow === r ? 'selected-row' : ''}`}>
                                <div className={`voice-indicator ${v.enabled ? 'on' : 'off'}`}></div>
                                <span className={`voice-id ${selectedRow === r && selectedCol === 0 ? 'selected-col' : ''}`}>
                                    {v.id.toUpperCase()}
                                </span>
                                {renderParam(r, 1, "FREQ", `${v.frequency.value.toFixed(1)}Hz`)}
                                {renderParam(r, 2, "PULSE", `${v.pulseRate.value.toFixed(1)}Hz`)}
                                {renderParam(r, 3, "DUTY", `${(v.dutyCycle.value * 100).toFixed(0)}%`)}
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
                        [ARROWS] NAVIGATE  [ [ ] / [ ] ] ADJUST  [ENTER] EDIT/TOGGLE
                    </div>
                </div>
            </div>
        </div>
    );
}
