import { LetterState, TileLetter } from '@/types';

export function evaluateGuess(guess: string, target: string): LetterState[] {
  const result: LetterState[] = new Array(5).fill('absent');
  const targetArr = target.split('');
  const guessArr = guess.split('');
  const targetRemaining: (string | null)[] = [...targetArr];

  // Pass 1: mark correct positions
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === targetArr[i]) {
      result[i] = 'correct';
      targetRemaining[i] = null;
    }
  }

  // Pass 2: mark present (wrong position)
  for (let i = 0; i < 5; i++) {
    if (result[i] !== 'correct') {
      const idx = targetRemaining.indexOf(guessArr[i]);
      if (idx !== -1) {
        result[i] = 'present';
        targetRemaining[idx] = null;
      }
    }
  }

  return result;
}

export function createEmptyBoard(): TileLetter[][] {
  return Array(6)
    .fill(null)
    .map(() =>
      Array(5)
        .fill(null)
        .map(() => ({ char: '', state: 'empty' as LetterState }))
    );
}

export function getBestLetterState(
  existing: LetterState | undefined,
  newState: LetterState
): LetterState {
  const priority: Record<LetterState, number> = {
    correct: 3,
    present: 2,
    absent: 1,
    filled: 0,
    empty: -1,
  };
  if (!existing) return newState;
  return priority[newState] > priority[existing] ? newState : existing;
}

export function getWinMessage(attemptNumber: number): string {
  const messages: Record<number, string> = {
    1: 'Genius!',
    2: 'Magnificent!',
    3: 'Impressive!',
    4: 'Splendid!',
    5: 'Great!',
    6: 'Phew!',
  };
  return messages[attemptNumber] ?? 'Well done!';
}
