import { useEffect, useState } from 'react';
import { fetchStatsSummary, fetchRaces, fetchHorsesByRaceId, fetchPredictionsByRaceId, fetchBetsByRaceId, fetchResultByRaceId, updateRace, deleteRace, updateHorse, deleteHorse, updatePrediction, deletePrediction, updateBet, deleteBet, updateResult, deleteResult } from './api/client';
import type { StatsSummary, Race, Horse, Prediction, Bet, Result, RaceUpdate, HorseUpdate, PredictionUpdate, BetUpdate, ResultUpdate } from './types';
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
import { LandingPage } from './components/LandingPage';
import './App.css';

function App() {
  const [showDashboard, setShowDashboard] = useState<boolean>(false);
  
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

  const handleUpdateRace = async (raceId: number, data: RaceUpdate) => {
    await updateRace(raceId, data);
    loadRaces();
  };

  const handleDeleteRace = async (raceId: number) => {
    await deleteRace(raceId);
    if (selectedRaceId === raceId) {
      setSelectedRaceId(null);
    }
    loadRaces();
  };

  const handleUpdateHorse = async (horseId: number, data: HorseUpdate) => {
    await updateHorse(horseId, data);
    if (selectedRaceId) loadHorses(selectedRaceId);
  };

  const handleDeleteHorse = async (horseId: number) => {
    await deleteHorse(horseId);
    if (selectedRaceId) {
      loadHorses(selectedRaceId);
      loadPredictions(selectedRaceId);
    }
  };

  const handleUpdatePrediction = async (predictionId: number, data: PredictionUpdate) => {
    await updatePrediction(predictionId, data);
    if (selectedRaceId) loadPredictions(selectedRaceId);
  };

  const handleDeletePrediction = async (predictionId: number) => {
    await deletePrediction(predictionId);
    if (selectedRaceId) loadPredictions(selectedRaceId);
  };

  const handleUpdateBet = async (betId: number, data: BetUpdate) => {
    await updateBet(betId, data);
    if (selectedRaceId) {
      loadBets(selectedRaceId);
      loadResult(selectedRaceId);
    }
    loadStats();
  };

  const handleDeleteBet = async (betId: number) => {
    await deleteBet(betId);
    if (selectedRaceId) {
      loadBets(selectedRaceId);
      loadResult(selectedRaceId);
    }
    loadStats();
  };

  const handleUpdateResult = async (resultId: number, data: ResultUpdate) => {
    await updateResult(resultId, data);
    if (selectedRaceId) {
      loadResult(selectedRaceId);
    }
    loadStats();
  };

  const handleDeleteResult = async (resultId: number) => {
    await deleteResult(resultId);
    if (selectedRaceId) {
      loadResult(selectedRaceId);
    }
    loadStats();
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
        <div className="app-header-title">
          <h1>Keiba Value Tracker</h1>
          <span className="badge-version">v0.3.0 MVP</span>
        </div>
      </header>

      {!showDashboard ? (
        <LandingPage onEnter={() => setShowDashboard(true)} />
      ) : (
        <main className="app-main">
          <StatsSummarySection stats={data} isLoading={isLoading} error={error} />

          <RaceCreateForm onSuccess={loadRaces} />

          <RacesSection 
            races={races} 
            isLoading={isRacesLoading} 
            error={racesError} 
            selectedRaceId={selectedRaceId} 
            onRaceSelect={setSelectedRaceId} 
            onUpdateRace={handleUpdateRace}
            onDeleteRace={handleDeleteRace}
          />

          {selectedRaceId && (
            <div className="details-area">
              <HorseCreateForm raceId={selectedRaceId} onSuccess={() => loadHorses(selectedRaceId)} />
              <HorsesSection
                horses={horses}
                isLoading={isHorsesLoading}
                error={horsesError}
                onUpdateHorse={handleUpdateHorse}
                onDeleteHorse={handleDeleteHorse}
              />
              <PredictionCreateForm raceId={selectedRaceId} horses={horses} isHorsesLoading={isHorsesLoading} onSuccess={() => loadPredictions(selectedRaceId)} />
              <PredictionsSection predictions={predictions} isLoading={isPredictionsLoading} error={predictionsError} horses={horses} onUpdatePrediction={handleUpdatePrediction} onDeletePrediction={handleDeletePrediction} />
              <BetCreateForm raceId={selectedRaceId} onSuccess={() => loadBets(selectedRaceId)} />
              <BetsSection bets={bets} isLoading={isBetsLoading} error={betsError} onUpdateBet={handleUpdateBet} onDeleteBet={handleDeleteBet} />
              <ResultCreateForm raceId={selectedRaceId} onSuccess={() => { loadResult(selectedRaceId); loadStats(); }} />
              <ResultSection result={result} isLoading={isResultLoading} error={resultError} onUpdateResult={handleUpdateResult} onDeleteResult={handleDeleteResult} />
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
