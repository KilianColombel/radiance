import sqlite3 from 'sqlite3';
import { open } from 'sqlite';


// TODO this is really unoptimized and broken

async function openDb() {
  return open({
    filename: './radiance.db',
    driver: sqlite3.Database
  });
}

// creates the table if it doesn't exist
async function setupDb() {
  const db = await openDb();
  await db.exec(
    `CREATE TABLE IF NOT EXISTS tracks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      duration INTEGER,
      favorited FALSE
    );`
  );
  return db;
}
setupDb();

// adds the track
// TODO can add duplicates...
export async function addTrack(name, duration) {
  const db = await openDb();
  try {
    const result = await db.run(
      `INSERT INTO tracks (name, duration, favorited) VALUES (?, ?, ?)`,
      [name, duration, true]
    );
    console.log(`track "${name}" added with id : ${result.lastID}`);
  } catch (error) {
    console.error(`couldn't add track "${name}" :`, error);
  } finally {
    await db.close();
  }
}

addTrack("test", 150)
