import { useState } from 'react';
import type { Result, ResultUpdate } from '../types';

interface ResultUpdateFormProps {
  result: Result;
  onSave: (data: ResultUpdate) => Promise<void>;
  onCancel: () => void;
}

export function ResultUpdateForm({ result, onSave, onCancel }: ResultUpdateFormProps) {
  const [orderOfFinish, setOrderOfFinish] = useState<string>(result.order_of_finish || '');
  const [totalReturn, setTotalReturn] = useState<string>(result.total_return.toString());

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!orderOfFinish.trim() || !totalReturn) {
      setError('着順と払戻額は必須です');
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload: ResultUpdate = {
      order_of_finish: orderOfFinish.trim(),
      total_return: parseInt(totalReturn, 10),
    };

    try {
      await onSave(payload);
    } catch (err: any) {
      setError(err.message || 'レース結果の更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="race-item editing" onClick={(e) => e.stopPropagation()}>
      <form className="race-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>着順 (必須)</label>
            <input
              type="text"
              value={orderOfFinish}
              onChange={(e) => setOrderOfFinish(e.target.value)}
              placeholder="例: 1-2-3"
              required
            />
          </div>
          <div className="form-group">
            <label>払戻金合計 (必須)</label>
            <input
              type="number"
              min="0"
              value={totalReturn}
              onChange={(e) => setTotalReturn(e.target.value)}
              placeholder="例: 500"
              required
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
