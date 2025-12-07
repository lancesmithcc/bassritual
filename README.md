# Bass Ritual Acutonics

React + Tone.js interface for generating acutonics-style isochronic tones. The site now ships with a lightweight HTTP API so other tools can request tone recipes built from the same presets as the UI.

## API
- Start the server: `npm run api` (default port `8788`, override with `PORT=xxxx`).
- `GET /health` – readiness check.
- `GET /api/meta` – lists planetary tunings, consciousness states, and Fibonacci modes (safe to cache).
- `POST /api/tones` – generate a tone recipe.
  - `planetId` (optional): one of `PLANETARY_TUNINGS`.
  - `stateId` (optional): sets a global isochronic pulse rate.
  - `fibModeId` (optional): choose a Fibonacci harmonic set.
  - `baseFrequency` (optional): seed for Fibonacci modes (falls back to the first enabled voice).
  - `pulseRate` (optional): force a single pulse/LFO rate across all voices.
  - `voices` (optional): array of partial voice overrides `{ id, frequency, pulseRate, dutyCycle, pulseShape, volume, pan, filterCutoff, waveform, enabled }`.

Example request:

```bash
curl -X POST http://localhost:8788/api/tones \
  -H "Content-Type: application/json" \
  -d '{
    "planetId": "ohm",
    "stateId": "theta",
    "fibModeId": "classic",
    "pulseRate": 6,
    "voices": [{ "id": "v1", "waveform": "triangle" }]
  }'
```

Example response shape:

```json
{
  "voices": [
    { "id": "v1", "enabled": true, "frequency": { "value": 136.1, "rampTime": 3 }, "waveform": "triangle", "pulseRate": { "value": 6, "rampTime": 2 }, "dutyCycle": { "value": 0.5 }, "pulseShape": { "value": 0 }, "volume": { "value": 0.9, "rampTime": 2 }, "pan": { "value": 0 }, "filterCutoff": { "value": 2000 } },
    { "id": "v2", "enabled": true, "frequency": { "value": 218.865, "rampTime": 3 }, "waveform": "sine", "pulseRate": { "value": 6, "rampTime": 2 }, "dutyCycle": { "value": 0.4 }, "pulseShape": { "value": 0 }, "volume": { "value": 0.7, "rampTime": 2 }, "pan": { "value": -0.2 }, "filterCutoff": { "value": 2000 } },
    { "id": "v3", "enabled": true, "frequency": { "value": 272.2, "rampTime": 3 }, "waveform": "sine", "pulseRate": { "value": 6, "rampTime": 2 }, "dutyCycle": { "value": 0.6 }, "pulseShape": { "value": 0 }, "volume": { "value": 0.8, "rampTime": 2 }, "pan": { "value": 0.2 }, "filterCutoff": { "value": 1000 } }
  ],
  "context": {
    "planet": { "id": "ohm", "name": "OHM (Earth)", "...": "..." },
    "state": { "id": "theta", "name": "THETA (6.0Hz)", "...": "..." },
    "fibonacciMode": { "id": "classic", "name": "Classic (1, phi, 2)", "description": "Root, golden ratio, and octave" }
  },
  "summary": { "baseFrequencyHz": 136.1, "isochronicRateHz": 6, "voiceCount": 3 },
  "notes": []
}
```

## Frontend
- Run the UI in dev mode: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
