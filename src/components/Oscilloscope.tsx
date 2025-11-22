import { useEffect, useRef } from 'react';
import BassEngine from '../audio/BassEngine';

export default function Oscilloscope() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const render = () => {
            try {
                const analyser = BassEngine.getAnalyser();
                const values = analyser.getValue(); // Float32Array

                // Clear with fade (persistence)
                ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Get current theme color
                const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();

                ctx.lineWidth = 3;
                ctx.strokeStyle = themeColor;
                ctx.shadowBlur = 15;
                ctx.shadowColor = themeColor;

                ctx.beginPath();

                const sliceWidth = canvas.width * 1.0 / values.length;
                let x = 0;

                for (let i = 0; i < values.length; i++) {
                    const v = (values[i] as number);
                    // Scale amplitude visually
                    const y = (0.5 + v * 0.4) * canvas.height;

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }

                ctx.stroke();

            } catch (e) {
                // Engine not ready
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            animationId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ display: 'block', width: '100%', height: '100%' }}
        />
    );
}
