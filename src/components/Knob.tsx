import React, { useRef, useState } from 'react';
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

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        startY.current = e.clientY;
        startValue.current = value;
        e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;

        const delta = startY.current - e.clientY; // Inverted for natural feel
        const sensitivity = (max - min) / 200; // Adjust sensitivity
        const newValue = Math.max(min, Math.min(max, startValue.current + delta * sensitivity));

        onChange(newValue);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging]);

    return (
        <div className="knob-container">
            <div className="knob-label">{label}</div>
            <div
                className={`knob ${isDragging ? 'dragging' : ''}`}
                onMouseDown={handleMouseDown}
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
