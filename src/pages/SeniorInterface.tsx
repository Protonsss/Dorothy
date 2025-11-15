import { useState } from 'react';
import { VoiceOrb } from '../components/VoiceOrb';
import { useOrbStore, OrbVisualState } from '../core/OrbState';
import { Button } from '../design-system/components/Button';
import './SeniorInterface.css';

interface ConversationMessage {
  id: string;
  role: 'dorothy' | 'senior';
  content: string;
  timestamp: Date;
}

export function SeniorInterface(): JSX.Element {
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const { setState } = useOrbStore();

  const handleStartListening = (): void => {
    setIsListening(true);
    setState(OrbVisualState.LISTENING);
  };

  const handleStopListening = (): void => {
    setIsListening(false);
    setState(OrbVisualState.AMBIENT);
  };

  const handleEmergency = (): void => {
    setState(OrbVisualState.ALERT);
    setConversation(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'dorothy',
        content: 'Emergency services have been notified. Help is on the way.',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="senior-interface">
      {/* Emergency Button - Always Visible */}
      <button className="emergency-button" onClick={handleEmergency}>
        <span className="emergency-icon">🚨</span>
        <span className="emergency-text">Emergency</span>
      </button>

      {/* Main Voice Orb */}
      <div className="senior-orb-container">
        <VoiceOrb
          className="senior-voice-orb"
          onInitialized={(): void => {
            console.log('Dorothy initialized');
          }}
          onError={(err): void => {
            console.error('Dorothy error:', err);
          }}
        />

        {/* Dorothy Status */}
        <div className="dorothy-status">
          <div className="status-indicator">
            {isListening ? (
              <span className="status-dot listening"></span>
            ) : (
              <span className="status-dot ready"></span>
            )}
            <span className="status-text">
              {isListening ? 'Listening...' : 'Ready to help'}
            </span>
          </div>
        </div>
      </div>

      {/* Conversation History */}
      {conversation.length > 0 && (
        <div className="conversation-history">
          {conversation.map(msg => (
            <div key={msg.id} className={`message message-${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'dorothy' ? '🎙️' : '👤'}
              </div>
              <div className="message-content">
                <p className="message-text">{msg.content}</p>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Controls */}
      <div className="senior-controls">
        {!isListening ? (
          <Button
            size="xl"
            variant="primary"
            fullWidth
            onClick={handleStartListening}
            leftIcon="🎤"
          >
            Talk to Dorothy
          </Button>
        ) : (
          <Button
            size="xl"
            variant="danger"
            fullWidth
            onClick={handleStopListening}
            leftIcon="⏹"
          >
            Stop
          </Button>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-button">
            <span className="quick-action-icon">📞</span>
            <span className="quick-action-label">Call Family</span>
          </button>
          <button className="quick-action-button">
            <span className="quick-action-icon">💊</span>
            <span className="quick-action-label">Medications</span>
          </button>
          <button className="quick-action-button">
            <span className="quick-action-icon">📅</span>
            <span className="quick-action-label">Appointments</span>
          </button>
          <button className="quick-action-button">
            <span className="quick-action-icon">⚙️</span>
            <span className="quick-action-label">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
