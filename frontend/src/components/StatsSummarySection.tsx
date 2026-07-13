import type { StatsSummary } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface StatsSummarySectionProps {
  stats: StatsSummary | null;
  isLoading: boolean;
  error: string | null;
}

export function StatsSummarySection({ stats, isLoading, error }: StatsSummarySectionProps) {
  if (isLoading) {
    return (
      <section className="stats-section">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>データを読み込み中...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="stats-section">
        <div className="error-state">
          <p>Error: {error}</p>
        </div>
      </section>
    );
  }

  if (!stats) return null;

  return (
    <section className="stats-section">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Bet</h3>
          <p className="stat-value">{formatCurrency(stats.total_bet)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Return</h3>
          <p className="stat-value highlight">{formatCurrency(stats.total_return)}</p>
        </div>
        <div className="stat-card">
          <h3>Profit</h3>
          <p className={`stat-value ${stats.profit >= 0 ? 'highlight' : 'negative'}`}>
            {formatCurrency(stats.profit)}
          </p>
        </div>
        <div className="stat-card">
          <h3>ROI</h3>
          <p className={`stat-value ${stats.roi && stats.roi >= 100 ? 'highlight' : ''}`}>
            {formatPercent(stats.roi)}
          </p>
        </div>
        <div className="stat-card">
          <h3>Race Count</h3>
          <p className="stat-value">{stats.race_count}</p>
        </div>
        <div className="stat-card">
          <h3>Hit Count</h3>
          <p className="stat-value">{stats.hit_count}</p>
        </div>
      </div>
    </section>
  );
}
