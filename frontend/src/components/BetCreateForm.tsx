import { useState, useEffect } from 'react';
import { createBet, fetchBetTypes } from '../api/client';
import type { BetCreate, BetType } from '../types';

interface BetCreateFormProps {
  raceId: number;
  onSuccess: () => void;
}

export function BetCreateForm({ raceId, onSuccess }: BetCreateFormProps) {
  const [betTypeId, setBetTypeId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [combination, setCombination] = useState<string>('');

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
    if (!betTypeId || !amount) {
      setError('券種ID、金額は必須です');
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload: BetCreate = {
      bet_type_id: parseInt(betTypeId, 10),
      amount: parseInt(amount, 10),
      combination: combination.trim() === '' ? null : combination.trim(),
    };

    try {
      await createBet(raceId, payload);
      // Success, clear form
      setBetTypeId('');
      setAmount('');
      setCombination('');
      onSuccess();
    } catch (err: any) {
      setError(err.message || '馬券の登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="form-section">
      <h2 className="section-title">馬券購入登録</h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '0.5rem' }}>
        ※券種IDは bet_types マスタのIDを入力してください。例: 1=単勝, 4=馬連
      </p>
      <form className="race-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>券種ID (必須)</label>
            <select value={betTypeId} onChange={e => setBetTypeId(e.target.value)} required>
              <option value="" disabled>券種を選択してください</option>
              {isBetTypesLoading && <option disabled>券種を取得中...</option>}
              {betTypesError && <option disabled>エラーが発生しました</option>}
              {!isBetTypesLoading && !betTypesError && betTypes.map(bt => (
                <option key={bt.id} value={bt.id}>{bt.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>金額 (必須)</label>
            <input type="number" min="100" step="100" value={amount} onChange={e => setAmount(e.target.value)} placeholder="例: 1000" required />
          </div>
          <div className="form-group">
            <label>買い目</label>
            <input type="text" value={combination} onChange={e => setCombination(e.target.value)} placeholder="例: 1-2" />
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}
        {betTypesError && <div className="form-error">券種マスタの取得に失敗しました: {betTypesError}</div>}

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isBetTypesLoading || !!betTypesError || betTypes.length === 0 || isLoading}>
            {isLoading ? '登録中...' : '登録する'}
          </button>
        </div>
      </form>
    </section>
  );
}
