'use client';

import { useCallback, useRef, useState } from 'react';
import { LetterState } from '@/types';

interface KeyboardProps {
  letterStates: Record<string, LetterState>;
  onKey: (key: string) => void;
}

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

interface KeyButtonProps {
  label: string;
  state?: LetterState;
  onPress: (key: string) => void;
}

function KeyButton({ label, state, onPress }: KeyButtonProps) {
  const [pressing, setPressing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePress = useCallback(() => {
    setPressing(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setPressing(false), 120);

    const key = label === '⌫' ? 'Backspace' : label;
    onPress(key);
  }, [label, onPress]);

  const baseClasses =
    'select-none rounded-md font-bold text-sm uppercase cursor-pointer transition-all duration-75 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold';

  const sizeClasses =
    label === 'ENTER' || label === '⌫'
      ? 'px-2 h-14 min-w-[48px] text-xs'
      : 'w-9 h-14 sm:w-10';

  let colorClasses: string;
  if (state === 'correct') {
    colorClasses = 'bg-cosmic-gold text-cosmic-dark cosmic-glow-gold';
  } else if (state === 'present') {
    colorClasses = 'bg-cosmic-blue text-cosmic-white';
  } else if (state === 'absent') {
    colorClasses =
      'bg-[#2a3545] text-cosmic-gray border border-[#1e2a3a]';
  } else {
    colorClasses =
      'bg-[rgba(26,37,53,0.8)] text-cosmic-white border border-[#2d4055] hover:border-cosmic-blue hover:bg-[rgba(66,112,140,0.2)]';
  }

  const pressClass = pressing ? 'key-pressed scale-90' : '';

  return (
    <button
      className={[baseClasses, sizeClasses, colorClasses, pressClass]
        .filter(Boolean)
        .join(' ')}
      onPointerDown={handlePress}
      aria-label={label === '⌫' ? 'Backspace' : label}
      type="button"
    >
      {label}
    </button>
  );
}

export default function Keyboard({ letterStates, onKey }: KeyboardProps) {
  return (
    <div
      className="flex flex-col gap-1.5 items-center w-full max-w-[500px] px-2"
      role="group"
      aria-label="On-screen keyboard"
    >
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1 sm:gap-1.5 justify-center w-full">
          {row.map((key) => (
            <KeyButton
              key={key}
              label={key}
              state={letterStates[key]}
              onPress={onKey}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
