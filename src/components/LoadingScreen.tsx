import './LoadingScreen.css';

export function LoadingScreen(): JSX.Element {
  return (
    <div className="loading-screen">
      <div className="loading-orb">
        <div className="orb-ring"></div>
        <div className="orb-ring"></div>
        <div className="orb-ring"></div>
        <div className="orb-core"></div>
      </div>
      <h2 className="loading-title">Dorothy</h2>
      <p className="loading-text">Initializing...</p>
      <div className="loading-progress">
        <div className="progress-bar"></div>
      </div>
    </div>
  );
}
