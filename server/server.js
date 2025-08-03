import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;
const app = express();

const pool = new Pool(); // reuses existing connections instead of opening a new one for every query

app.listen(5000, () => {
  console.log("Server started on port 5000");
});

// proba jesmo li se spojili na database
try {
  await pool.query('SELECT 1');
  console.log('Connected to the database!');
} catch (err) {
  console.error('Connection error', err.stack);
}

// fetching korisnika
try {
    const res = await pool.query('SELECT * FROM korisnik');
    console.log('Fetched users:', res.rows[0]);
} catch (err) {
    console.error('error');
}

app.get("/", (req, res) => { 
    res.json({"users": ["userOne", "userTwo", "userThree"]})
});
