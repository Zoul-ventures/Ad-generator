import React from 'react';

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatLabel = (value) =>
  value
    ? value
        .split(' ')
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ')
    : value;

const HistoryPanel = ({ history, onSelect, activeId }) => (
  <aside className="panel history-panel">
    <header className="panel-header">
      <div>
        <h2>Recent generations</h2>
        <p>Switch between previous ads to compare wording.</p>
      </div>
    </header>
    <div className="panel-body panel-body-scroll">
      {history.length === 0 ? (
        <div className="empty-state compact">
          <h3>No history yet</h3>
          <p>We store your 10 most recent variations once you generate them.</p>
        </div>
      ) : (
        <ul className="history-list">
          {history.map((entry) => (
            <li key={entry.id}>
              <button
                type="button"
                className={entry.id === activeId ? 'history-card active' : 'history-card'}
                onClick={() => onSelect(entry.id)}
              >
                <span className="history-time">{formatTimestamp(entry.createdAt)}</span>
                <span className="history-platform">
                  {entry.platformLabel || formatLabel(entry.platform)}
                </span>
                <p className="history-headline">{entry.headline}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  </aside>
);

export default HistoryPanel;
