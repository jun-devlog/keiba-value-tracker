import { useState, useEffect } from 'react';
import { createRace, fetchVenues } from '../api/client';
import type { RaceCreate, Venue } from '../types';

interface RaceCreateFormProps {
  onSuccess: () => void;
}

export function RaceCreateForm({ onSuccess }: RaceCreateFormProps) {
  const [venueId, setVenueId] = useState<string>('');
  const [raceDate, setRaceDate] = useState<string>('');
  const [raceNumber, setRaceNumber] = useState<string>('');
  const [raceName, setRaceName] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  const [trackType, setTrackType] = useState<string>('');

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
    if (!venueId || !raceDate || !raceNumber) {
      setError('会場ID、レース日、レース番号は必須です');
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload: RaceCreate = {
      venue_id: parseInt(venueId, 10),
      race_date: raceDate,
      race_number: parseInt(raceNumber, 10),
      race_name: raceName.trim() === '' ? null : raceName.trim(),
      grade: grade.trim() === '' ? null : grade.trim(),
      distance: distance.trim() === '' ? null : parseInt(distance, 10),
      track_type: trackType.trim() === '' ? null : trackType.trim(),
    };

    try {
      await createRace(payload);
      // Success, clear form
      setVenueId('');
      setRaceDate('');
      setRaceNumber('');
      setRaceName('');
      setGrade('');
      setDistance('');
      setTrackType('');
      onSuccess();
    } catch (err: any) {
      setError(err.message || '登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="form-section">
      <h2 className="section-title">レース登録</h2>
      <form className="race-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>日付 (必須)</label>
            <input type="date" value={raceDate} onChange={e => setRaceDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>会場ID (必須)</label>
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
          <div className="form-group">
            <label>コース</label>
            <input type="text" value={trackType} onChange={e => setTrackType(e.target.value)} placeholder="例: 芝" />
          </div>
          <div className="form-group">
            <label>距離 (m)</label>
            <input type="number" value={distance} onChange={e => setDistance(e.target.value)} placeholder="例: 2400" />
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}
        {venuesError && <div className="form-error">会場マスタの取得に失敗しました: {venuesError}</div>}

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isVenuesLoading || !!venuesError || venues.length === 0 || isLoading}>
            {isLoading ? '登録中...' : '登録する'}
          </button>
        </div>
      </form>
    </section>
  );
}
