export type GameSessionResult = 'win' | 'lose' | 'draw' | string;

export interface GameSessionSummary {
  date: string;
  result: GameSessionResult;
}

export type GameSessionListResponse = GameSessionSummary[];
