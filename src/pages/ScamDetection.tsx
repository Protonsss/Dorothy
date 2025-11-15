import { useState } from 'react';
import { Button } from '../design-system/components/Button';
import './ScamDetection.css';

interface ScamEvent {
  id: string;
  timestamp: Date;
  phoneNumber: string;
  duration: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  scamType: string;
  keywords: string[];
  audioWaveform: number[];
  blocked: boolean;
}

export function ScamDetection(): JSX.Element {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const scamEvents: ScamEvent[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 10 * 60000),
      phoneNumber: '+1 (555) 123-4567',
      duration: 45,
      threatLevel: 'critical',
      scamType: 'IRS Impersonation',
      keywords: ['arrest', 'warrant', 'immediate payment', 'social security'],
      audioWaveform: Array.from({ length: 100 }, () => Math.random() * 100),
      blocked: true,
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 2 * 3600000),
      phoneNumber: '+1 (555) 987-6543',
      duration: 120,
      threatLevel: 'high',
      scamType: 'Tech Support Scam',
      keywords: ['computer virus', 'refund', 'remote access'],
      audioWaveform: Array.from({ length: 100 }, () => Math.random() * 80),
      blocked: false,
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 24 * 3600000),
      phoneNumber: '+1 (555) 456-7890',
      duration: 30,
      threatLevel: 'medium',
      scamType: 'Robocall',
      keywords: ['extended warranty', 'final notice'],
      audioWaveform: Array.from({ length: 100 }, () => Math.random() * 60),
      blocked: true,
    },
  ];

  const getThreatColor = (level: ScamEvent['threatLevel']): string => {
    switch (level) {
      case 'low':
        return 'threat-low';
      case 'medium':
        return 'threat-medium';
      case 'high':
        return 'threat-high';
      case 'critical':
        return 'threat-critical';
    }
  };

  const selected = scamEvents.find(e => e.id === selectedEvent);

  return (
    <div className="scam-detection">
      {/* Header */}
      <header className="scam-header">
        <div>
          <h1 className="scam-title">Scam Detection</h1>
          <p className="scam-subtitle">Real-time threat monitoring & analysis</p>
        </div>
        <div className="scam-stats">
          <div className="scam-stat">
            <span className="scam-stat-value">12</span>
            <span className="scam-stat-label">Blocked Today</span>
          </div>
          <div className="scam-stat">
            <span className="scam-stat-value">98.7%</span>
            <span className="scam-stat-label">Detection Rate</span>
          </div>
        </div>
      </header>

      <div className="scam-content">
        {/* Events List */}
        <div className="scam-list">
          <div className="scam-list-header">
            <h3>Recent Threats</h3>
            <select className="scam-filter">
              <option>All Threats</option>
              <option>Critical Only</option>
              <option>Blocked</option>
              <option>Not Blocked</option>
            </select>
          </div>

          <div className="scam-events">
            {scamEvents.map(event => (
              <button
                key={event.id}
                className={`scam-event ${
                  selectedEvent === event.id ? 'selected' : ''
                }`}
                onClick={(): void => setSelectedEvent(event.id)}
              >
                <div className="event-header">
                  <div className={`event-threat ${getThreatColor(event.threatLevel)}`}>
                    <span className="threat-dot"></span>
                    <span className="threat-label">{event.threatLevel}</span>
                  </div>
                  {event.blocked && <span className="event-blocked">Blocked</span>}
                </div>

                <div className="event-type">{event.scamType}</div>
                <div className="event-phone">{event.phoneNumber}</div>
                <div className="event-time">
                  {event.timestamp.toLocaleTimeString()} • {event.duration}s
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Details Panel */}
        {selected ? (
          <div className="scam-details">
            <div className="details-header">
              <div>
                <h2 className="details-title">{selected.scamType}</h2>
                <p className="details-subtitle">{selected.phoneNumber}</p>
              </div>
              <div className={`details-threat ${getThreatColor(selected.threatLevel)}`}>
                {selected.threatLevel} threat
              </div>
            </div>

            {/* Audio Waveform */}
            <div className="waveform-section">
              <h3 className="section-title">Audio Analysis</h3>
              <div className="waveform">
                {selected.audioWaveform.map((height, i) => (
                  <div
                    key={i}
                    className="waveform-bar"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="waveform-controls">
                <Button size="sm" variant="ghost">
                  ▶ Play Recording
                </Button>
                <span className="waveform-duration">
                  0:{selected.duration < 10 ? '0' : ''}
                  {selected.duration}
                </span>
              </div>
            </div>

            {/* Keywords */}
            <div className="keywords-section">
              <h3 className="section-title">Detected Keywords</h3>
              <div className="keywords">
                {selected.keywords.map((keyword, i) => (
                  <span key={i} className="keyword-tag">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Analysis */}
            <div className="analysis-section">
              <h3 className="section-title">Threat Analysis</h3>
              <div className="analysis-grid">
                <div className="analysis-item">
                  <div className="analysis-label">Voice Stress</div>
                  <div className="analysis-bar">
                    <div className="analysis-fill" style={{ width: '85%' }}></div>
                  </div>
                  <div className="analysis-value">85%</div>
                </div>

                <div className="analysis-item">
                  <div className="analysis-label">Urgency Indicators</div>
                  <div className="analysis-bar">
                    <div className="analysis-fill" style={{ width: '92%' }}></div>
                  </div>
                  <div className="analysis-value">92%</div>
                </div>

                <div className="analysis-item">
                  <div className="analysis-label">Pattern Match</div>
                  <div className="analysis-bar">
                    <div className="analysis-fill" style={{ width: '78%' }}></div>
                  </div>
                  <div className="analysis-value">78%</div>
                </div>

                <div className="analysis-item">
                  <div className="analysis-label">Number Spoofing</div>
                  <div className="analysis-bar">
                    <div className="analysis-fill" style={{ width: '95%' }}></div>
                  </div>
                  <div className="analysis-value">95%</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="details-actions">
              <Button variant="danger">Block Number Permanently</Button>
              <Button variant="secondary">Add to Whitelist</Button>
              <Button variant="ghost">Report to Authorities</Button>
            </div>
          </div>
        ) : (
          <div className="scam-empty">
            <span className="empty-icon">🛡️</span>
            <h3>Select a threat event</h3>
            <p>Choose an event from the list to view detailed analysis</p>
          </div>
        )}
      </div>
    </div>
  );
}
