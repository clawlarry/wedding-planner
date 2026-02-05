import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'wedding.db');
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS venues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    viewing_date TEXT,
    viewing_time TEXT,
    status TEXT DEFAULT 'interested',
    notes TEXT,
    pros TEXT,
    cons TEXT,
    price_range TEXT,
    capacity TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS venue_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venue_id INTEGER,
    photo_path TEXT,
    caption TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    due_date TEXT,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS guests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    side TEXT,
    category TEXT,
    rsvp_status TEXT DEFAULT 'pending',
    meal_choice TEXT,
    notes TEXT,
    plus_one BOOLEAN DEFAULT 0,
    plus_one_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item TEXT NOT NULL,
    category TEXT,
    estimated_cost REAL,
    actual_cost REAL,
    paid BOOLEAN DEFAULT 0,
    vendor TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;
