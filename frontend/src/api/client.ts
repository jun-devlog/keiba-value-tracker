import type { StatsSummary, Race, Horse, Prediction, Bet, Result, RaceCreate, HorseCreate, PredictionCreate, BetCreate, ResultCreate, Venue, BetType } from '../types';

export const fetchStatsSummary = async (): Promise<StatsSummary> => {
  const response = await fetch('/api/v1/stats/summary');
  if (!response.ok) {
    throw new Error('サマリー情報の取得に失敗しました');
  }
  return response.json();
};

export const fetchRaces = async (): Promise<Race[]> => {
  const response = await fetch('/api/v1/races');
  if (!response.ok) {
    throw new Error('レース一覧の取得に失敗しました');
  }
  return response.json();
};

export const fetchHorsesByRaceId = async (raceId: number): Promise<Horse[]> => {
  const response = await fetch(`/api/v1/races/${raceId}/horses`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('指定されたレースが見つかりません');
    }
    throw new Error('出走馬一覧の取得に失敗しました');
  }
  return response.json();
};

export const fetchPredictionsByRaceId = async (raceId: number): Promise<Prediction[]> => {
  const response = await fetch(`/api/v1/races/${raceId}/predictions`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('指定されたレースが見つかりません');
    }
    throw new Error('予想一覧の取得に失敗しました');
  }
  return response.json();
};

export const fetchBetsByRaceId = async (raceId: number): Promise<Bet[]> => {
  const response = await fetch(`/api/v1/races/${raceId}/bets`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('指定されたレースが見つかりません');
    }
    throw new Error('馬券購入一覧の取得に失敗しました');
  }
  return response.json();
};

export const fetchResultByRaceId = async (raceId: number): Promise<Result | null> => {
  const response = await fetch(`/api/v1/races/${raceId}/result`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('レース結果の取得に失敗しました');
  }
  return response.json();
};

export const createRace = async (data: RaceCreate): Promise<Race> => {
  const response = await fetch('/api/v1/races', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('レースの登録に失敗しました');
  }
  return response.json();
};

export const createHorse = async (raceId: number, data: HorseCreate): Promise<Horse> => {
  const response = await fetch(`/api/v1/races/${raceId}/horses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('出走馬の登録に失敗しました');
  }
  return response.json();
};

export const createPrediction = async (raceId: number, data: PredictionCreate): Promise<Prediction> => {
  const response = await fetch(`/api/v1/races/${raceId}/predictions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('予想の登録に失敗しました');
  }
  return response.json();
};

export const createBet = async (raceId: number, data: BetCreate): Promise<Bet> => {
  const response = await fetch(`/api/v1/races/${raceId}/bets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('馬券の登録に失敗しました');
  }
  return response.json();
};

export const createResult = async (raceId: number, data: ResultCreate): Promise<Result> => {
  const response = await fetch(`/api/v1/races/${raceId}/result`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    if (response.status === 400) {
      const errData = await response.json().catch(() => null);
      throw new Error(errData?.detail || 'レース結果の登録に失敗しました（データ重複の可能性があります）');
    }
    throw new Error('レース結果の登録に失敗しました');
  }
  return response.json();
};

export const fetchVenues = async (): Promise<Venue[]> => {
  const response = await fetch('/api/v1/venues');
  if (!response.ok) {
    throw new Error('会場の取得に失敗しました');
  }
  return response.json();
};

export const fetchBetTypes = async (): Promise<BetType[]> => {
  const response = await fetch('/api/v1/bet_types');
  if (!response.ok) {
    throw new Error('券種の取得に失敗しました');
  }
  return response.json();
};










