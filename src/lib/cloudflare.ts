import { getCloudflareContext } from "@opennextjs/cloudflare";

interface D1Result<T> {
  results: T[];
  success: boolean;
}

interface D1Statement {
  bind(...values: (string | number | null)[]): D1Statement;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<D1Result<T>>;
  run(): Promise<unknown>;
}

export interface D1Database {
  prepare(query: string): D1Statement;
}

export interface R2Bucket {
  put(
    key: string,
    value: ArrayBuffer | ArrayBufferView | Blob | string,
    options?: { httpMetadata?: { contentType?: string; cacheControl?: string } },
  ): Promise<unknown>;
  get(key: string): Promise<{
    body: ReadableStream<Uint8Array> | null;
    httpMetadata?: { contentType?: string };
    httpEtag?: string;
  } | null>;
  delete(key: string): Promise<void>;
}

export function getDatabase(): D1Database {
  const { env } = getCloudflareContext();
  const db = (env as unknown as { SPARK_DB?: D1Database }).SPARK_DB;
  if (!db) throw new Error("Cloudflare D1 binding SPARK_DB is not configured.");
  return db;
}

export function getImagesBucket(): R2Bucket {
  const { env } = getCloudflareContext();
  const bucket = (env as unknown as { SPARK_IMAGES?: R2Bucket }).SPARK_IMAGES;
  if (!bucket) throw new Error("Cloudflare R2 binding SPARK_IMAGES is not configured.");
  return bucket;
}
