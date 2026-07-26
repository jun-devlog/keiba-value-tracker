import { useState } from 'react';
import type { Bet, BetUpdate } from '../types';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { BetUpdateForm } from './BetUpdateForm';

interface BetsSectionProps {
  bets: Bet[];
  isLoading: boolean;
  error: string | null;
  onUpdateBet: (betId: number, data: BetUpdate) => Promise<void>;
  onDeleteBet: (betId: number) => Promise<void>;
}

export function BetsSection({ bets, isLoading, error, onUpdateBet, onDeleteBet }: BetsSectionProps) {
  const [editingBetId, setEditingBetId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  return (
    <section className="horses-section">
      <h2 className="section-title">Bets</h2>

      {isLoading && (
        <div className="state-container">
          <div className="spinner"></div>
          <p>馬券購入情報を読み込み中...</p>
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

      {!isLoading && !error && bets.length === 0 && (
        <div className="state-container">
          <p>馬券購入履歴が登録されていません</p>
        </div>
      )}

      {!isLoading && !error && bets.length > 0 && (
        <div className="data-section">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
              <tr>
                <th>券種ID</th>
                <th>金額</th>
                <th>買い目</th>
                <th>購入日時</th>
                <th>アクション</th>
              </tr>
            </thead>
            <tbody>
              {bets.map((bet) => {
                if (editingBetId === bet.id) {
                  return (
                    <tr key={bet.id} className="inline-edit-row">
                      <td colSpan={5}>
                        <BetUpdateForm
                          bet={bet}
                          onSave={async (data) => {
                            await onUpdateBet(bet.id, data);
                            setEditingBetId(null);
                          }}
                          onCancel={() => setEditingBetId(null)}
                        />
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={bet.id}>
                    <td>{bet.bet_type_id}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(bet.amount)}</td>
                    <td>{bet.combination || '-'}</td>
                    <td>{formatDateTime(bet.created_at)}</td>
                    <td>
                      <button
                        className="race-action-btn race-action-btn--edit"
                        onClick={(e) => { e.stopPropagation(); setDeleteError(null); setEditingBetId(bet.id); }}
                      >
                        編集
                      </button>
                      <button
                        className="race-action-btn race-action-btn--delete"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!window.confirm('この馬券を削除しますか？')) return;
                          setDeleteError(null);
                          try {
                            await onDeleteBet(bet.id);
                          } catch (err: any) {
                            setDeleteError(err.message || '馬券の削除に失敗しました');
                          }
                        }}
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
