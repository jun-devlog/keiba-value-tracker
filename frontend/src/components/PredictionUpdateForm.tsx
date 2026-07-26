import { useState } from 'react';
import type { Prediction, PredictionUpdate, Horse } from '../types';

interface PredictionUpdateFormProps {
  prediction: Prediction;
  horses: Horse[];
  onSave: (data: PredictionUpdate) => Promise<void>;
  onCancel: () => void;
}

export function PredictionUpdateForm({ prediction, horses, onSave, onCancel }: PredictionUpdateFormProps) {
  const [horseId, setHorseId] = useState<string>(prediction.horse_id.toString());
  const [rank, setRank] = useState<string>(prediction.rank?.toString() || '');
  const [confidence, setConfidence] = useState<string>(prediction.confidence?.toString() || '');
  const [memo, setMemo] = useState<string>(prediction.memo || '');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!horseId || !rank) {
      setError('出走馬と予想順位は必須です');
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload: PredictionUpdate = {
      horse_id: parseInt(horseId, 10),
      rank: parseInt(rank, 10),
      confidence: confidence.trim() === '' ? null : parseFloat(confidence),
      memo: memo.trim() === '' ? null : memo.trim(),
    };

    try {
      await onSave(payload);
    } catch (err: any) {
      setError(err.message || '予想の更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="race-item editing" onClick={(e) => e.stopPropagation()}>
      <form className="race-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>出走馬 (必須)</label>
            <select
              value={horseId}
              onChange={(e) => setHorseId(e.target.value)}
              required
              disabled={horses.length === 0}
            >
              <option value="" disabled>出走馬を選択してください</option>
              {horses.length === 0 ? (
                <option disabled>出走馬が登録されていません</option>
              ) : (
                horses.map((h) => (
                  <option key={h.id} value={h.id}>{h.post_position} - {h.horse_name}</option>
                ))
              )}
            </select>
          </div>
          <div className="form-group">
            <label>予想順位 (必須)</label>
            <input
              type="number"
              min="1"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              placeholder="例: 1"
              required
            />
          </div>
          <div className="form-group">
            <label>自信度 (0〜1)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={confidence}
              onChange={(e) => setConfidence(e.target.value)}
              placeholder="例: 0.85"
            />
          </div>
          <div className="form-group">
            <label>メモ</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="例: 本命"
            />
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button
            type="submit"
            className="submit-button"
            disabled={horses.length === 0 || isLoading}
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
