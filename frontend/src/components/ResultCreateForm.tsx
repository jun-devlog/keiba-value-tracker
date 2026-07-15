import { useState } from 'react';
import { createResult } from '../api/client';
import type { ResultCreate } from '../types';

interface ResultCreateFormProps {
  raceId: number;
  onSuccess: () => void;
}

export function ResultCreateForm({ raceId, onSuccess }: ResultCreateFormProps) {
  const [orderOfFinish, setOrderOfFinish] = useState<string>('');
  const [totalReturn, setTotalReturn] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderOfFinish || !totalReturn) {
      setError('着順、払戻総額は必須です');
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload: ResultCreate = {
      order_of_finish: orderOfFinish.trim(),
      total_return: parseInt(totalReturn, 10),
    };

    try {
      await createResult(raceId, payload);
      // Success, clear form
      setOrderOfFinish('');
      setTotalReturn('');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'レース結果の登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="form-section">
      <h2 className="section-title">レース結果登録</h2>
      <form className="race-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>着順 (必須)</label>
            <input type="text" value={orderOfFinish} onChange={e => setOrderOfFinish(e.target.value)} placeholder="例: 1-2-5" required />
          </div>
          <div className="form-group">
            <label>払戻総額 (必須)</label>
            <input type="number" min="0" value={totalReturn} onChange={e => setTotalReturn(e.target.value)} placeholder="例: 1500" required />
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
