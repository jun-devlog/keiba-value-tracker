import type { Bet } from '../types';
import { formatCurrency, formatDateTime } from '../utils/formatters';

interface BetsSectionProps {
  bets: Bet[];
  isLoading: boolean;
  error: string | null;
}

export function BetsSection({ bets, isLoading, error }: BetsSectionProps) {
  return (
    <section className="horses-section">
      <h2 className="section-title">Bets</h2>

      {isLoading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>馬券購入情報を読み込み中...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>Error: {error}</p>
        </div>
      )}

      {!isLoading && !error && bets.length === 0 && (
        <div className="empty-state">
          <p>馬券購入履歴が登録されていません</p>
        </div>
      )}

      {!isLoading && !error && bets.length > 0 && (
        <div className="horses-list">
          <table className="races-table">
            <thead>
              <tr>
                <th>券種ID</th>
                <th>金額</th>
                <th>買い目</th>
                <th>購入日時</th>
              </tr>
            </thead>
            <tbody>
              {bets.map((bet) => (
                <tr key={bet.id}>
                  <td>{bet.bet_type_id}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(bet.amount)}</td>
                  <td>{bet.combination || '-'}</td>
                  <td>{formatDateTime(bet.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
