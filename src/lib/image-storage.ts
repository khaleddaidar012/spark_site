import { getDatabase } from "@/lib/cloudflare";

// Keep rows comfortably below D1's 2 MB limit.
const CHUNK_BYTES = 512 * 1024;
export async function storeImage(key: string, bytes: Uint8Array, contentType: string) {
 const db = getDatabase();
 const count = Math.ceil(bytes.length / CHUNK_BYTES);
 const statements = [db.prepare("INSERT INTO uploaded_images (image_key, content_type, byte_length, chunk_count) VALUES (?, ?, ?, ?)").bind(key, contentType, bytes.length, count)];
 for (let index = 0; index < count; index++) {
  const chunk = bytes.slice(index * CHUNK_BYTES, (index + 1) * CHUNK_BYTES);
  statements.push(db.prepare("INSERT INTO uploaded_image_chunks (image_key, chunk_index, data) VALUES (?, ?, ?)").bind(key, index, chunk.buffer));
 }
 await db.batch(statements);
}
export async function deleteImage(key: string) {
 await getDatabase().prepare("DELETE FROM uploaded_images WHERE image_key = ?").bind(key).run();
}
export async function readImage(key: string) {
 const db = getDatabase();
 const image = await db.prepare("SELECT content_type, byte_length, chunk_count FROM uploaded_images WHERE image_key = ?").bind(key).first<{ content_type: string; byte_length: number; chunk_count: number }>();
 if (!image) return null;
 const { results } = await db.prepare("SELECT data FROM uploaded_image_chunks WHERE image_key = ? ORDER BY chunk_index").bind(key).all<{ data: number[] | ArrayBuffer }>();
 if (results.length !== image.chunk_count) throw new Error("Incomplete image data");
 const body = new Uint8Array(image.byte_length);
 let offset = 0;
 for (const row of results) {
  const chunk = new Uint8Array(row.data);
  body.set(chunk, offset);
  offset += chunk.length;
 }
 if (offset !== image.byte_length) throw new Error("Invalid image length");
 return { body, contentType: image.content_type };
}
