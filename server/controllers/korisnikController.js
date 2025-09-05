import pool from "../config/db.js";

// dohvat podataka prijavljenog korisnika iz baze
export const dohvatiKorisnika = async (req, res) => {
  try {
    let result = await pool.query(
      "SELECT ime, email, opis FROM korisnik WHERE id = $1",
      [req.userid]
    );
    res.send(result.rows[0]);
  } catch (err) {
    console.log("Database error:", err);
    res.status(500).send("Internal server error");
  }
};

export const updateKorisnika = async (req, res) => {
  try {
    const { ime, opis } = req.body;

    let result = await pool.query(
      `UPDATE korisnik SET 
      ime = $1, 
      opis = $2 
      WHERE id = $3
      RETURNING *`,
      [ime, opis, req.userid]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.log("Database error:", err);
    res.status(500).send("Internal server error: " + err.message);
  }
};

export const dohvatiProfilKorisnika = async (req, res) => {
  try {
    const { id } = req.params;
    let result = await pool.query(
      "SELECT ime, email, opis FROM korisnik WHERE id = $1",
      [id]
    );
    res.send(result.rows[0]);
  } catch (err) {
    console.log("Database error:", err);
    res.status(500).send("Internal server error");
  }
};

