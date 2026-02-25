'use client';

import { GameState } from '@/types';
import Row from '@/components/Row';

interface GameBoardProps {
  state: GameState;
}

export default function GameBoard({ state }: GameBoardProps) {
  const { board, shakingRow } = state;

  return (
    <div
      className="game-board flex flex-col gap-1.5 sm:gap-2 items-center"
      role="grid"
      aria-label="Wordle game board"
    >
      {board.map((row, i) => (
        <Row
          key={i}
          letters={row}
          isShaking={shakingRow === i}
        />
      ))}
    </div>
  );
}
