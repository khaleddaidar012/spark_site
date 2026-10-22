import { getCloudflareContext } from "@opennextjs/cloudflare";

interface D1Result<T> {
  results: T[];
  success: boolean;
}

interface D1Statement {
  bind(...values: (string | number | null | ArrayBuffer)[]): D1Statement;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<D1Result<T>>;
  run(): Promise<unknown>;
}

export interface D1Database {
  prepare(query: string): D1Statement;
  batch(statements: D1Statement[]): Promise<unknown[]>;
}

export function getDatabase(): D1Database {
  const { env } = getCloudflareContext();
  const db = (env as unknown as { SPARK_DB?: D1Database }).SPARK_DB;
  if (!db) throw new Error("Cloudflare D1 binding SPARK_DB is not configured.");
  return db;
}
