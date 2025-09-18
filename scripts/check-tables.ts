import { db } from '../db';
import { sql } from 'drizzle-orm';

async function checkTables() {
  try {
    const result = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log('Existing tables:', result);
  } catch (error) {
    console.error('Error checking tables:', error);
  }
}

checkTables();