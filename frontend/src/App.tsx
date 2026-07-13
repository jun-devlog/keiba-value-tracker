import { useEffect, useState } from 'react';
import { fetchStatsSummary, fetchRaces } from './api/client';
import type { StatsSummary, Race } from './types';
import './App.css';

function App() {
  const [data, setData] = useState<StatsSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [races, setRaces] = useState<Race[]>([]);
  const [isRacesLoading, setIsRacesLoading] = useState<boolean>(true);
  const [racesError, setRacesError] = useState<string | null>(null);


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

    fetchRaces()
      .then((racesData) => {
        setRaces(racesData);
        setRacesError(null);
      })
      .catch((err: Error) => {
        setRacesError(err.message);
      })
      .finally(() => {
        setIsRacesLoading(false);
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

        <section className="races-section">
          <h2 className="section-title">Races</h2>
          
          {isRacesLoading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>レース情報を読み込み中...</p>
            </div>
          )}

          {racesError && (
            <div className="error-state">
              <p>Error: {racesError}</p>
            </div>
          )}

          {!isRacesLoading && !racesError && races.length === 0 && (
            <div className="empty-state">
              <p>レース情報が登録されていません</p>
            </div>
          )}

          {!isRacesLoading && !racesError && races.length > 0 && (
            <div className="races-list">
              <table className="races-table">
                <thead>
                  <tr>
                    <th>日付</th>
                    <th>会場ID</th>
                    <th>R</th>
                    <th>レース名</th>
                    <th>コース</th>
                  </tr>
                </thead>
                <tbody>
                  {races.map((race) => (
                    <tr key={race.id}>
                      <td>{race.race_date}</td>
                      <td>{race.venue_id}</td>
                      <td>{race.race_number}R</td>
                      <td>
                        <span className="race-name">{race.race_name}</span>
                        {race.grade && <span className="race-grade">{race.grade}</span>}
                      </td>
                      <td>{race.track_type} {race.distance}m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
