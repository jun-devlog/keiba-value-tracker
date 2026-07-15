import { useState } from 'react';
import { createPrediction } from '../api/client';
import type { PredictionCreate, Horse } from '../types';

interface PredictionCreateFormProps {
  raceId: number;
  horses: Horse[];
  isHorsesLoading: boolean;
  onSuccess: () => void;
}

export function PredictionCreateForm({ raceId, horses, isHorsesLoading, onSuccess }: PredictionCreateFormProps) {
  const [horseId, setHorseId] = useState<string>('');
  const [rank, setRank] = useState<string>('');
  const [confidence, setConfidence] = useState<string>('');
  const [memo, setMemo] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!horseId || !rank) {
      setError('出走馬ID、順位は必須です');
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload: PredictionCreate = {
      horse_id: parseInt(horseId, 10),
      rank: parseInt(rank, 10),
      confidence: confidence.trim() === '' ? null : parseFloat(confidence),
      memo: memo.trim() === '' ? null : memo.trim(),
    };

    try {
      await createPrediction(raceId, payload);
      // Success, clear form
      setHorseId('');
      setRank('');
      setConfidence('');
      setMemo('');
      onSuccess();
    } catch (err: any) {
      setError(err.message || '予想の登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="form-section">
      <h2 className="section-title">予想登録</h2>
      <form className="race-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>出走馬 (必須)</label>
            <select value={horseId} onChange={e => setHorseId(e.target.value)} required disabled={isHorsesLoading || horses.length === 0}>
              <option value="" disabled>出走馬を選択してください</option>
              {isHorsesLoading ? (
                <option disabled>出走馬を読み込み中...</option>
              ) : horses.length === 0 ? (
                <option disabled>出走馬が登録されていません</option>
              ) : (
                horses.map(h => (
                  <option key={h.id} value={h.id}>{h.post_position} - {h.horse_name}</option>
                ))
              )}
            </select>
          </div>
          <div className="form-group">
            <label>予想順位 (必須)</label>
            <input type="number" min="1" value={rank} onChange={e => setRank(e.target.value)} placeholder="例: 1" required />
          </div>
          <div className="form-group">
            <label>自信度 (0〜1)</label>
            <input type="number" step="0.01" min="0" max="1" value={confidence} onChange={e => setConfidence(e.target.value)} placeholder="例: 0.85" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>メモ</label>
            <input type="text" value={memo} onChange={e => setMemo(e.target.value)} placeholder="例: 本命" />
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isHorsesLoading || horses.length === 0 || isLoading}>
            {isLoading ? '登録中...' : '登録する'}
          </button>
        </div>
      </form>
    </section>
  );
}
