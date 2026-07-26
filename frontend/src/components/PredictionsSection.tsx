import { useState } from 'react';
import type { Prediction, PredictionUpdate, Horse } from '../types';
import { getMarkByRank } from '../utils/formatters';
import { PredictionUpdateForm } from './PredictionUpdateForm';

interface PredictionsSectionProps {
  predictions: Prediction[];
  isLoading: boolean;
  error: string | null;
  horses: Horse[];
  onUpdatePrediction: (predictionId: number, data: PredictionUpdate) => Promise<void>;
  onDeletePrediction: (predictionId: number) => Promise<void>;
}

export function PredictionsSection({ predictions, isLoading, error, horses, onUpdatePrediction, onDeletePrediction }: PredictionsSectionProps) {
  const [editingPredictionId, setEditingPredictionId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  return (
    <section className="horses-section">
      <h2 className="section-title">Predictions</h2>

      {isLoading && (
        <div className="state-container">
          <div className="spinner"></div>
          <p>予想情報を読み込み中...</p>
        </div>
      )}

      {error && (
        <div className="state-container error">
          <p>Error: {error}</p>
        </div>
      )}

      {deleteError && (
        <div className="state-container error">
          <p>{deleteError}</p>
        </div>
      )}

      {!isLoading && !error && predictions.length === 0 && (
        <div className="state-container">
          <p>予想が登録されていません</p>
        </div>
      )}

      {!isLoading && !error && predictions.length > 0 && (
        <div className="data-section">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
              <tr>
                <th>印</th>
                <th>順位</th>
                <th>出走馬</th>
                <th>自信度</th>
                <th>メモ</th>
                <th>アクション</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((prediction) => {
                if (editingPredictionId === prediction.id) {
                  return (
                    <tr key={prediction.id} className="inline-edit-row">
                      <td colSpan={6}>
                        <PredictionUpdateForm
                          prediction={prediction}
                          horses={horses}
                          onSave={async (data) => {
                            await onUpdatePrediction(prediction.id, data);
                            setEditingPredictionId(null);
                          }}
                          onCancel={() => setEditingPredictionId(null)}
                        />
                      </td>
                    </tr>
                  );
                }

                const horse = horses.find((h) => h.id === prediction.horse_id);
                const horseLabel = horse
                  ? `${horse.post_position} - ${horse.horse_name}`
                  : `ID: ${prediction.horse_id}`;

                return (
                  <tr key={prediction.id}>
                    <td className="prediction-mark">{getMarkByRank(prediction.rank)}</td>
                    <td>{prediction.rank || '-'}</td>
                    <td>{horseLabel}</td>
                    <td>{prediction.confidence !== null ? prediction.confidence.toFixed(2) : '-'}</td>
                    <td>{prediction.memo || '-'}</td>
                    <td>
                      <button
                        className="race-action-btn race-action-btn--edit"
                        onClick={(e) => { e.stopPropagation(); setDeleteError(null); setEditingPredictionId(prediction.id); }}
                      >
                        編集
                      </button>
                      <button
                        className="race-action-btn race-action-btn--delete"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!window.confirm('この予想を削除しますか？')) return;
                          setDeleteError(null);
                          try {
                            await onDeletePrediction(prediction.id);
                          } catch (err: any) {
                            setDeleteError(err.message || '予想の削除に失敗しました');
                          }
                        }}
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
