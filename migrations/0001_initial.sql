CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS daily_visitors (
  visit_day TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  PRIMARY KEY (visit_day, visitor_id)
);

CREATE INDEX IF NOT EXISTS idx_daily_visitors_day ON daily_visitors(visit_day);

INSERT OR IGNORE INTO projects (id, title, description, image) VALUES
('proj-damietta-foundation', 'مشروع تجهيز الموقع وتأسيس وعزل الأساسات الإنشائية', 'تنفيذ متكامل ومتتابع لمراحل تأسيس الموقع بدمياط الجديدة، من أعمال المساحة والحفر حتى العزل المائي وصب خرسانة الحماية.', '/assets/projects/p_1.jpg'),
('proj-obour-finishing', 'أعمال التشطيبات الداخلية المتكاملة لشقة سكنية', 'تنفيذ متكامل للتشطيبات الداخلية بمدينة العبور مع تنسيق الخامات والإضاءة والأرضيات والأطقم الصحية.', '/assets/projects/p_6.jpg'),
('proj-living-transformation', 'تشطيب وتأثيث صالة معيشة سكنية من التأسيس إلى الفرش', 'تحويل مساحة سكنية من مرحلة العظم إلى التسليم النهائي مع الأرضيات والتجاليد والإضاءة والفرش.', '/assets/projects/p_7.jpg');
