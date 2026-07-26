
interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="lp-container">
      {/* Hero Section */}
      <header className="lp-hero">
        <h1 className="lp-title">Keiba Value Tracker</h1>
        <p className="lp-catchphrase">
          競馬の予想・馬券購入・レース結果をまとめて記録し、収支と回収率を見える化するダッシュボード。
        </p>
        <p className="lp-subcopy">
          Excelやメモ帳では続きにくい収支管理を、もっと振り返りやすく。
        </p>
        <button className="lp-cta-primary" onClick={onEnter}>
          デモ画面を試す
        </button>
      </header>

      {/* Target Audience Section */}
      <section className="lp-section">
        <h2 className="lp-section-title">こんな方におすすめ</h2>
        <ul className="lp-target-list">
          <li>競馬の収支をなんとなくしか把握できていない人</li>
          <li>券種ごとの勝ち負けや、自分の買い方のクセを振り返りたい人</li>
          <li>Excelやメモ帳で管理しようとしたが続かなかった人</li>
        </ul>
      </section>

      {/* Value Proposition Section */}
      <section className="lp-section">
        <h2 className="lp-section-title">主な価値</h2>
        <div className="lp-features-grid">
          <div className="lp-feature-card">
            <h3>一元管理</h3>
            <p>レースごとに予想・購入・結果をまとめて記録</p>
          </div>
          <div className="lp-feature-card">
            <h3>自動集計</h3>
            <p>登録するだけで Profit / ROI を自動で見える化</p>
          </div>
          <div className="lp-feature-card">
            <h3>振り返り</h3>
            <p>後から自分の判断を振り返りやすい専用UI</p>
          </div>
        </div>
      </section>

      {/* Pricing Hypothesis & CTA Section */}
      <section className="lp-section lp-cta-section">
        <h2 className="lp-section-title">料金・今後の予定</h2>
        <div className="lp-pricing-card">
          <p className="lp-pricing-beta">β版は無料</p>
          <p className="lp-pricing-future">将来的には買い切り980円、または月額300円程度での提供を検討しています。</p>
        </div>
        
        <div className="lp-contact-box">
          <p>競馬の収支管理で困っていることを教えてください。</p>
          <p>本格的に使ってみたい方は、XでDMください。</p>
          <a href="https://x.com/jun_devlog" className="lp-cta-secondary" target="_blank" rel="noreferrer">
            XでDMを送る
          </a>
        </div>
      </section>

      <footer className="lp-footer">
        <p>&copy; {new Date().getFullYear()} Keiba Value Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}
