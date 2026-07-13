export interface StatsSummary {
  total_bet: number;
  total_return: number;
  profit: number;
  roi: number | null;
  race_count: number;
  hit_count: number;
}

export interface Race {
  id: number;
  venue_id: number;
  race_date: string;
  race_number: number;
  race_name: string;
  grade: string | null;
  distance: number;
  track_type: string;
  created_at: string;
}

