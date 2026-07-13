import type { StatsSummary, Race } from '../types';

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

