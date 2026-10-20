CREATE TABLE IF NOT EXISTS page_visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visit_day TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  visited_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_page_visits_day ON page_visits(visit_day);
CREATE INDEX IF NOT EXISTS idx_page_visits_visited_at ON page_visits(visited_at);
