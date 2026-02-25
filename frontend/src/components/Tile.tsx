'use client';

import { useEffect, useRef, useState } from 'react';
import { TileLetter } from '@/types';

interface TileProps {
  letter: TileLetter;
}

const STATE_CLASSES: Record<string, string> = {
  empty: 'tile-state-empty border-2',
  filled: 'tile-state-filled border-2',
  correct: 'tile-state-correct border-2',
  present: 'tile-state-present border-2',
  absent: 'tile-state-absent border-2',
};

export default function Tile({ letter }: TileProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [displayState, setDisplayState] = useState(letter.state);
  const prevCharRef = useRef('');
  const prevStateRef = useRef(letter.state);

  // Bounce animation when a letter is typed
  useEffect(() => {
    if (letter.char && !prevCharRef.current && letter.state === 'filled') {
      setIsBouncing(true);
      const t = setTimeout(() => setIsBouncing(false), 300);
      prevCharRef.current = letter.char;
      return () => clearTimeout(t);
    }
    if (!letter.char) {
      prevCharRef.current = '';
    }
  }, [letter.char, letter.state]);

  // Flip animation when state transitions from 'filled' to a result state
  useEffect(() => {
    const prev = prevStateRef.current;
    const curr = letter.state;
    prevStateRef.current = curr;

    if (
      prev === 'filled' &&
      (curr === 'correct' || curr === 'present' || curr === 'absent')
    ) {
      // Start flip - keep showing 'filled' during first half
      setDisplayState('filled');
      setIsFlipping(true);

      // At the midpoint of the flip (250ms), switch to the final color
      const midTimer = setTimeout(() => {
        setDisplayState(curr);
      }, 250);

      // End flip animation
      const endTimer = setTimeout(() => {
        setIsFlipping(false);
      }, 500);

      return () => {
        clearTimeout(midTimer);
        clearTimeout(endTimer);
      };
    }

    // Reset display state for non-reveal transitions
    if (curr === 'empty' || curr === 'filled') {
      setDisplayState(curr);
      setIsFlipping(false);
    }
  }, [letter.state]);

  const stateClass = STATE_CLASSES[displayState] ?? STATE_CLASSES.empty;

  return (
    <div className="tile-container w-14 h-14 sm:w-[62px] sm:h-[62px]">
      <div
        className={[
          'tile-inner w-full h-full flex items-center justify-center',
          'rounded-md font-bold text-2xl uppercase select-none',
          'transition-all duration-100',
          stateClass,
          isBouncing ? 'animate-tile-bounce' : '',
          isFlipping ? 'tile-flip' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span
          className={[
            'leading-none tracking-wider',
            displayState === 'correct' ? 'text-cosmic-dark' : 'text-cosmic-white',
          ].join(' ')}
        >
          {letter.char}
        </span>
      </div>
    </div>
  );
}
