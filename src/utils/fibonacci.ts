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

export function generateFibonacciBassSeries(): number[] {
    // Uses specific audible frequencies from the Fibonacci sequence
    // 21, 34, 55, 89, 144 are the bass range numbers
    // We'll use the upper triad: 55, 89, 144
    return [55, 89, 144];
}

export function generateFibonacciSubSeries(): number[] {
    // Uses the lower bass triad: 21, 34, 55
    return [21, 34, 55];
}

// The Fibonacci sequence for audio/tuning
const FIB_SEQUENCE = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233];

export interface FibonacciMode {
    id: string;
    name: string;
    description: string;
    generator: (baseFreq: number) => number[];
}

// Generate modes for each number in the sequence up to 144
const SEQUENCE_MODES: FibonacciMode[] = FIB_SEQUENCE.slice(0, 11).map((num, index) => {
    // Get the triad: [Previous, Current, Next]
    // For the first item (1), we use [1, 1, 2]
    // For others, we use [Prev, Curr, Next]
    const prev = index === 0 ? 1 : FIB_SEQUENCE[index - 1];
    const next = FIB_SEQUENCE[index + 1];

    return {
        id: `fib_${num}`,
        name: `Harmonic ${num}x`,
        description: `Partials: ${prev}x, ${num}x, ${next}x`,
        generator: (baseFreq: number) => [
            baseFreq * prev,
            baseFreq * num,
            baseFreq * next
        ]
    };
});

export const FIBONACCI_MODES: FibonacciMode[] = [
    {
        id: 'classic',
        name: 'Classic (1, φ, 2)',
        description: 'Root, golden ratio, and octave',
        generator: generateFibonacciSequence
    },
    ...SEQUENCE_MODES
];
