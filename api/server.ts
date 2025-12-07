import express from 'express';
import cors from 'cors';
import { buildToneRecipe, type ToneRequestPayload } from './toneService';
import { PLANETARY_TUNINGS, CONSCIOUSNESS_STATES } from '../src/data/presets';
import { FIBONACCI_MODES } from '../src/utils/fibonacci';

const app = express();
const PORT = Number(process.env.PORT) || 8788;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/meta', (_req, res) => {
    res.json({
        planets: PLANETARY_TUNINGS,
        states: CONSCIOUSNESS_STATES,
        fibonacciModes: FIBONACCI_MODES.map(({ id, name, description }) => ({ id, name, description }))
    });
});

app.post('/api/tones', (req, res) => {
    try {
        const payload = (req.body ?? {}) as ToneRequestPayload;
        const recipe = buildToneRecipe(payload);
        res.json(recipe);
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Invalid request';
        res.status(400).json({ error: message });
    }
});

app.listen(PORT, () => {
    console.log(`[acutonics-api] listening on http://localhost:${PORT}`);
});
