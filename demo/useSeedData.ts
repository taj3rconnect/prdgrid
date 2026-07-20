import { useState, useEffect } from 'react';

/**
 * Seed data hook — served from the prd-demo SQLite API when hosted;
 * falls back to in-browser generators for local dev / static hosting.
 */
export function useSeedData<T>(table: string, fallback: () => T[], refreshKey = 0): T[] {
  const [data, setData] = useState<T[]>(fallback);
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/data/${table}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => {
        if (!cancelled && Array.isArray(j.rows) && j.rows.length > 0) setData(j.rows);
      })
      .catch(() => {}); // no API (static hosting / local vite) — keep generated fallback
    return () => {
      cancelled = true;
    };
  }, [table, refreshKey]);
  return data;
}
