ALTER TABLE projects ADD COLUMN project_images TEXT NOT NULL DEFAULT '[]';

UPDATE projects SET project_images = json_array(image) WHERE project_images = '[]';
