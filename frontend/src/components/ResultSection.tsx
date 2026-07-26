import { useState } from 'react';
import type { Result, ResultUpdate } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { ResultUpdateForm } from './ResultUpdateForm';

interface ResultSectionProps {
  result: Result | null;
  isLoading: boolean;
  error: string | null;
  onUpdateResult: (resultId: number, data: ResultUpdate) => Promise<void>;
  onDeleteResult: (resultId: number) => Promise<void>;
}

export function ResultSection({ result, isLoading, error, onUpdateResult, onDeleteResult }: ResultSectionProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  return (
    <section className="horses-section">
      <h2 className="section-title">Result</h2>

      {isLoading && (
        <div className="state-container">
          <div className="spinner"></div>
          <p>レース結果情報を読み込み中...</p>
        </div>
      )}

      {error && (
        <div className="state-container error">
          <p>Error: {error}</p>
        </div>
      )}

      {deleteError && (
        <div className="state-container error">
          <p>{deleteError}</p>
        </div>
      )}

      {!isLoading && !error && result === null && (
        <div className="state-container">
          <p>レース結果が登録されていません</p>
        </div>
      )}

      {!isLoading && !error && result !== null && (
        <div className="data-section">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>着順</th>
                  <th>投資額</th>
                  <th>払戻額</th>
                  <th>収支</th>
                  <th>回収率</th>
                  <th>アクション</th>
                </tr>
              </thead>
              <tbody>
                {isEditing ? (
                  <tr className="inline-edit-row">
                    <td colSpan={6}>
                      <ResultUpdateForm
                        result={result}
                        onSave={async (data) => {
                          await onUpdateResult(result.id, data);
                          setIsEditing(false);
                        }}
                        onCancel={() => setIsEditing(false)}
                      />
                    </td>
                  </tr>
                ) : (
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
                    <td>
                      <button
                        className="race-action-btn race-action-btn--edit"
                        onClick={(e) => { e.stopPropagation(); setDeleteError(null); setIsEditing(true); }}
                      >
                        編集
                      </button>
                      <button
                        className="race-action-btn race-action-btn--delete"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!window.confirm('このレース結果を削除しますか？')) return;
                          setDeleteError(null);
                          try {
                            await onDeleteResult(result.id);
                          } catch (err: any) {
                            setDeleteError(err.message || 'レース結果の削除に失敗しました');
                          }
                        }}
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
