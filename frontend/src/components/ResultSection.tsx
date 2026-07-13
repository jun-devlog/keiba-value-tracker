import type { Result } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface ResultSectionProps {
  result: Result | null;
  isLoading: boolean;
  error: string | null;
}

export function ResultSection({ result, isLoading, error }: ResultSectionProps) {
  return (
    <section className="horses-section">
      <h2 className="section-title">Result</h2>

      {isLoading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>レース結果情報を読み込み中...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>Error: {error}</p>
        </div>
      )}

      {!isLoading && !error && result === null && (
        <div className="empty-state">
          <p>レース結果が登録されていません</p>
        </div>
      )}

      {!isLoading && !error && result !== null && (
        <div className="horses-list">
          <table className="races-table">
            <thead>
              <tr>
                <th>着順</th>
                <th>投資額</th>
                <th>払戻額</th>
                <th>収支</th>
                <th>回収率</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{result.order_of_finish || '-'}</td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(result.total_bet)}</td>
                <td style={{ fontWeight: 600, color: result.total_return > 0 ? '#fbbf24' : 'inherit' }}>
                  {formatCurrency(result.total_return)}
                </td>
                <td style={{ fontWeight: 600, color: result.profit > 0 ? '#34d399' : (result.profit < 0 ? '#f87171' : 'inherit') }}>
                  {formatCurrency(result.profit)}
                </td>
                <td style={{ fontWeight: 600, color: (result.roi && result.roi > 100) ? '#34d399' : 'inherit' }}>
                  {formatPercent(result.roi)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
