import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';
import { ToastProvider } from './design-system/components/Toast';
import { useCommandPalette, Command } from './design-system/components/CommandPalette';
import './App.css';

const Showcase = lazy(() => import('./pages/Showcase').then(m => ({ default: m.Showcase })));
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const SeniorInterface = lazy(() => import('./pages/SeniorInterface')
  .then(m => ({ default: m.SeniorInterface })));
const CaregiverDashboard = lazy(() => import('./pages/CaregiverDashboard')
  .then(m => ({ default: m.CaregiverDashboard })));
const ScamDetection = lazy(() => import('./pages/ScamDetection')
  .then(m => ({ default: m.ScamDetection })));

export function App(): JSX.Element {
  const commands: Command[] = [
    {
      id: 'home',
      label: 'Go to Home',
      icon: '🏠',
      shortcut: 'G → H',
      action: () => window.location.href = '/',
      category: 'Navigation',
    },
    {
      id: 'senior',
      label: 'Open Senior Interface',
      icon: '👵',
      shortcut: 'G → S',
      action: () => window.location.href = '/senior',
      category: 'Navigation',
    },
    {
      id: 'dashboard',
      label: 'Open Caregiver Dashboard',
      icon: '📊',
      shortcut: 'G → D',
      action: () => window.location.href = '/dashboard',
      category: 'Navigation',
    },
    {
      id: 'scam',
      label: 'View Scam Detection',
      icon: '🛡️',
      shortcut: 'G → C',
      action: () => window.location.href = '/scam-detection',
      category: 'Navigation',
    },
  ];

  const { CommandPaletteComponent } = useCommandPalette(commands);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <CommandPaletteComponent />
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Showcase />} />
              <Route path="/home" element={<Home />} />
              <Route path="/senior" element={<SeniorInterface />} />
              <Route path="/dashboard" element={<CaregiverDashboard />} />
              <Route path="/scam-detection" element={<ScamDetection />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}
