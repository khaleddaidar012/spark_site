CREATE TABLE IF NOT EXISTS uploaded_images (
 image_key TEXT PRIMARY KEY, content_type TEXT NOT NULL,
 byte_length INTEGER NOT NULL, chunk_count INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS uploaded_image_chunks (
 image_key TEXT NOT NULL REFERENCES uploaded_images(image_key) ON DELETE CASCADE,
 chunk_index INTEGER NOT NULL, data BLOB NOT NULL,
 PRIMARY KEY (image_key, chunk_index)
);
