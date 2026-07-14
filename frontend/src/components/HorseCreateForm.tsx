import { useState } from 'react';
import { createHorse } from '../api/client';
import type { HorseCreate } from '../types';

interface HorseCreateFormProps {
  raceId: number;
  onSuccess: () => void;
}

export function HorseCreateForm({ raceId, onSuccess }: HorseCreateFormProps) {
  const [postPosition, setPostPosition] = useState<string>('');
  const [horseName, setHorseName] = useState<string>('');
  const [jockey, setJockey] = useState<string>('');
  const [popularity, setPopularity] = useState<string>('');
  const [odds, setOdds] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postPosition || !horseName) {
      setError('馬番、馬名は必須です');
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload: HorseCreate = {
      post_position: parseInt(postPosition, 10),
      horse_name: horseName.trim(),
      jockey: jockey.trim() === '' ? null : jockey.trim(),
      popularity: popularity.trim() === '' ? null : parseInt(popularity, 10),
      odds: odds.trim() === '' ? null : parseFloat(odds),
    };

    try {
      await createHorse(raceId, payload);
      // Success, clear form
      setPostPosition('');
      setHorseName('');
      setJockey('');
      setPopularity('');
      setOdds('');
      onSuccess();
    } catch (err: any) {
      setError(err.message || '出走馬の登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="form-section">
      <h2 className="section-title">出走馬登録</h2>
      <form className="race-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>馬番 (必須)</label>
            <input type="number" min="1" value={postPosition} onChange={e => setPostPosition(e.target.value)} placeholder="例: 1" required />
          </div>
          <div className="form-group">
            <label>馬名 (必須)</label>
            <input type="text" value={horseName} onChange={e => setHorseName(e.target.value)} placeholder="例: ディープインパクト" required />
          </div>
          <div className="form-group">
            <label>騎手</label>
            <input type="text" value={jockey} onChange={e => setJockey(e.target.value)} placeholder="例: 武豊" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>人気</label>
            <input type="number" min="1" value={popularity} onChange={e => setPopularity(e.target.value)} placeholder="例: 1" />
          </div>
          <div className="form-group">
            <label>オッズ</label>
            <input type="number" step="0.1" min="1.0" value={odds} onChange={e => setOdds(e.target.value)} placeholder="例: 1.5" />
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? '登録中...' : '登録する'}
          </button>
        </div>
      </form>
    </section>
  );
}
