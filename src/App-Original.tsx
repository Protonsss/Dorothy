import { useState } from 'react';
import { VoiceOrb } from './components/VoiceOrb';
import { useOrbStore, OrbVisualState } from './core/OrbState';
import './App.css';

export function App(): JSX.Element {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setState, currentState } = useOrbStore();

  const handleStateChange = (state: OrbVisualState): void => {
    setState(state);
  };

  return (
    <div className="app">
      <div className="orb-container">
        <VoiceOrb
          className="voice-orb"
          onInitialized={(): void => setIsInitialized(true)}
          onError={(err): void => setError(err.message)}
        />
      </div>

      {!isInitialized && !error && (
        <div className="loading">
          <p>Initializing Dorothy...</p>
          <p className="permission-note">
            Please allow microphone access for audio reactivity
          </p>
        </div>
      )}

      {error && (
        <div className="error">
          <h2>Initialization Error</h2>
          <p>{error}</p>
          <button onClick={(): void => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {isInitialized && (
        <div className="controls">
          <h1>Dorothy Voice Orb</h1>
          <p className="subtitle">
            Production-grade voice assistant interface
          </p>

          <div className="state-controls">
            <button
              onClick={(): void => handleStateChange(OrbVisualState.AMBIENT)}
              className={currentState === OrbVisualState.AMBIENT ? 'active' : ''}
            >
              Ambient
            </button>
            <button
              onClick={(): void => handleStateChange(OrbVisualState.LISTENING)}
              className={currentState === OrbVisualState.LISTENING ?
                'active' : ''}
            >
              Listening
            </button>
            <button
              onClick={(): void => handleStateChange(OrbVisualState.THINKING)}
              className={currentState === OrbVisualState.THINKING ? 'active' : ''}
            >
              Thinking
            </button>
            <button
              onClick={(): void => handleStateChange(OrbVisualState.SPEAKING)}
              className={currentState === OrbVisualState.SPEAKING ? 'active' : ''}
            >
              Speaking
            </button>
            <button
              onClick={(): void => handleStateChange(OrbVisualState.ALERT)}
              className={currentState === OrbVisualState.ALERT ? 'active' : ''}
            >
              Alert
            </button>
          </div>

          <div className="metrics">
            <p>Current State: <strong>{currentState}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
}
