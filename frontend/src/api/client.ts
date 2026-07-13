import type { StatsSummary } from '../types';

export const fetchStatsSummary = async (): Promise<StatsSummary> => {
  const response = await fetch('/api/v1/stats/summary');
  if (!response.ok) {
    throw new Error('サマリー情報の取得に失敗しました');
  }
  return response.json();
};
