const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface StatsResponse {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
}

export interface GameResultPayload {
  guessCount: number;
  won: boolean;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  token: string;
  userId: string;
}

export async function getStats(token: string): Promise<StatsResponse> {
  const res = await fetch(`${API_URL}/api/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch stats: ${res.statusText}`);
  }

  return res.json() as Promise<StatsResponse>;
}

export async function postGameResult(
  token: string,
  guessCnt: number,
  win: boolean
): Promise<void> {
  const payload: GameResultPayload = { guessCount: guessCnt, won: win };

  const res = await fetch(`${API_URL}/api/game-result`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to post game result: ${res.statusText}`);
  }
}

export async function signup(
  username: string,
  email: string,
  password: string
): Promise<SignupResponse> {
  const payload: SignupPayload = { username, email, password };

  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Signup failed: ${res.statusText}`);
  }

  return res.json() as Promise<SignupResponse>;
}
