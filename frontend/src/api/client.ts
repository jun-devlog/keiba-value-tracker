import type { StatsSummary, Race, Horse } from '../types';

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
