import { useEffect, useState } from 'react';
import { fetchStatsSummary } from './api/client';
import type { StatsSummary } from './types';
import './App.css';

function App() {
  const [data, setData] = useState<StatsSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatsSummary()
      .then((summary) => {
        setData(summary);
        setError(null);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value);
  };

  const formatPercent = (value: number | null) => {
    if (value === null) return '- %';
    return `${value.toFixed(1)} %`;
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Keiba Value Tracker</h1>
        <p className="subtitle">Data Analysis & Income Management</p>
      </header>

      <main className="dashboard-main">
        {isLoading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>読み込み中...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>Error: {error}</p>
          </div>
        )}

        {!isLoading && !error && data && (
          <div className="summary-grid">
            <div className="summary-card">
              <span className="card-label">投資額</span>
              <span className="card-value">{formatCurrency(data.total_bet)}</span>
            </div>
            <div className="summary-card">
              <span className="card-label">払戻額</span>
              <span className="card-value">{formatCurrency(data.total_return)}</span>
            </div>
            <div className="summary-card">
              <span className="card-label">収支</span>
              <span className={`card-value ${data.profit >= 0 ? 'positive' : 'negative'}`}>
                {data.profit >= 0 ? '+' : ''}{formatCurrency(data.profit)}
              </span>
            </div>
            <div className="summary-card">
              <span className="card-label">回収率 (ROI)</span>
              <span className={`card-value ${data.roi && data.roi >= 100 ? 'positive' : 'neutral'}`}>
                {formatPercent(data.roi)}
              </span>
            </div>
            <div className="summary-card">
              <span className="card-label">レース数</span>
              <span className="card-value">{data.race_count} <span className="unit">件</span></span>
            </div>
            <div className="summary-card">
              <span className="card-label">的中数</span>
              <span className="card-value">{data.hit_count} <span className="unit">件</span></span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
