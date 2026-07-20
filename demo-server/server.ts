import express from 'express';
import { existsSync } from 'node:fs';
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
  app.use(express.static(STATIC_DIR, { maxAge: '1h', index: 'index.html' }));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
    res.sendFile(resolve(STATIC_DIR, 'index.html'));
  });
} else {
  console.warn(`[server] static dir not found: ${STATIC_DIR} — API only`);
}

app.listen(PORT, () => {
  console.log(`[server] prd-demo listening on :${PORT} (static: ${STATIC_DIR})`);
});
