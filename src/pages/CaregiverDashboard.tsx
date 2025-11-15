import { useState } from 'react';
import { Button } from '../design-system/components/Button';
import { Input } from '../design-system/components/Input';
import './CaregiverDashboard.css';

interface Senior {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'alert';
  lastActivity: Date;
  avatar: string;
}

interface Activity {
  id: string;
  seniorId: string;
  seniorName: string;
  type: 'call' | 'scam_detected' | 'emergency' | 'medication' | 'routine';
  description: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

interface Alert {
  id: string;
  seniorId: string;
  seniorName: string;
  type: 'scam' | 'health' | 'emergency' | 'technical';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export function CaregiverDashboard(): JSX.Element {
  const [selectedSenior, setSelectedSenior] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const seniors: Senior[] = [
    {
      id: '1',
      name: 'Margaret Smith',
      status: 'active',
      lastActivity: new Date(Date.now() - 5 * 60000),
      avatar: '👵',
    },
    {
      id: '2',
      name: 'Robert Johnson',
      status: 'idle',
      lastActivity: new Date(Date.now() - 2 * 3600000),
      avatar: '👴',
    },
    {
      id: '3',
      name: 'Dorothy Williams',
      status: 'alert',
      lastActivity: new Date(Date.now() - 10 * 60000),
      avatar: '👵',
    },
  ];

  const activities: Activity[] = [
    {
      id: '1',
      seniorId: '3',
      seniorName: 'Dorothy Williams',
      type: 'scam_detected',
      description: 'Potential IRS scam call blocked',
      timestamp: new Date(Date.now() - 10 * 60000),
      severity: 'high',
    },
    {
      id: '2',
      seniorId: '1',
      seniorName: 'Margaret Smith',
      type: 'call',
      description: 'Completed call with family member',
      timestamp: new Date(Date.now() - 30 * 60000),
      severity: 'low',
    },
    {
      id: '3',
      seniorId: '2',
      seniorName: 'Robert Johnson',
      type: 'medication',
      description: 'Medication reminder acknowledged',
      timestamp: new Date(Date.now() - 2 * 3600000),
      severity: 'medium',
    },
  ];

  const alerts: Alert[] = [
    {
      id: '1',
      seniorId: '3',
      seniorName: 'Dorothy Williams',
      type: 'scam',
      message: 'Multiple scam attempts detected in past hour',
      timestamp: new Date(Date.now() - 10 * 60000),
      resolved: false,
    },
  ];

  const getStatusColor = (status: Senior['status']): string => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'idle':
        return 'status-idle';
      case 'alert':
        return 'status-alert';
    }
  };

  const getActivityIcon = (type: Activity['type']): string => {
    switch (type) {
      case 'call':
        return '📞';
      case 'scam_detected':
        return '🚨';
      case 'emergency':
        return '🆘';
      case 'medication':
        return '💊';
      case 'routine':
        return '✓';
    }
  };

  const getRelativeTime = (date: Date): string => {
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="caregiver-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h1 className="logo">Dorothy</h1>
          <p className="logo-subtitle">Caregiver Dashboard</p>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            <span className="nav-icon">📊</span>
            <span className="nav-label">Overview</span>
          </button>
          <button className="nav-item">
            <span className="nav-icon">👥</span>
            <span className="nav-label">Seniors</span>
          </button>
          <button className="nav-item">
            <span className="nav-icon">🚨</span>
            <span className="nav-label">Alerts</span>
            {alerts.filter(a => !a.resolved).length > 0 && (
              <span className="nav-badge">
                {alerts.filter(a => !a.resolved).length}
              </span>
            )}
          </button>
          <button className="nav-item">
            <span className="nav-icon">📊</span>
            <span className="nav-label">Analytics</span>
          </button>
          <button className="nav-item">
            <span className="nav-icon">🎙️</span>
            <span className="nav-label">Recordings</span>
          </button>
          <button className="nav-item">
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="profile-button">
            <div className="profile-avatar">👤</div>
            <div className="profile-info">
              <div className="profile-name">Jane Caregiver</div>
              <div className="profile-role">Administrator</div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h2 className="page-title">Overview</h2>
            <p className="page-subtitle">Monitor all seniors in real-time</p>
          </div>
          <div className="header-right">
            <Input
              placeholder="Search seniors, activities..."
              value={searchQuery}
              onChange={(e): void => setSearchQuery(e.target.value)}
              leftIcon="🔍"
            />
            <Button variant="primary">Add Senior</Button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-primary">👥</div>
            <div className="stat-content">
              <div className="stat-label">Total Seniors</div>
              <div className="stat-value">{seniors.length}</div>
              <div className="stat-change positive">+2 this month</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-success">✓</div>
            <div className="stat-content">
              <div className="stat-label">Active Now</div>
              <div className="stat-value">
                {seniors.filter(s => s.status === 'active').length}
              </div>
              <div className="stat-change neutral">
                {seniors.filter(s => s.status === 'idle').length} idle
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-warning">🚨</div>
            <div className="stat-content">
              <div className="stat-label">Active Alerts</div>
              <div className="stat-value">
                {alerts.filter(a => !a.resolved).length}
              </div>
              <div className="stat-change negative">Needs attention</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-danger">🛡️</div>
            <div className="stat-content">
              <div className="stat-label">Scams Blocked</div>
              <div className="stat-value">12</div>
              <div className="stat-change positive">↓ 40% vs last week</div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Seniors List */}
          <section className="panel seniors-panel">
            <div className="panel-header">
              <h3 className="panel-title">Seniors</h3>
              <button className="panel-action">View All</button>
            </div>
            <div className="seniors-list">
              {seniors.map(senior => (
                <button
                  key={senior.id}
                  className={`senior-card ${
                    selectedSenior === senior.id ? 'selected' : ''
                  }`}
                  onClick={(): void => setSelectedSenior(senior.id)}
                >
                  <div className="senior-avatar">{senior.avatar}</div>
                  <div className="senior-info">
                    <div className="senior-name">{senior.name}</div>
                    <div className="senior-activity">
                      {getRelativeTime(senior.lastActivity)}
                    </div>
                  </div>
                  <div className={`senior-status ${getStatusColor(senior.status)}`}>
                    <span className="status-dot"></span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Activity Feed */}
          <section className="panel activity-panel">
            <div className="panel-header">
              <h3 className="panel-title">Recent Activity</h3>
              <button className="panel-action">Filter</button>
            </div>
            <div className="activity-feed">
              {activities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <span className="activity-senior">
                        {activity.seniorName}
                      </span>
                      <span className="activity-time">
                        {getRelativeTime(activity.timestamp)}
                      </span>
                    </div>
                    <div className="activity-description">
                      {activity.description}
                    </div>
                  </div>
                  <div className={`activity-severity severity-${activity.severity}`}>
                    {activity.severity}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Alerts Panel */}
          <section className="panel alerts-panel">
            <div className="panel-header">
              <h3 className="panel-title">Active Alerts</h3>
              <button className="panel-action">Resolve All</button>
            </div>
            <div className="alerts-list">
              {alerts.filter(a => !a.resolved).length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">✓</span>
                  <p className="empty-text">No active alerts</p>
                </div>
              ) : (
                alerts
                  .filter(a => !a.resolved)
                  .map(alert => (
                    <div key={alert.id} className="alert-item">
                      <div className="alert-content">
                        <div className="alert-header">
                          <span className="alert-senior">{alert.seniorName}</span>
                          <span className="alert-time">
                            {getRelativeTime(alert.timestamp)}
                          </span>
                        </div>
                        <div className="alert-message">{alert.message}</div>
                      </div>
                      <div className="alert-actions">
                        <Button size="sm" variant="primary">
                          Review
                        </Button>
                        <Button size="sm" variant="ghost">
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
