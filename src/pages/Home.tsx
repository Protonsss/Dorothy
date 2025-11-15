import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoiceOrb } from '../components/VoiceOrb';
import { Button } from '../design-system/components/Button';
import './Home.css';

export function Home(): JSX.Element {
  const navigate = useNavigate();
  const [isOrbReady, setIsOrbReady] = useState(false);

  return (
    <div className="home">
      {/* Hero Section with Orb */}
      <section className="hero">
        <div className="hero-orb-container">
          <VoiceOrb
            onInitialized={(): void => setIsOrbReady(true)}
            onError={(err): void => console.error(err)}
          />
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            Meet <span className="hero-highlight">Dorothy</span>
          </h1>
          <p className="hero-subtitle">
            The global standard for senior tech assistance
          </p>
          <p className="hero-description">
            AI-powered voice assistant with real-time scam detection,
            <br />
            emergency support, and family connectivity
          </p>

          <div className="hero-actions">
            <Button
              size="xl"
              variant="primary"
              onClick={(): void => navigate('/senior')}
              disabled={!isOrbReady}
            >
              Launch Senior Interface
            </Button>
            <Button
              size="xl"
              variant="secondary"
              onClick={(): void => navigate('/dashboard')}
            >
              Caregiver Dashboard
            </Button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">1M+</div>
              <div className="stat-label">Seniors Protected</div>
            </div>
            <div className="stat">
              <div className="stat-value">99.7%</div>
              <div className="stat-label">Scam Detection Rate</div>
            </div>
            <div className="stat">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Always Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <h2 className="features-title">Why Dorothy?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3 className="feature-title">Scam Protection</h3>
            <p className="feature-description">
              Real-time detection and blocking of phone scams, with voice
              stress analysis and pattern recognition
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎙️</div>
            <h3 className="feature-title">Voice Interface</h3>
            <p className="feature-description">
              Natural conversation with Dorothy's AI, optimized for seniors
              with clear speech and patient responses
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚨</div>
            <h3 className="feature-title">Emergency Support</h3>
            <p className="feature-description">
              One-touch emergency alerts to family and services, with
              automatic location sharing
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3 className="feature-title">Family Connection</h3>
            <p className="feature-description">
              Keep families connected with activity monitoring, health
              tracking, and conversation history
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Analytics Dashboard</h3>
            <p className="feature-description">
              Comprehensive insights for caregivers with real-time monitoring
              and detailed reports
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Privacy First</h3>
            <p className="feature-description">
              End-to-end encryption, HIPAA compliant, with granular privacy
              controls for all data
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2 className="cta-title">Ready to get started?</h2>
        <p className="cta-subtitle">
          Join 1 million+ families already using Dorothy
        </p>
        <div className="cta-actions">
          <Button
            size="xl"
            variant="primary"
            onClick={(): void => navigate('/senior')}
          >
            Try Dorothy Now
          </Button>
          <Button
            size="xl"
            variant="ghost"
            onClick={(): void => navigate('/scam-detection')}
          >
            View Scam Protection
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4 className="footer-title">Dorothy</h4>
            <p className="footer-text">
              The global standard for senior tech assistance
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Product</h4>
            <a href="#" className="footer-link">Features</a>
            <a href="#" className="footer-link">Pricing</a>
            <a href="#" className="footer-link">Security</a>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Company</h4>
            <a href="#" className="footer-link">About</a>
            <a href="#" className="footer-link">Careers</a>
            <a href="#" className="footer-link">Contact</a>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Legal</h4>
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Terms</a>
            <a href="#" className="footer-link">HIPAA</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 Dorothy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
