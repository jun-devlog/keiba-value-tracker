import { useState } from 'react';
import type { Horse, HorseUpdate } from '../types';

interface HorseUpdateFormProps {
  horse: Horse;
  onSave: (data: HorseUpdate) => Promise<void>;
  onCancel: () => void;
}

export function HorseUpdateForm({ horse, onSave, onCancel }: HorseUpdateFormProps) {
  const [postPosition, setPostPosition] = useState<string>(horse.post_position.toString());
  const [horseName, setHorseName] = useState<string>(horse.horse_name);
  const [jockey, setJockey] = useState<string>(horse.jockey || '');
  const [popularity, setPopularity] = useState<string>(horse.popularity?.toString() || '');
  const [odds, setOdds] = useState<string>(horse.odds?.toString() || '');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!postPosition || !horseName.trim()) {
      setError('馬番と馬名は必須です');
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload: HorseUpdate = {
      post_position: parseInt(postPosition, 10),
      horse_name: horseName.trim(),
      jockey: jockey.trim() || null,
      popularity: popularity ? parseInt(popularity, 10) : null,
      odds: odds ? parseFloat(odds) : null,
    };

    try {
      await onSave(payload);
    } catch (err: any) {
      setError(err.message || '出走馬の更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="race-item editing" onClick={(e) => e.stopPropagation()}>
      <form className="race-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>馬番 (必須)</label>
            <input
              type="number"
              min="1"
              value={postPosition}
              onChange={(e) => setPostPosition(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>馬名 (必須)</label>
            <input
              type="text"
              value={horseName}
              onChange={(e) => setHorseName(e.target.value)}
              placeholder="例: ディープインパクト"
              required
            />
          </div>
          <div className="form-group">
            <label>騎手</label>
            <input
              type="text"
              value={jockey}
              onChange={(e) => setJockey(e.target.value)}
              placeholder="例: 武豊"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>人気</label>
            <input
              type="number"
              min="1"
              value={popularity}
              onChange={(e) => setPopularity(e.target.value)}
              placeholder="例: 1"
            />
          </div>
          <div className="form-group">
            <label>オッズ</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={odds}
              onChange={(e) => setOdds(e.target.value)}
              placeholder="例: 2.5"
            />
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? '保存中...' : '保存'}
          </button>
          <button
            type="button"
            className="submit-button"
            style={{ backgroundColor: 'var(--text-secondary)' }}
            onClick={(e) => { e.stopPropagation(); onCancel(); }}
            disabled={isLoading}
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
