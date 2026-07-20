import express from 'express';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { readTable, tableNames } from './db.js';
import { seedAll } from './seed.js';

const PORT = Number(process.env.PORT || 8058);
const STATIC_DIR = resolve(process.env.STATIC_DIR || '../docs');
const started = Date.now();

seedAll();

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '10mb' }));

// Demo sink for the grid's email/schedule export modal
app.post('/api/report/:kind', (req, res) => {
  const { kind } = req.params;
  if (kind !== 'email' && kind !== 'schedule') {
    res.status(404).json({ error: 'Unknown report kind' });
    return;
  }
  console.log(`[report] ${kind} request:`, JSON.stringify({ ...req.body, attachment: req.body?.attachment ? '<omitted>' : undefined, bodyHtml: req.body?.bodyHtml ? `<${String(req.body.bodyHtml).length} chars>` : undefined }));
  res.json({ ok: true, kind, note: 'Demo endpoint — request logged, no email actually sent.' });
});

app.get('/api/v1/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'prd-demo',
    version: process.env.APP_VERSION || '1.0.0',
    uptimeSeconds: Math.round((Date.now() - started) / 1000),
    timestamp: new Date().toISOString(),
    db: { tables: tableNames() },
  });
});

// ── SYSINFO: live stack report (read-only — public demo, no upgrade/restart actions) ──
interface SysinfoRow {
  package: string;
  area: 'web' | 'api' | 'runtime';
  type: 'dependency' | 'devDependency' | 'runtime';
  inUse: string;
  latest: string;
  status: 'up-to-date' | 'patch' | 'minor' | 'major' | 'unknown';
}

let sysinfoCache: { rows: SysinfoRow[]; at: number } | null = null;

function drift(inUse: string, latest: string): SysinfoRow['status'] {
  const a = inUse.replace(/^[^0-9]*/, '').split('.').map(Number);
  const b = latest.split('.').map(Number);
  if (a.some(isNaN) || b.some(isNaN) || a.length < 3 || b.length < 3) return 'unknown';
  if (a[0] !== b[0]) return 'major';
  if (a[1] !== b[1]) return 'minor';
  if (a[2] !== b[2]) return 'patch';
  return 'up-to-date';
}

async function latestVersion(name: string): Promise<string> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const r = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}/latest`, { signal: ctrl.signal });
    clearTimeout(t);
    if (!r.ok) return 'unknown';
    const j = (await r.json()) as { version?: string };
    return j.version || 'unknown';
  } catch {
    return 'unknown';
  }
}

app.get('/api/v1/sysinfo', async (_req, res) => {
  if (sysinfoCache && Date.now() - sysinfoCache.at < 10 * 60_000) {
    res.json({ rows: sysinfoCache.rows, cachedAt: new Date(sysinfoCache.at).toISOString() });
    return;
  }
  try {
    const load = (p: string) => {
      const full = resolve(p);
      return existsSync(full) ? JSON.parse(readFileSync(full, 'utf8')) : null;
    };
    const webPkg = load('../package.json');
    const apiPkg = load('./package.json');
    const entries: { name: string; area: SysinfoRow['area']; type: SysinfoRow['type']; inUse: string }[] = [];
    for (const [pkg, area] of [[webPkg, 'web'], [apiPkg, 'api']] as const) {
      if (!pkg) continue;
      for (const [name, v] of Object.entries(pkg.dependencies || {})) {
        entries.push({ name, area, type: 'dependency', inUse: String(v) });
      }
      if (area === 'web') {
        for (const [name, v] of Object.entries(pkg.devDependencies || {})) {
          entries.push({ name, area, type: 'devDependency', inUse: String(v) });
        }
      }
    }
    const rows: SysinfoRow[] = await Promise.all(
      entries.map(async (e) => {
        const latest = await latestVersion(e.name);
        return {
          package: e.name,
          area: e.area,
          type: e.type,
          inUse: e.inUse.replace(/^[\^~]/, ''),
          latest,
          status: latest === 'unknown' ? 'unknown' : drift(e.inUse, latest),
        };
      })
    );
    rows.push({
      package: 'node',
      area: 'runtime',
      type: 'runtime',
      inUse: process.version.replace(/^v/, ''),
      latest: 'unknown',
      status: 'unknown',
    });
    sysinfoCache = { rows, at: Date.now() };
    res.json({ rows, cachedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: 'sysinfo collection failed' });
  }
});

const ALLOWED = new Set(['employees', 'finance', 'candidates', 'products', 'games']);

app.get('/api/data/:table', (req, res) => {
  const { table } = req.params;
  if (!ALLOWED.has(table)) {
    res.status(404).json({ error: `Unknown table '${table}'` });
    return;
  }
  const rows = readTable(table);
  if (!rows) {
    res.status(503).json({ error: 'Database not seeded' });
    return;
  }
  res.json({ table, count: rows.length, rows });
});

if (existsSync(STATIC_DIR)) {
  // index.html must revalidate every load so deploys show instantly;
  // hashed /assets/* are content-addressed and can cache forever.
  app.use(
    express.static(STATIC_DIR, {
      index: 'index.html',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        } else if (filePath.includes('assets')) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=3600');
        }
      },
    })
  );
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(resolve(STATIC_DIR, 'index.html'));
  });
} else {
  console.warn(`[server] static dir not found: ${STATIC_DIR} — API only`);
}

app.listen(PORT, () => {
  console.log(`[server] prd-demo listening on :${PORT} (static: ${STATIC_DIR})`);
});
