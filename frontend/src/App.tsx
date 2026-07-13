import { useEffect, useState } from 'react';
import { fetchStatsSummary, fetchRaces, fetchHorsesByRaceId, fetchPredictionsByRaceId, fetchBetsByRaceId, fetchResultByRaceId } from './api/client';
import type { StatsSummary, Race, Horse, Prediction, Bet, Result } from './types';
import './App.css';

function App() {
  const [data, setData] = useState<StatsSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [races, setRaces] = useState<Race[]>([]);
  const [isRacesLoading, setIsRacesLoading] = useState<boolean>(true);
  const [racesError, setRacesError] = useState<string | null>(null);

  const [selectedRaceId, setSelectedRaceId] = useState<number | null>(null);
  const [horses, setHorses] = useState<Horse[]>([]);
  const [isHorsesLoading, setIsHorsesLoading] = useState<boolean>(false);
  const [horsesError, setHorsesError] = useState<string | null>(null);

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isPredictionsLoading, setIsPredictionsLoading] = useState<boolean>(false);
  const [predictionsError, setPredictionsError] = useState<string | null>(null);

  const [bets, setBets] = useState<Bet[]>([]);
  const [isBetsLoading, setIsBetsLoading] = useState<boolean>(false);
  const [betsError, setBetsError] = useState<string | null>(null);

  const [result, setResult] = useState<Result | null>(null);
  const [isResultLoading, setIsResultLoading] = useState<boolean>(false);
  const [resultError, setResultError] = useState<string | null>(null);






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

  useEffect(() => {
    if (selectedRaceId === null) {
      setHorses([]);
      setPredictions([]);
      setBets([]);
      setResult(null);
      return;
    }

    setIsHorsesLoading(true);
    fetchHorsesByRaceId(selectedRaceId)
      .then((horsesData) => {
        setHorses(horsesData);
        setHorsesError(null);
      })
      .catch((err: Error) => {
        setHorsesError(err.message);
      })
      .finally(() => {
        setIsHorsesLoading(false);
      });

    setIsPredictionsLoading(true);
    fetchPredictionsByRaceId(selectedRaceId)
      .then((predictionsData) => {
        setPredictions(predictionsData);
        setPredictionsError(null);
      })
      .catch((err: Error) => {
        setPredictionsError(err.message);
      })
      .finally(() => {
        setIsPredictionsLoading(false);
      });

    setIsBetsLoading(true);
    fetchBetsByRaceId(selectedRaceId)
      .then((betsData) => {
        setBets(betsData);
        setBetsError(null);
      })
      .catch((err: Error) => {
        setBetsError(err.message);
      })
      .finally(() => {
        setIsBetsLoading(false);
      });

    setIsResultLoading(true);
    fetchResultByRaceId(selectedRaceId)
      .then((resultData) => {
        setResult(resultData);
        setResultError(null);
      })
      .catch((err: Error) => {
        setResultError(err.message);
      })
      .finally(() => {
        setIsResultLoading(false);
      });
  }, [selectedRaceId]);

  const getMarkByRank = (rank: number | null): string => {
    if (rank === 1) return '◎';
    if (rank === 2) return '○';
    if (rank === 3) return '▲';
    if (rank === 4) return '△';
    if (rank !== null) return '☆';
    return '-';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value);
  };

  const formatDateTime = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPercent = (value: number | null) => {
    if (value === null) return '-';
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
                    <tr 
                      key={race.id}
                      className={`clickable-row ${race.id === selectedRaceId ? 'selected-row' : ''}`}
                      onClick={() => setSelectedRaceId(race.id)}
                    >
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

        {selectedRaceId && (
          <section className="horses-section">
            <h2 className="section-title">Horses</h2>

            {isHorsesLoading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>出走馬情報を読み込み中...</p>
              </div>
            )}

            {horsesError && (
              <div className="error-state">
                <p>Error: {horsesError}</p>
              </div>
            )}

            {!isHorsesLoading && !horsesError && horses.length === 0 && (
              <div className="empty-state">
                <p>出走馬が登録されていません</p>
              </div>
            )}

            {!isHorsesLoading && !horsesError && horses.length > 0 && (
              <div className="horses-list">
                <table className="races-table">
                  <thead>
                    <tr>
                      <th>馬番</th>
                      <th>馬名</th>
                      <th>騎手</th>
                      <th>人気</th>
                      <th>オッズ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {horses.map((horse) => (
                      <tr key={horse.id}>
                        <td>{horse.post_position}</td>
                        <td><span className="horse-name">{horse.horse_name}</span></td>
                        <td>{horse.jockey || '-'}</td>
                        <td>{horse.popularity ? `${horse.popularity}番人気` : '-'}</td>
                        <td>{horse.odds ? horse.odds.toFixed(1) : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {selectedRaceId && (
          <section className="horses-section">
            <h2 className="section-title">Predictions</h2>

            {isPredictionsLoading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>予想情報を読み込み中...</p>
              </div>
            )}

            {predictionsError && (
              <div className="error-state">
                <p>Error: {predictionsError}</p>
              </div>
            )}

            {!isPredictionsLoading && !predictionsError && predictions.length === 0 && (
              <div className="empty-state">
                <p>予想が登録されていません</p>
              </div>
            )}

            {!isPredictionsLoading && !predictionsError && predictions.length > 0 && (
              <div className="horses-list">
                <table className="races-table">
                  <thead>
                    <tr>
                      <th>印</th>
                      <th>順位</th>
                      <th>出走馬ID</th>
                      <th>自信度</th>
                      <th>メモ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictions.map((prediction) => (
                      <tr key={prediction.id}>
                        <td className="prediction-mark">{getMarkByRank(prediction.rank)}</td>
                        <td>{prediction.rank || '-'}</td>
                        <td>{prediction.horse_id}</td>
                        <td>{prediction.confidence !== null ? prediction.confidence.toFixed(2) : '-'}</td>
                        <td>{prediction.memo || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {selectedRaceId && (
          <section className="horses-section">
            <h2 className="section-title">Bets</h2>

            {isBetsLoading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>馬券購入情報を読み込み中...</p>
              </div>
            )}

            {betsError && (
              <div className="error-state">
                <p>Error: {betsError}</p>
              </div>
            )}

            {!isBetsLoading && !betsError && bets.length === 0 && (
              <div className="empty-state">
                <p>馬券購入履歴が登録されていません</p>
              </div>
            )}

            {!isBetsLoading && !betsError && bets.length > 0 && (
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
        )}

        {selectedRaceId && (
          <section className="horses-section">
            <h2 className="section-title">Result</h2>

            {isResultLoading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>レース結果情報を読み込み中...</p>
              </div>
            )}

            {resultError && (
              <div className="error-state">
                <p>Error: {resultError}</p>
              </div>
            )}

            {!isResultLoading && !resultError && result === null && (
              <div className="empty-state">
                <p>レース結果が登録されていません</p>
              </div>
            )}

            {!isResultLoading && !resultError && result !== null && (
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
        )}
      </main>
    </div>
  );
}

export default App;
