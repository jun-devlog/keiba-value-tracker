import { useEffect, useState } from 'react';
import { fetchStatsSummary, fetchRaces, fetchHorsesByRaceId, fetchPredictionsByRaceId, fetchBetsByRaceId, fetchResultByRaceId } from './api/client';
import type { StatsSummary, Race, Horse, Prediction, Bet, Result } from './types';
import { StatsSummarySection } from './components/StatsSummarySection';
import { RacesSection } from './components/RacesSection';
import { RaceCreateForm } from './components/RaceCreateForm';
import { HorseCreateForm } from './components/HorseCreateForm';
import { HorsesSection } from './components/HorsesSection';
import { PredictionCreateForm } from './components/PredictionCreateForm';
import { PredictionsSection } from './components/PredictionsSection';
import { BetCreateForm } from './components/BetCreateForm';
import { BetsSection } from './components/BetsSection';
import { ResultCreateForm } from './components/ResultCreateForm';
import { ResultSection } from './components/ResultSection';
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






  const loadStats = () => {
    setIsLoading(true);
    setError(null);
    fetchStatsSummary()
      .then((summary) => {
        setData(summary);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadStats();
  }, []);

  const loadRaces = () => {
    setIsRacesLoading(true);
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
  };

  useEffect(() => {
    loadRaces();
  }, []);

  const loadHorses = (raceId: number) => {
    setIsHorsesLoading(true);
    setHorsesError(null);
    fetchHorsesByRaceId(raceId)
      .then((horsesData) => {
        setHorses(horsesData);
      })
      .catch((err: Error) => {
        setHorsesError(err.message);
      })
      .finally(() => {
        setIsHorsesLoading(false);
      });
  };

  const loadPredictions = (raceId: number) => {
    setIsPredictionsLoading(true);
    setPredictionsError(null);
    fetchPredictionsByRaceId(raceId)
      .then((predictionsData) => {
        setPredictions(predictionsData);
      })
      .catch((err: Error) => {
        setPredictionsError(err.message);
      })
      .finally(() => {
        setIsPredictionsLoading(false);
      });
  };

  const loadBets = (raceId: number) => {
    setIsBetsLoading(true);
    setBetsError(null);
    fetchBetsByRaceId(raceId)
      .then((betsData) => {
        setBets(betsData);
      })
      .catch((err: Error) => {
        setBetsError(err.message);
      })
      .finally(() => {
        setIsBetsLoading(false);
      });
  };

  const loadResult = (raceId: number) => {
    setIsResultLoading(true);
    setResultError(null);
    fetchResultByRaceId(raceId)
      .then((resultData) => {
        setResult(resultData);
      })
      .catch((err: Error) => {
        setResultError(err.message);
      })
      .finally(() => {
        setIsResultLoading(false);
      });
  };

  useEffect(() => {
    if (selectedRaceId === null) {
      setHorses([]);
      setPredictions([]);
      setBets([]);
      setResult(null);
      return;
    }

    loadHorses(selectedRaceId);
    loadPredictions(selectedRaceId);
    loadBets(selectedRaceId);
    loadResult(selectedRaceId);
  }, [selectedRaceId]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Keiba Value Tracker</h1>
      </header>
      
      <main className="app-main">
        <StatsSummarySection stats={data} isLoading={isLoading} error={error} />

        <RaceCreateForm onSuccess={loadRaces} />

        <RacesSection 
          races={races} 
          isLoading={isRacesLoading} 
          error={racesError} 
          selectedRaceId={selectedRaceId} 
          onRaceSelect={setSelectedRaceId} 
        />

        {selectedRaceId && (
          <>
            <HorseCreateForm raceId={selectedRaceId} onSuccess={() => loadHorses(selectedRaceId)} />
            <HorsesSection horses={horses} isLoading={isHorsesLoading} error={horsesError} />
            <PredictionCreateForm raceId={selectedRaceId} horses={horses} isHorsesLoading={isHorsesLoading} onSuccess={() => loadPredictions(selectedRaceId)} />
            <PredictionsSection predictions={predictions} isLoading={isPredictionsLoading} error={predictionsError} />
            <BetCreateForm raceId={selectedRaceId} onSuccess={() => loadBets(selectedRaceId)} />
            <BetsSection bets={bets} isLoading={isBetsLoading} error={betsError} />
            <ResultCreateForm raceId={selectedRaceId} onSuccess={() => { loadResult(selectedRaceId); loadStats(); }} />
            <ResultSection result={result} isLoading={isResultLoading} error={resultError} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
