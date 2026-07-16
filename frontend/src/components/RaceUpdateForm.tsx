import { useState, useEffect } from 'react';
import { fetchVenues } from '../api/client';
import type { Race, RaceUpdate, Venue } from '../types';

interface RaceUpdateFormProps {
  race: Race;
  onSave: (data: RaceUpdate) => Promise<void>;
  onCancel: () => void;
}

export function RaceUpdateForm({ race, onSave, onCancel }: RaceUpdateFormProps) {
  const [venueId, setVenueId] = useState<string>(race.venue_id.toString());
  const [raceDate, setRaceDate] = useState<string>(race.race_date);
  const [raceNumber, setRaceNumber] = useState<string>(race.race_number.toString());
  const [raceName, setRaceName] = useState<string>(race.race_name || '');
  const [grade, setGrade] = useState<string>(race.grade || '');
  const [distance, setDistance] = useState<string>(race.distance?.toString() || '');
  const [trackType, setTrackType] = useState<string>(race.track_type || '');

  const [venues, setVenues] = useState<Venue[]>([]);
  const [isVenuesLoading, setIsVenuesLoading] = useState<boolean>(true);
  const [venuesError, setVenuesError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVenues()
      .then(setVenues)
      .catch((err: Error) => setVenuesError(err.message))
      .finally(() => setIsVenuesLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!venueId || !raceDate || !raceNumber) {
      setError('会場、日付、レース番号は必須です');
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload: RaceUpdate = {
      venue_id: parseInt(venueId, 10),
      race_date: raceDate,
      race_number: parseInt(raceNumber, 10),
      race_name: raceName.trim() || null,
      grade: grade.trim() || null,
      distance: distance ? parseInt(distance, 10) : null,
      track_type: trackType.trim() || null,
    };

    try {
      await onSave(payload);
    } catch (err: any) {
      setError(err.message || 'レースの更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="race-item editing" onClick={e => e.stopPropagation()}>
      <form className="race-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>会場 (必須)</label>
            <select value={venueId} onChange={e => setVenueId(e.target.value)} required>
              <option value="" disabled>会場を選択してください</option>
              {isVenuesLoading && <option disabled>会場を取得中...</option>}
              {venuesError && <option disabled>エラーが発生しました</option>}
              {!isVenuesLoading && !venuesError && venues.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>R (必須)</label>
            <input type="number" min="1" max="12" value={raceNumber} onChange={e => setRaceNumber(e.target.value)} placeholder="例: 11" required />
          </div>
          <div className="form-group">
            <label>日付 (必須)</label>
            <input type="date" value={raceDate} onChange={e => setRaceDate(e.target.value)} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>レース名</label>
            <input type="text" value={raceName} onChange={e => setRaceName(e.target.value)} placeholder="例: 日本ダービー" />
          </div>
          <div className="form-group">
            <label>グレード</label>
            <input type="text" value={grade} onChange={e => setGrade(e.target.value)} placeholder="例: G1" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>距離 (m)</label>
            <input type="number" min="1000" value={distance} onChange={e => setDistance(e.target.value)} placeholder="例: 2400" />
          </div>
          <div className="form-group">
            <label>馬場</label>
            <input type="text" value={trackType} onChange={e => setTrackType(e.target.value)} placeholder="例: 芝" />
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}
        {venuesError && <div className="form-error">会場マスタの取得に失敗しました: {venuesError}</div>}

        <div className="form-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="submit-button" disabled={isVenuesLoading || !!venuesError || venues.length === 0 || isLoading}>
            {isLoading ? '保存中...' : '保存'}
          </button>
          <button type="button" className="submit-button" style={{ backgroundColor: 'var(--text-secondary)' }} onClick={(e) => { e.stopPropagation(); onCancel(); }} disabled={isLoading}>
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
