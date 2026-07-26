interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="lp-shell">
      {/* プレミアムな質感の背景要素 */}
      <div className="lp-bg-image"></div>
      <div className="lp-bg-glow"></div>
      <div className="lp-bg-grid"></div>

      {/* LP専用ヘッダー */}
      <header className="lp-header">
        <div className="lp-brand">
          <span className="lp-brand-name">Keiba Value Tracker</span>
          <span className="lp-brand-badge">Beta</span>
        </div>
        <nav className="lp-nav">
          <button className="lp-nav-btn" onClick={onEnter}>デモを見る</button>
          <a href="https://x.com/jun_devlog" target="_blank" rel="noreferrer" className="lp-nav-link">Xでフィードバック</a>
        </nav>
      </header>

      <main className="lp-main">
        {/* Hero Section */}
        <section className="lp-hero">
          <div className="lp-hero-copy">
            <h1 className="lp-hero-title">競馬の記録を、<br />資産に変える。</h1>
            <p className="lp-hero-subtitle">
              予想・馬券購入・レース結果をひとつにまとめ、Profit / ROI / 買い方の傾向を可視化する競馬ダッシュボード。
            </p>
            <p className="lp-hero-description">
              Excelやメモ帳では続きにくい収支管理を、もっと振り返りやすく。
            </p>
            <div className="lp-hero-actions">
              <button className="lp-button-primary" onClick={onEnter}>
                デモ画面を試す
              </button>
              <a href="https://x.com/jun_devlog" target="_blank" rel="noreferrer" className="lp-button-secondary">
                Xでフィードバックする
              </a>
            </div>
          </div>

          <div className="lp-hero-visual">
            <div className="lp-kpi-preview">
              <div className="lp-preview-card">
                <span className="lp-preview-label">Total Bet</span>
                <span className="lp-preview-value">¥1,500</span>
              </div>
              <div className="lp-preview-card">
                <span className="lp-preview-label">Total Return</span>
                <span className="lp-preview-value color-highlight">¥2,800</span>
              </div>
              <div className="lp-preview-card">
                <span className="lp-preview-label">Profit</span>
                <span className="lp-preview-value color-positive">+¥1,300</span>
              </div>
              <div className="lp-preview-card">
                <span className="lp-preview-label">ROI</span>
                <span className="lp-preview-value color-positive">186.7%</span>
              </div>
            </div>
            
            <div className="lp-preview-race">
              <div className="lp-preview-race-header">
                <span className="lp-preview-race-title">日本ダービー</span>
                <span className="lp-preview-race-grade">G1</span>
              </div>
              <div className="lp-preview-race-result">
                <span>Result:</span>
                <span className="lp-preview-race-order">1-2-3</span>
              </div>
            </div>
          </div>
        </section>

        {/* Target Audience Section */}
        <section className="lp-section">
          <h2 className="lp-section-title">こんな方におすすめ</h2>
          <div className="lp-card-grid">
            <div className="lp-card">
              <div className="lp-card-icon">📊</div>
              <h3 className="lp-card-title">収支を把握したい</h3>
              <p className="lp-card-text">
                なんとなく勝っている/負けている状態から、数字で振り返れるようにする
              </p>
            </div>
            <div className="lp-card">
              <div className="lp-card-icon">🎯</div>
              <h3 className="lp-card-title">買い方を振り返りたい</h3>
              <p className="lp-card-text">
                券種やレースごとの記録から、自分の判断を見直しやすくする
              </p>
            </div>
            <div className="lp-card">
              <div className="lp-card-icon">📓</div>
              <h3 className="lp-card-title">管理を続けたい</h3>
              <p className="lp-card-text">
                Excelやメモ帳よりも、競馬専用のUIで記録を続けやすくする
              </p>
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="lp-section">
          <h2 className="lp-section-title">主な価値</h2>
          <div className="lp-card-grid">
            <div className="lp-card lp-card-highlight">
              <h3 className="lp-card-title">一元管理</h3>
              <p className="lp-card-text">レースごとに予想・購入・結果をまとめて記録</p>
            </div>
            <div className="lp-card lp-card-highlight">
              <h3 className="lp-card-title">自動集計</h3>
              <p className="lp-card-text">登録するだけで Profit / ROI を自動で見える化</p>
            </div>
            <div className="lp-card lp-card-highlight">
              <h3 className="lp-card-title">振り返り</h3>
              <p className="lp-card-text">後から自分の判断を振り返りやすい専用UI</p>
            </div>
          </div>
        </section>

        {/* Pricing & CTA Section */}
        <section className="lp-section lp-cta-section">
          <div className="lp-cta-content">
            <h2 className="lp-section-title">料金・今後の予定</h2>
            <p className="lp-cta-text">
              現在はβ版として無料公開を検討中です。<br />
              将来的には、買い切り980円、または月額300円程度での提供を検証しています。<br />
              競馬の収支管理で困っていることがあれば、ぜひXで教えてください。
            </p>
            <div className="lp-cta-actions">
              <button className="lp-button-primary" onClick={onEnter}>
                デモ画面を試す
              </button>
              <a href="https://x.com/jun_devlog" target="_blank" rel="noreferrer" className="lp-button-secondary">
                Xでフィードバックする
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <p>&copy; {new Date().getFullYear()} Keiba Value Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}
