import { useState } from 'react';
import type { Horse, HorseUpdate } from '../types';
import { HorseUpdateForm } from './HorseUpdateForm';

interface HorsesSectionProps {
  horses: Horse[];
  isLoading: boolean;
  error: string | null;
  onUpdateHorse: (horseId: number, data: HorseUpdate) => Promise<void>;
  onDeleteHorse: (horseId: number) => Promise<void>;
}

export function HorsesSection({ horses, isLoading, error, onUpdateHorse, onDeleteHorse }: HorsesSectionProps) {
  const [editingHorseId, setEditingHorseId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

      {deleteError && (
        <div className="error-state">
          <p>{deleteError}</p>
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
                <th>アクション</th>
              </tr>
            </thead>
            <tbody>
              {horses.map((horse) => {
                if (editingHorseId === horse.id) {
                  return (
                    <tr key={horse.id}>
                      <td colSpan={6}>
                        <HorseUpdateForm
                          horse={horse}
                          onSave={async (data) => {
                            await onUpdateHorse(horse.id, data);
                            setEditingHorseId(null);
                          }}
                          onCancel={() => setEditingHorseId(null)}
                        />
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={horse.id}>
                    <td>{horse.post_position}</td>
                    <td><span className="horse-name">{horse.horse_name}</span></td>
                    <td>{horse.jockey || '-'}</td>
                    <td>{horse.popularity ? `${horse.popularity}番人気` : '-'}</td>
                    <td>{horse.odds ? horse.odds.toFixed(1) : '-'}</td>
                    <td>
                      <button
                        className="race-action-btn race-action-btn--edit"
                        onClick={(e) => { e.stopPropagation(); setDeleteError(null); setEditingHorseId(horse.id); }}
                      >
                        編集
                      </button>
                      <button
                        className="race-action-btn race-action-btn--delete"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!window.confirm('この出走馬を削除しますか？')) return;
                          setDeleteError(null);
                          try {
                            await onDeleteHorse(horse.id);
                          } catch (err: any) {
                            setDeleteError(err.message || '出走馬の削除に失敗しました');
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
      )}
    </section>
  );
}
