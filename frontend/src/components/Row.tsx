'use client';

import { TileLetter } from '@/types';
import Tile from '@/components/Tile';

interface RowProps {
  letters: TileLetter[];
  isShaking?: boolean;
}

export default function Row({ letters, isShaking = false }: RowProps) {
  return (
    <div
      className={[
        'flex gap-1.5 sm:gap-2',
        isShaking ? 'animate-tile-shake' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="row"
      aria-label="Guess row"
    >
      {letters.map((letter, i) => (
        <Tile
          key={i}
          letter={letter}
        />
      ))}
    </div>
  );
}
