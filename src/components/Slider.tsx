import React from 'react';
import './Slider.css';

interface SliderProps {
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    label: string;
    unit?: string;
    decimals?: number;
    vertical?: boolean;
}

export default function Slider({
    value,
    min,
    max,
    onChange,
    label,
    unit = '',
    decimals = 0,
    vertical = false
}: SliderProps) {
    const percentage = ((value - min) / (max - min)) * 100;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(parseFloat(e.target.value));
    };

    return (
        <div className={`slider-container ${vertical ? 'vertical' : 'horizontal'}`}>
            <div className="slider-label">{label}</div>
            <div className="slider-track-wrapper">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={(max - min) / 1000}
                    value={value}
                    onChange={handleChange}
                    className="slider-input"
                    style={{
                        background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${percentage}%, #333 ${percentage}%, #333 100%)`
                    }}
                />
                <div className="slider-thumb-glow" style={{ left: `${percentage}%` }} />
            </div>
            <div className="slider-value">
                {value.toFixed(decimals)}{unit}
            </div>
        </div>
    );
}
