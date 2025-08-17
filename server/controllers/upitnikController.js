import pool from "../config/db.js";

// 1 handler = 1 route
export const listJavniUpitnici = async (req, res) => {
  try {
    const products = await pool.query(`
      SELECT u.*, k.ime
      FROM upitnik u
      JOIN korisnik k ON k.id = u.autor_id
      WHERE u.status = 'javni'
      ORDER BY u.naslov ASC`);
    if (products.rows.length > 0) {
      res.send(products.rows);
    } else {
      res.json("nisu produnađeni upitnici");
    }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Internal server error");
  }
};

export const searchJavniUpitnici = async (req, res) => {
  try {
    const searchKey = req.params.key;
    const result = await pool.query(
      `SELECT u.*, k.ime 
        FROM upitnik u
        JOIN korisnik k ON k.id = u.autor_id
        WHERE u.status = 'javni'
        AND (
          u.naslov ILIKE '%' || $1 || '%'
          OR u.kratki_opis ILIKE '%' || $1 || '%'
          OR k.ime ILIKE '%' || $1 || '%'
        )
        ORDER BY naslov ASC`,
      [searchKey]
    );
    res.send(result.rows); // prikazuje sve koji matchaju sa searchom
  } catch (err) {
    res.status(500).send("Internal server error: " + err.message);
    console.log(err.message);
  }
};

export const getXml = async (req, res) => {
  try {
    const upitnikId = req.params.id;
    const result = await pool.query("SELECT * FROM upitnik WHERE id = $1", [
      upitnikId,
    ]);
    // result.rows - polje JS objekata gdje je svaki row tablice jedan objekt
    res.json({ xml: result.rows[0].sadrzaj }); // prikazuje sve koji matchaju sa searchom u imenu
  } catch (err) {
    res.status(500).send("Internal server error: " + err.message);
    console.log(err.message);
  }
};

export const getPrivatniXml = async (req, res) => {
  try {
    const token = req.params.uuid;
    const result = await pool.query(
      "SELECT * FROM upitnik WHERE link_token = $1",
      [token]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Nema upitnika s danim tokenom");
    }
    res.json({ xml: result.rows[0].sadrzaj }); // prikazuje sve koji matchaju sa searchom u imenu
  } catch (err) {
    res.status(500).send("Internal server error: " + err.message);
    console.log(err.message);
  }
};

export const addUpitnik = async (req, res) => {
  let { naslov, sadrzaj, status, kratki_opis } = req.body;
  try {
    await pool.query(
      "INSERT INTO upitnik (naslov, autor_id, sadrzaj, status, kratki_opis) VALUES ($1, $2, $3, $4, $5)",
      [naslov, req.userid, sadrzaj, status, kratki_opis]
    );
    res.status(201).send("upitnik dodan!");
  } catch (err) {
    console.log("Database error:", err);
    res.status(500).send("Internal server error");
  }
};

export const addPrivatniUpitnik = async (req, res) => {
  let { naslov, sadrzaj, status, kratki_opis } = req.body;
  try {
    await pool.query(
      "INSERT INTO upitnik (naslov, autor_id, sadrzaj, status, kratki_opis, link_token) VALUES ($1, $2, $3, $4, $5, $6)",
      [naslov, req.userid, sadrzaj, status, kratki_opis, req.params.uuid]
    );
    res.status(201).send("upitnik dodan!");
  } catch (err) {
    console.log("Database error:", err);
    res.status(500).send("Internal server error");
  }
};

export const listMojiUpitnici = async (req, res) => {
  try {
    const products = await pool.query(
      `
      SELECT u.*, k.ime
      FROM upitnik u
      JOIN korisnik k ON k.id = u.autor_id
      WHERE u.autor_id = $1
      ORDER BY u.naslov ASC`,
      [req.userid]
    );
    if (products.rows.length > 0) {
      res.send(products.rows);
    } else {
      res.json("nisu pronađeni upitnici");
    }
  } catch (err) {
    console.log(err);
    console.error("Database error:", err);
    res.status(500).send("Internal server error");
  }
};

export const deleteUpitnik = async (req, res) => {
  try {
    let result = await pool.query(
      "DELETE FROM upitnik WHERE id = $1 AND autor_id = $2",
      [req.params.id, req.userid]
    );
    res.send(result);
  } catch (err) {
    console.log("Database error:", err);
    res.status(500).send("Internal server error");
  }
};

