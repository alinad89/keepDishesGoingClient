export type GameSessionResult = 'win' | 'lose' | 'draw' | string;

export interface GameSessionSummary {
  id?: string;
  gameId?: string;
  date: string;
  result: GameSessionResult;
}

export interface GameSessionDetail {
  id?: string;
  date: string;
  result: GameSessionResult;
}

export type GameSessionListResponse = GameSessionSummary[];
