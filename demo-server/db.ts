import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export const DB_PATH = process.env.DB_PATH || './data/prdgrid.db';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    mkdirSync(dirname(DB_PATH), { recursive: true });
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

type ColType = 'number' | 'boolean' | 'json' | 'text';

interface TableMeta {
  columns: Record<string, ColType>;
}

function colType(value: unknown): ColType {
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (value !== null && typeof value === 'object') return 'json';
  return 'text';
}

function sqlType(t: ColType): string {
  return t === 'number' ? 'REAL' : t === 'boolean' ? 'INTEGER' : 'TEXT';
}

/** Create a real-columned table inferred from the row shape and bulk-insert rows. */
export function seedTable(name: string, rows: Record<string, any>[]): void {
  const d = getDb();
  const sample: Record<string, any> = {};
  for (const row of rows) {
    for (const [k, v] of Object.entries(row)) {
      if (!(k in sample) && v != null) sample[k] = v;
    }
  }
  const columns: Record<string, ColType> = {};
  for (const k of Object.keys(rows[0] || sample)) {
    columns[k] = colType(sample[k]);
  }

  d.exec(`DROP TABLE IF EXISTS "${name}"`);
  const ddl = Object.entries(columns)
    .map(([k, t]) => `"${k}" ${sqlType(t)}`)
    .join(', ');
  d.exec(`CREATE TABLE "${name}" (${ddl})`);

  const keys = Object.keys(columns);
  const insert = d.prepare(
    `INSERT INTO "${name}" (${keys.map((k) => `"${k}"`).join(',')}) VALUES (${keys.map(() => '?').join(',')})`
  );
  const insertAll = d.transaction((all: Record<string, any>[]) => {
    for (const row of all) {
      insert.run(
        keys.map((k) => {
          const v = row[k];
          const t = columns[k];
          if (v == null) return null;
          if (t === 'boolean') return v ? 1 : 0;
          if (t === 'json') return JSON.stringify(v);
          return v;
        })
      );
    }
  });
  insertAll(rows);

  d.exec(`CREATE TABLE IF NOT EXISTS _meta (name TEXT PRIMARY KEY, columns TEXT)`);
  d.prepare(`INSERT OR REPLACE INTO _meta (name, columns) VALUES (?, ?)`).run(name, JSON.stringify(columns));
}

/** Read all rows, restoring booleans and JSON columns. */
export function readTable(name: string): Record<string, any>[] | null {
  const d = getDb();
  const meta = d.prepare(`SELECT columns FROM _meta WHERE name = ?`).get(name) as { columns: string } | undefined;
  if (!meta) return null;
  const columns: TableMeta['columns'] = JSON.parse(meta.columns);
  const rows = d.prepare(`SELECT * FROM "${name}"`).all() as Record<string, any>[];
  for (const row of rows) {
    for (const [k, t] of Object.entries(columns)) {
      if (row[k] == null) continue;
      if (t === 'boolean') row[k] = row[k] === 1;
      else if (t === 'json') row[k] = JSON.parse(row[k]);
    }
  }
  return rows;
}

export function tableNames(): string[] {
  const d = getDb();
  try {
    return (d.prepare(`SELECT name FROM _meta`).all() as { name: string }[]).map((r) => r.name);
  } catch {
    return [];
  }
}
