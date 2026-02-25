export type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'filled';
export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export interface TileLetter {
  char: string;
  state: LetterState;
}

export interface GameState {
  board: TileLetter[][];
  currentRow: number;
  currentCol: number;
  gameStatus: GameStatus;
  targetWord: string;
  letterStates: Record<string, LetterState>;
  shakingRow: number | null;
  revealingRow: number | null;
  message: string | null;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
}
