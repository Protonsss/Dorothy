import { useNavigate } from 'react-router-dom';
import './Showcase.css';

interface ShowcaseCard {
  title: string;
  description: string;
  route: string;
  icon: string;
  gradient: string;
  features: string[];
}

const interfaces: ShowcaseCard[] = [
  {
    title: 'Home Landing',
    description: 'Marketing homepage with voice orb, features, and enterprise polish',
    route: '/home',
    icon: '🏠',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    features: ['Animated Voice Orb', 'Hero Section', 'Feature Cards', 'Stats & CTA'],
  },
  {
    title: 'Senior Interface',
    description: 'WCAG AAA accessible interface with large touch targets and high contrast',
    route: '/senior',
    icon: '👵',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    features: ['Voice Control', 'Emergency Button', 'Large Text (18px)', '44px Touch Targets'],
  },
  {
    title: 'Caregiver Dashboard',
    description: 'Linear-inspired analytics dashboard with real-time monitoring',
    route: '/dashboard',
    icon: '📊',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    features: ['D3 Charts', 'Activity Timeline', 'Health Metrics', 'Alert System'],
  },
  {
    title: 'Scam Detection',
    description: 'Real-time scam analysis with glassmorphism UI and audio visualization',
    route: '/scam-detection',
    icon: '🛡️',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    features: ['Audio Waveform', 'Threat Analysis', 'Pattern Detection', 'Scam History'],
  },
];

export function Showcase(): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="showcase">
      <div className="showcase-header">
        <h1 className="showcase-title">
          Dorothy Platform
          <span className="showcase-subtitle">Choose an interface to explore</span>
        </h1>
        <p className="showcase-description">
          8,500+ lines of production-grade React, TypeScript, and GLSL shaders
          <br />
          Built with THREE.js, D3.js, and enterprise-level design systems
        </p>
      </div>

      <div className="showcase-grid">
        {interfaces.map((item) => (
          <div
            key={item.route}
            className="showcase-card"
            onClick={(): void => navigate(item.route)}
            style={{ '--card-gradient': item.gradient } as React.CSSProperties}
          >
            <div className="showcase-card-gradient" />
            <div className="showcase-card-content">
              <div className="showcase-card-icon">{item.icon}</div>
              <h2 className="showcase-card-title">{item.title}</h2>
              <p className="showcase-card-description">{item.description}</p>

              <ul className="showcase-card-features">
                {item.features.map((feature) => (
                  <li key={feature}>
                    <span className="feature-dot">•</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="showcase-card-button">
                View Interface
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="showcase-footer">
        <div className="tech-stack">
          <span className="tech-badge">React 18</span>
          <span className="tech-badge">TypeScript</span>
          <span className="tech-badge">THREE.js</span>
          <span className="tech-badge">GLSL Shaders</span>
          <span className="tech-badge">D3.js</span>
          <span className="tech-badge">Zustand</span>
          <span className="tech-badge">Vite</span>
        </div>
      </div>
    </div>
  );
}
