import React, { useRef, useState, useCallback } from 'react';
import './Knob.css';

interface KnobProps {
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    label: string;
    unit?: string;
    decimals?: number;
}

export default function Knob({ value, min, max, onChange, label, unit = '', decimals = 1 }: KnobProps) {
    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef(0);
    const startValue = useRef(0);

    const normalizedValue = (value - min) / (max - min);
    const rotation = normalizedValue * 270 - 135; // -135° to 135° range

    const handleStart = useCallback((clientY: number) => {
        setIsDragging(true);
        startY.current = clientY;
        startValue.current = value;
    }, [value]);

    const handleMove = useCallback((clientY: number) => {
        const delta = startY.current - clientY; // Inverted for natural feel
        const sensitivity = (max - min) / 200; // Adjust sensitivity
        const newValue = Math.max(min, Math.min(max, startValue.current + delta * sensitivity));
        onChange(newValue);
    }, [max, min, onChange]);

    const handleEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Mouse handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        handleStart(e.clientY);
        e.preventDefault();
    };

    // Touch handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        handleStart(touch.clientY);
        e.preventDefault();
    };

    React.useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            handleMove(e.clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            handleMove(touch.clientY);
            e.preventDefault();
        };

        const handleMouseUp = () => handleEnd();
        const handleTouchEnd = () => handleEnd();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, handleMove, handleEnd]);

    return (
        <div className="knob-container">
            <div className="knob-label">{label}</div>
            <div
                className={`knob ${isDragging ? 'dragging' : ''}`}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <div className="knob-track">
                    <div
                        className="knob-indicator"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    />
                </div>
                <div className="knob-center" />
            </div>
            <div className="knob-value">
                {value.toFixed(decimals)}{unit}
            </div>
        </div>
    );
}
