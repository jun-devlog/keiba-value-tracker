import { useState, useEffect } from 'react';
import { fetchBetTypes } from '../api/client';
import type { Bet, BetUpdate, BetType } from '../types';

interface BetUpdateFormProps {
  bet: Bet;
  onSave: (data: BetUpdate) => Promise<void>;
  onCancel: () => void;
}

export function BetUpdateForm({ bet, onSave, onCancel }: BetUpdateFormProps) {
  const [betTypeId, setBetTypeId] = useState<string>(bet.bet_type_id.toString());
  const [amount, setAmount] = useState<string>(bet.amount.toString());
  const [combination, setCombination] = useState<string>(bet.combination || '');

  const [betTypes, setBetTypes] = useState<BetType[]>([]);
  const [isBetTypesLoading, setIsBetTypesLoading] = useState<boolean>(true);
  const [betTypesError, setBetTypesError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBetTypes()
      .then(setBetTypes)
      .catch((err: Error) => setBetTypesError(err.message))
      .finally(() => setIsBetTypesLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!betTypeId || !amount) {
      setError('券種と金額は必須です');
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload: BetUpdate = {
      bet_type_id: parseInt(betTypeId, 10),
      amount: parseInt(amount, 10),
      combination: combination.trim() === '' ? null : combination.trim(),
    };

    try {
      await onSave(payload);
    } catch (err: any) {
      setError(err.message || '馬券の更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="race-item editing" onClick={(e) => e.stopPropagation()}>
      <form className="race-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>券種 (必須)</label>
            <select
              value={betTypeId}
              onChange={(e) => setBetTypeId(e.target.value)}
              required
              disabled={isBetTypesLoading || !!betTypesError || betTypes.length === 0}
            >
              <option value="" disabled>券種を選択してください</option>
              {isBetTypesLoading && <option disabled>券種を取得中...</option>}
              {betTypesError && <option disabled>エラーが発生しました</option>}
              {!isBetTypesLoading && !betTypesError && betTypes.map((bt) => (
                <option key={bt.id} value={bt.id}>{bt.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>金額 (必須)</label>
            <input
              type="number"
              min="100"
              step="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="例: 1000"
              required
            />
          </div>
          <div className="form-group">
            <label>買い目</label>
            <input
              type="text"
              value={combination}
              onChange={(e) => setCombination(e.target.value)}
              placeholder="例: 1-2"
            />
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}
        {betTypesError && <div className="form-error">券種マスタの取得に失敗しました: {betTypesError}</div>}

        <div className="form-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button
            type="submit"
            className="submit-button"
            disabled={isBetTypesLoading || !!betTypesError || betTypes.length === 0 || isLoading}
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
