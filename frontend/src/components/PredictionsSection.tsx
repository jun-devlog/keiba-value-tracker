import type { Prediction } from '../types';
import { getMarkByRank } from '../utils/formatters';

interface PredictionsSectionProps {
  predictions: Prediction[];
  isLoading: boolean;
  error: string | null;
}

export function PredictionsSection({ predictions, isLoading, error }: PredictionsSectionProps) {
  return (
    <section className="horses-section">
      <h2 className="section-title">Predictions</h2>

      {isLoading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>予想情報を読み込み中...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>Error: {error}</p>
        </div>
      )}

      {!isLoading && !error && predictions.length === 0 && (
        <div className="empty-state">
          <p>予想が登録されていません</p>
        </div>
      )}

      {!isLoading && !error && predictions.length > 0 && (
        <div className="horses-list">
          <table className="races-table">
            <thead>
              <tr>
                <th>印</th>
                <th>順位</th>
                <th>出走馬ID</th>
                <th>自信度</th>
                <th>メモ</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((prediction) => (
                <tr key={prediction.id}>
                  <td className="prediction-mark">{getMarkByRank(prediction.rank)}</td>
                  <td>{prediction.rank || '-'}</td>
                  <td>{prediction.horse_id}</td>
                  <td>{prediction.confidence !== null ? prediction.confidence.toFixed(2) : '-'}</td>
                  <td>{prediction.memo || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
