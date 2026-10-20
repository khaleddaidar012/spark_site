INSERT INTO page_visits (visit_day, visitor_id, visited_at)
SELECT visit_day, visitor_id, CAST(strftime('%s', visit_day) AS INTEGER)
FROM daily_visitors;
