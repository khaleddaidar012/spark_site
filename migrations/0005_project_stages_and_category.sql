ALTER TABLE projects ADD COLUMN stages TEXT NOT NULL DEFAULT '[]';
ALTER TABLE projects ADD COLUMN category TEXT NOT NULL DEFAULT 'residential';

UPDATE projects SET category = 'structural' WHERE id = 'proj-damietta-foundation';
UPDATE projects SET category = 'finishing' WHERE id IN ('proj-obour-finishing', 'proj-living-transformation');
