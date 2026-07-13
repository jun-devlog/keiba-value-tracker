import type { Horse } from '../types';

interface HorsesSectionProps {
  horses: Horse[];
  isLoading: boolean;
  error: string | null;
}

export function HorsesSection({ horses, isLoading, error }: HorsesSectionProps) {
  return (
    <section className="horses-section">
      <h2 className="section-title">Horses</h2>

      {isLoading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>出走馬情報を読み込み中...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>Error: {error}</p>
        </div>
      )}

      {!isLoading && !error && horses.length === 0 && (
        <div className="empty-state">
          <p>出走馬が登録されていません</p>
        </div>
      )}

      {!isLoading && !error && horses.length > 0 && (
        <div className="horses-list">
          <table className="races-table">
            <thead>
              <tr>
                <th>馬番</th>
                <th>馬名</th>
                <th>騎手</th>
                <th>人気</th>
                <th>オッズ</th>
              </tr>
            </thead>
            <tbody>
              {horses.map((horse) => (
                <tr key={horse.id}>
                  <td>{horse.post_position}</td>
                  <td><span className="horse-name">{horse.horse_name}</span></td>
                  <td>{horse.jockey || '-'}</td>
                  <td>{horse.popularity ? `${horse.popularity}番人気` : '-'}</td>
                  <td>{horse.odds ? horse.odds.toFixed(1) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
