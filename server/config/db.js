import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool(); // reuses existing connections instead of opening a new one for every query

// proba jesmo li se spojili na database
try {
  await pool.query('SELECT 1');
  console.log('Connected to the database!');
} catch (err) {
  console.error('Connection error', err.stack);
}

export default pool;