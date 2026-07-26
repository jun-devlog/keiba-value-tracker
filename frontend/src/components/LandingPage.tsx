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
          <svg className="lp-brand-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <span className="lp-brand-name">Keiba Value Tracker</span>
          <span className="lp-brand-badge">BETA</span>
        </div>
        <nav className="lp-nav">
          <button className="lp-nav-link" onClick={onEnter}>Demo</button>
          <a href="https://x.com/jun_devlog" target="_blank" rel="noreferrer" className="lp-nav-btn">Xでフィードバック</a>
        </nav>
      </header>

      <main className="lp-main">
        {/* Hero Section */}
        <section className="lp-hero">
          <div className="lp-hero-copy">
            <div className="lp-version-badge">
              <span className="lp-version-dot"></span>
              v0.4.0 / Beta
            </div>
            <h1 className="lp-hero-title">競馬の記録を、<br/>資産に変える。</h1>
            <p className="lp-hero-accent-text">記録から、次の判断へ。</p>
            <p className="lp-hero-description">
              予想・馬券購入・レース結果をひとつにまとめ、Profit / ROI / 買い方の傾向を可視化する競馬ダッシュボード。<br />
              Excelやメモ帳では続きにくい収支管理を、もっと振り返りやすく。
            </p>
            <div className="lp-hero-actions">
              <button className="lp-button-primary" onClick={onEnter}>
                デモ画面を試す <span className="arrow">→</span>
              </button>
              <a href="https://x.com/jun_devlog" target="_blank" rel="noreferrer" className="lp-button-secondary">
                Xでフィードバックする
              </a>
            </div>
            
            <div className="lp-hero-summary">
              <div className="lp-summary-item">
                <span className="lp-summary-label">記録項目</span>
                <span className="lp-summary-value">予想 / 購入 / 結果</span>
              </div>
              <div className="lp-summary-item">
                <span className="lp-summary-label">自動集計</span>
                <span className="lp-summary-value">Profit / ROI</span>
              </div>
              <div className="lp-summary-item">
                <span className="lp-summary-label">提供状況</span>
                <span className="lp-summary-value">β版 検証中</span>
              </div>
            </div>
          </div>

          <div className="lp-hero-visual">
            <div className="lp-mock-window">
              <div className="lp-mock-header">
                <div className="lp-mock-header-left">
                  <span className="lp-mock-dot"></span>
                  <span className="lp-mock-title">Race Record</span>
                </div>
                <div className="lp-mock-date">2026.05.31</div>
              </div>
              
              <div className="lp-mock-body">
                <div className="lp-mock-race-info">
                  <div className="lp-mock-race-icon">🏆</div>
                  <div>
                    <div className="lp-mock-race-name">日本ダービー</div>
                    <div className="lp-mock-race-course">東京 芝2400m</div>
                  </div>
                  <div className="lp-mock-race-badges">
                    <span className="lp-badge-grade">G1</span>
                    <span className="lp-badge-result">1-2-3</span>
                  </div>
                </div>

                <div className="lp-mock-kpi-grid">
                  <div className="lp-mock-kpi-card">
                    <span className="lp-kpi-label">TOTAL BET</span>
                    <span className="lp-kpi-value">¥1,500</span>
                  </div>
                  <div className="lp-mock-kpi-card">
                    <span className="lp-kpi-label">TOTAL RETURN</span>
                    <span className="lp-kpi-value">¥2,800</span>
                  </div>
                  <div className="lp-mock-kpi-card">
                    <span className="lp-kpi-label">PROFIT</span>
                    <span className="lp-kpi-value color-positive">+¥1,300</span>
                  </div>
                  <div className="lp-mock-kpi-card">
                    <span className="lp-kpi-label">ROI</span>
                    <span className="lp-kpi-value color-highlight">186.7%</span>
                  </div>
                </div>

                <div className="lp-mock-chart-card">
                  <div className="lp-mock-chart-header">
                    <span className="lp-kpi-label">PROFIT TREND</span>
                    <span className="lp-kpi-value-small color-positive">↗ +86.7%</span>
                  </div>
                  <div className="lp-mock-chart-svg">
                    <svg width="100%" height="60" viewBox="0 0 300 60" preserveAspectRatio="none">
                      <path d="M0,50 L30,45 L60,55 L90,40 L120,42 L150,30 L180,35 L210,20 L240,25 L270,10 L300,5" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="300" cy="5" r="4" fill="#3b82f6" />
                    </svg>
                  </div>
                </div>

                <div className="lp-mock-table-wrapper">
                  <table className="lp-mock-table">
                    <thead>
                      <tr>
                        <th>券種</th>
                        <th>買い目</th>
                        <th className="text-right">金額</th>
                        <th className="text-right">結果</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>単勝</td>
                        <td>7</td>
                        <td className="text-right">¥500</td>
                        <td className="text-right color-positive">的中</td>
                      </tr>
                      <tr>
                        <td>馬連</td>
                        <td>7 - 3</td>
                        <td className="text-right">¥500</td>
                        <td className="text-right color-positive">的中</td>
                      </tr>
                      <tr>
                        <td>三連複</td>
                        <td>7-3-11</td>
                        <td className="text-right">¥500</td>
                        <td className="text-right color-negative">不的中</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <p className="lp-mock-note">※表示はイメージです。実データとは連動していません。</p>
              </div>
            </div>
          </div>
        </section>

        {/* FOR USERS Section */}
        <section className="lp-section">
          <div className="lp-section-header">
            <span className="lp-section-subtitle">FOR USERS</span>
            <h2 className="lp-section-title">こんな人のための、記録ダッシュボード</h2>
          </div>
          <div className="lp-card-grid">
            <div className="lp-v0-card">
              <div className="lp-card-icon-blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                </svg>
              </div>
              <h3 className="lp-card-title">収支を把握したい</h3>
              <p className="lp-card-text">なんとなく勝っている/負けている状態から、数字で振り返れるようにする。</p>
            </div>
            <div className="lp-v0-card">
              <div className="lp-card-icon-blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
              </div>
              <h3 className="lp-card-title">買い方を振り返りたい</h3>
              <p className="lp-card-text">券種やレースごとの記録から、自分の判断を見直しやすくする。</p>
            </div>
            <div className="lp-v0-card">
              <div className="lp-card-icon-blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
              <h3 className="lp-card-title">管理を続けたい</h3>
              <p className="lp-card-text">Excelやメモ帳よりも、競馬専用のUIで記録を続けやすくする。</p>
            </div>
          </div>
        </section>

        {/* FEATURES Section */}
        <section className="lp-section">
          <div className="lp-section-header">
            <span className="lp-section-subtitle">FEATURES</span>
            <h2 className="lp-section-title">記録する・集計する・振り返る。3つだけ。</h2>
          </div>
          <div className="lp-card-grid">
            <div className="lp-v0-card lp-card-feature">
              <div className="lp-card-header">
                <div className="lp-card-icon-gold">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                </div>
                <span className="lp-card-number">01</span>
              </div>
              <h3 className="lp-card-title">一元管理</h3>
              <p className="lp-card-text">レースごとに予想・購入・結果をまとめて記録。</p>
            </div>
            <div className="lp-v0-card lp-card-feature">
              <div className="lp-card-header">
                <div className="lp-card-icon-gold">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <span className="lp-card-number">02</span>
              </div>
              <h3 className="lp-card-title">自動集計</h3>
              <p className="lp-card-text">登録するだけで Profit / ROI を自動で見える化。</p>
            </div>
            <div className="lp-v0-card lp-card-feature">
              <div className="lp-card-header">
                <div className="lp-card-icon-gold">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <span className="lp-card-number">03</span>
              </div>
              <h3 className="lp-card-title">振り返り</h3>
              <p className="lp-card-text">後から自分の判断を振り返りやすい専用UI。</p>
            </div>
          </div>
        </section>

        {/* Pricing / Validation Section */}
        <section className="lp-section lp-pricing-section">
          <div className="lp-pricing-wrapper">
            <div className="lp-pricing-content">
              <span className="lp-section-subtitle">PRICING / VALIDATION</span>
              <h2 className="lp-section-title" style={{textAlign: 'left', marginBottom: '1.5rem'}}>価格はまだ検証中です。</h2>
              <p className="lp-pricing-text">
                現在はβ版として無料公開を検討中です。将来的には、買い切り980円、または月額300円程度での提供を検証しています。競馬の収支管理で困っていることがあれば、ぜひXで教えてください。
              </p>
              
              <div className="lp-pricing-boxes">
                <div className="lp-price-box">
                  <span className="lp-price-label">現在</span>
                  <span className="lp-price-value">β版 / 無料検討中</span>
                </div>
                <div className="lp-price-box">
                  <span className="lp-price-label">買い切り</span>
                  <span className="lp-price-value">¥980</span>
                </div>
                <div className="lp-price-box">
                  <span className="lp-price-label">月額</span>
                  <span className="lp-price-value">¥300</span>
                </div>
              </div>
            </div>
            
            <div className="lp-pricing-actions">
              <form action="https://formspree.io/f/mvzevnvj" method="POST" className="lp-beta-form">
                <div className="lp-form-group">
                  <label htmlFor="email" className="lp-form-label">メールアドレス <span className="lp-form-required">*</span></label>
                  <input type="email" name="email" id="email" required className="lp-form-input" placeholder="you@example.com" />
                </div>
                <div className="lp-form-group">
                  <label htmlFor="interest" className="lp-form-label">使ってみたい度</label>
                  <select name="interest" id="interest" className="lp-form-select">
                    <option value="試してみたい">試してみたい</option>
                    <option value="かなり使いたい">かなり使いたい</option>
                    <option value="まず話を聞きたい">まず話を聞きたい</option>
                  </select>
                </div>
                <div className="lp-form-group">
                  <label htmlFor="message" className="lp-form-label">競馬の収支管理で困っていること（任意）</label>
                  <textarea name="message" id="message" rows={2} className="lp-form-textarea" placeholder="例: メモ帳での記録が続かない..."></textarea>
                </div>
                <button type="submit" className="lp-button-blue-full">
                  β版の案内を受け取る
                </button>
              </form>

              <div className="lp-pricing-alt-actions">
                <a href="https://x.com/jun_devlog" target="_blank" rel="noreferrer" className="lp-button-dark-full">
                  Xでフィードバックする
                </a>
                <button className="lp-button-dark-full" onClick={onEnter}>
                  デモ画面を試す <span className="arrow">→</span>
                </button>
              </div>
              <p className="lp-pricing-note">
                予想の提供・自動投票は行いません。記録と振り返りのためのツールです。
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="lp-footer-v0">
        <div className="lp-footer-content">
          <div className="lp-brand">
            <span className="lp-brand-name">Keiba Value Tracker</span>
            <span className="lp-brand-badge">BETA</span>
          </div>
          <div className="lp-footer-links">
            <button className="lp-nav-link" onClick={onEnter}>Demo</button>
            <a href="https://x.com/jun_devlog" target="_blank" rel="noreferrer" className="lp-nav-link">Feedback on X</a>
          </div>
        </div>
        <div className="lp-footer-disclaimer">
          本サービスは、競馬の予想・馬券購入・結果を自分で記録し、収支を振り返るための管理ツールです。20歳未満の方は馬券を購入できません。
        </div>
      </footer>
    </div>
  );
}
