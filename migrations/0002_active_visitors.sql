CREATE TABLE IF NOT EXISTS active_visitors (
  visitor_id TEXT PRIMARY KEY,
  last_seen INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_active_visitors_last_seen ON active_visitors(last_seen);
