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

export interface Horse {
  id: number;
  race_id: number;
  post_position: number;
  horse_name: string;
  jockey: string | null;
  popularity: number | null;
  odds: number | null;
  created_at: string;
}

export interface Prediction {
  id: number;
  race_id: number;
  horse_id: number;
  rank: number | null;
  confidence: number | null;
  memo: string | null;
  created_at: string;
}

export interface Bet {
  id: number;
  race_id: number;
  bet_type_id: number;
  amount: number;
  combination: string | null;
  created_at: string;
}

export interface Result {
  id: number;
  race_id: number;
  order_of_finish: string | null;
  total_bet: number;
  total_return: number;
  profit: number;
  roi: number | null;
  created_at: string;
}

export interface RaceCreate {
  venue_id: number;
  race_date: string;
  race_number: number;
  race_name: string | null;
  grade: string | null;
  distance: number | null;
  track_type: string | null;
}

export interface HorseCreate {
  post_position: number;
  horse_name: string;
  jockey: string | null;
  popularity: number | null;
  odds: number | null;
}







