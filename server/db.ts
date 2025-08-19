import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema";
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

// Ensure data directory exists
const dbPath = './data/database.db';
const dbDir = dirname(dbPath);
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

// Initialize SQLite database
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });

// Auto-migrate on startup
try {
  // Check if migrations directory exists
  if (existsSync('./drizzle')) {
    migrate(db, { migrationsFolder: './drizzle' });
  }
} catch (error) {
  console.log('No migrations to run or migrations failed:', error);
}

export default db;