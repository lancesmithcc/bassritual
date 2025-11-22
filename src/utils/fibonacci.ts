// Fibonacci sequence harmonics generator
// Uses golden ratio (phi) and Fibonacci numbers for musical harmony

export const PHI = 1.618033988749895; // Golden ratio

export function getFibonacciNumber(n: number): number {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        const temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}

export function generateFibonacciSequence(baseFreq: number): number[] {
    // Generate 3 frequencies based on Fibonacci harmonics
    // Voice 1: Base frequency
    // Voice 2: Base * phi (golden ratio)
    // Voice 3: Base * 2 (octave, Fibonacci(3))

    return [
        baseFreq,           // F (root)
        baseFreq * PHI,     // F * 1.618 (golden ratio harmonic)
        baseFreq * 2        // F * 2 (octave)
    ];
}

export function generateFibonacciRatioSequence(baseFreq: number): number[] {
    // Alternative: Use Fibonacci number ratios
    // Creates more complex harmonic relationships

    const fib5 = getFibonacciNumber(5); // 5
    const fib6 = getFibonacciNumber(6); // 8
    const fib7 = getFibonacciNumber(7); // 13

    return [
        baseFreq,                    // F (root)
        baseFreq * (fib6 / fib5),   // F * (8/5) = F * 1.6
        baseFreq * (fib7 / fib5)    // F * (13/5) = F * 2.6
    ];
}

export function generatePhiHarmonics(baseFreq: number): number[] {
    // Pure phi-based harmonics (most consonant)
    return [
        baseFreq / PHI,     // F / phi (sub-harmonic)
        baseFreq,           // F (root)
        baseFreq * PHI      // F * phi (super-harmonic)
    ];
}

export interface FibonacciMode {
    id: string;
    name: string;
    description: string;
    generator: (baseFreq: number) => number[];
}

export const FIBONACCI_MODES: FibonacciMode[] = [
    {
        id: 'classic',
        name: 'Classic (1, φ, 2)',
        description: 'Root, golden ratio, and octave',
        generator: generateFibonacciSequence
    },
    {
        id: 'ratios',
        name: 'Ratios (1, 8/5, 13/5)',
        description: 'Fibonacci number ratios',
        generator: generateFibonacciRatioSequence
    },
    {
        id: 'phi',
        name: 'Phi Triad (1/φ, 1, φ)',
        description: 'Golden ratio symmetry',
        generator: generatePhiHarmonics
    }
];
