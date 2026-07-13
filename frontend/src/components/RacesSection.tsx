import type { Race } from '../types';

interface RacesSectionProps {
  races: Race[];
  isLoading: boolean;
  error: string | null;
  selectedRaceId: number | null;
  onRaceSelect: (id: number) => void;
}

export function RacesSection({ races, isLoading, error, selectedRaceId, onRaceSelect }: RacesSectionProps) {
  return (
    <section className="races-section">
      <h2 className="section-title">Races</h2>
      
      {isLoading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>レース情報を読み込み中...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>Error: {error}</p>
        </div>
      )}

      {!isLoading && !error && races.length === 0 && (
        <div className="empty-state">
          <p>レース情報が登録されていません</p>
        </div>
      )}

      {!isLoading && !error && races.length > 0 && (
        <div className="races-list">
          <table className="races-table">
            <thead>
              <tr>
                <th>日付</th>
                <th>競馬場</th>
                <th>R</th>
                <th>レース名・グレード</th>
                <th>コース</th>
              </tr>
            </thead>
            <tbody>
              {races.map((race) => (
                <tr 
                  key={race.id}
                  className={`clickable-row ${race.id === selectedRaceId ? 'selected-row' : ''}`}
                  onClick={() => onRaceSelect(race.id)}
                >
                  <td>{race.race_date}</td>
                  <td>{race.venue_id}</td>
                  <td>{race.race_number}R</td>
                  <td>
                    <span className="race-name">{race.race_name}</span>
                    {race.grade && <span className="race-grade">{race.grade}</span>}
                  </td>
                  <td>{race.track_type} {race.distance}m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
