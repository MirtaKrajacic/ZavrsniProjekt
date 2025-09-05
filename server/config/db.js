import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool(); 

// proba jesmo li se spojili na database
try {
  await pool.query('SELECT 1');
  console.log('Connected to the database!');
} catch (err) {
  console.error('Database error');
}

export default pool;