import { formatDateTime } from '../utils/formatters';
import type { Race, RaceUpdate } from '../types';
import { RaceUpdateForm } from './RaceUpdateForm';
import { useState } from 'react';

interface RacesSectionProps {
  races: Race[];
  isLoading: boolean;
  error: string | null;
  selectedRaceId: number | null;
  onRaceSelect: (raceId: number) => void;
  onUpdateRace: (raceId: number, data: RaceUpdate) => Promise<void>;
  onDeleteRace: (raceId: number) => Promise<void>;
}

export function RacesSection({ races, isLoading, error, selectedRaceId, onRaceSelect, onUpdateRace, onDeleteRace }: RacesSectionProps) {
  const [editingRaceId, setEditingRaceId] = useState<number | null>(null);

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
                <th>アクション</th>
              </tr>
            </thead>
            <tbody>
              {races.map((race) => {
                if (editingRaceId === race.id) {
                  return (
                    <tr key={race.id}>
                      <td colSpan={6}>
                        <RaceUpdateForm
                          race={race}
                          onSave={async (data) => {
                            await onUpdateRace(race.id, data);
                            setEditingRaceId(null);
                          }}
                          onCancel={() => setEditingRaceId(null)}
                        />
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr 
                    key={race.id}
                    className={`clickable-row ${race.id === selectedRaceId ? 'selected-row' : ''}`}
                    onClick={() => onRaceSelect(race.id)}
                  >
                    <td>{formatDateTime(race.race_date)}</td>
                    <td>{race.venue_id}</td>
                    <td>{race.race_number}R</td>
                    <td>
                      <span className="race-name">{race.race_name}</span>
                      {race.grade && <span className="race-grade">{race.grade}</span>}
                    </td>
                    <td>{race.track_type} {race.distance}m</td>
                    <td>
                      <button
                        className="race-action-btn race-action-btn--edit"
                        onClick={(e) => { e.stopPropagation(); setEditingRaceId(race.id); }}
                      >
                        編集
                      </button>
                      <button
                        className="race-action-btn race-action-btn--delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('このレースを削除しますか？')) {
                            onDeleteRace(race.id);
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
