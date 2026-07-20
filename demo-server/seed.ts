import { seedTable, tableNames, DB_PATH } from './db.js';
import {
  generateHREmployees,
  generateFinanceData,
  generateCandidates,
  generateProducts,
  generateGameData,
} from '../demo/sampleData.js';

export function seedAll(force = false): void {
  const existing = tableNames();
  if (!force && existing.length >= 5) {
    console.log(`[seed] DB already seeded (${existing.join(', ')}) — skipping`);
    return;
  }
  console.log(`[seed] seeding ${DB_PATH} ...`);
  seedTable('employees', generateHREmployees());
  seedTable('finance', generateFinanceData());
  seedTable('candidates', generateCandidates(300));
  seedTable('products', generateProducts(40));
  seedTable('games', generateGameData(1000));
  console.log(`[seed] done: ${tableNames().join(', ')}`);
}

// Run directly: `tsx seed.ts [--force]`
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`) {
  seedAll(process.argv.includes('--force'));
}
