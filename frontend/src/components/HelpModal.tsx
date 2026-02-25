'use client';

import { useCallback } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExampleTileProps {
  letter: string;
  variant: 'correct' | 'present' | 'absent' | 'empty';
}

function ExampleTile({ letter, variant }: ExampleTileProps) {
  const variantClasses: Record<string, string> = {
    correct: 'tile-state-correct border-2',
    present: 'tile-state-present border-2',
    absent: 'tile-state-absent border-2',
    empty: 'tile-state-empty border-2',
  };
  const textClass = variant === 'correct' ? 'text-cosmic-dark' : 'text-cosmic-white';

  return (
    <div
      className={[
        'w-10 h-10 flex items-center justify-center rounded-md font-black text-base uppercase',
        variantClasses[variant],
        textClass,
      ].join(' ')}
    >
      {letter}
    </div>
  );
}

function ExampleRow({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-1">{children}</div>;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center modal-backdrop bg-[rgba(10,14,23,0.75)]"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
    >
      <div className="relative w-full max-w-sm mx-4 animate-slide-up">
        <div className="bg-[#1a2535] border border-[#2d4055] rounded-2xl p-6 shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-cosmic-gray hover:text-cosmic-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-gold rounded-lg p-1"
            aria-label="Close help"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Title */}
          <h2
            id="help-title"
            className="text-center text-cosmic-white font-black text-lg tracking-widest uppercase mb-1"
          >
            How To Play
          </h2>
          <p className="text-center text-cosmic-gray text-xs mb-5">
            Guess the COSMIC WORDLE in 6 tries.
          </p>

          {/* Rules */}
          <ul className="text-cosmic-gray text-sm space-y-2 mb-5 list-none">
            <li className="flex gap-2">
              <span className="text-cosmic-gold">•</span>
              Each guess must be a valid 5-letter word.
            </li>
            <li className="flex gap-2">
              <span className="text-cosmic-gold">•</span>
              The color of the tiles will change to show how close your guess was.
            </li>
            <li className="flex gap-2">
              <span className="text-cosmic-gold">•</span>
              A new word is available each day.
            </li>
          </ul>

          <div className="border-t border-[#2d4055] mb-4" />

          {/* Examples */}
          <h3 className="text-cosmic-white font-bold text-sm uppercase tracking-widest mb-3">
            Examples
          </h3>

          {/* Correct example */}
          <div className="mb-4">
            <ExampleRow>
              <ExampleTile letter="W" variant="correct" />
              <ExampleTile letter="E" variant="empty" />
              <ExampleTile letter="A" variant="empty" />
              <ExampleTile letter="R" variant="empty" />
              <ExampleTile letter="Y" variant="empty" />
            </ExampleRow>
            <p className="text-cosmic-gray text-xs mt-2">
              <span className="text-cosmic-gold font-bold">W</span> is in the word and in the correct spot.
            </p>
          </div>

          {/* Present example */}
          <div className="mb-4">
            <ExampleRow>
              <ExampleTile letter="P" variant="empty" />
              <ExampleTile letter="I" variant="present" />
              <ExampleTile letter="L" variant="empty" />
              <ExampleTile letter="L" variant="empty" />
              <ExampleTile letter="S" variant="empty" />
            </ExampleRow>
            <p className="text-cosmic-gray text-xs mt-2">
              <span className="text-cosmic-light font-bold">I</span> is in the word but in the wrong spot.
            </p>
          </div>

          {/* Absent example */}
          <div className="mb-5">
            <ExampleRow>
              <ExampleTile letter="V" variant="empty" />
              <ExampleTile letter="A" variant="empty" />
              <ExampleTile letter="G" variant="empty" />
              <ExampleTile letter="U" variant="absent" />
              <ExampleTile letter="E" variant="empty" />
            </ExampleRow>
            <p className="text-cosmic-gray text-xs mt-2">
              <span className="text-cosmic-gray font-bold">U</span> is not in the word in any spot.
            </p>
          </div>

          <div className="border-t border-[#2d4055] mb-4" />

          <p className="text-center text-cosmic-gray text-xs">
            Use your keyboard or the on-screen keys to type. Press{' '}
            <kbd className="px-1.5 py-0.5 bg-[#2a3545] rounded text-cosmic-white text-xs font-mono">
              Enter
            </kbd>{' '}
            to submit.
          </p>
        </div>
      </div>
    </div>
  );
}
