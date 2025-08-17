import pool from "../config/db.js";
import jwt from "jsonwebtoken";

const secretKey = "secret-key";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await pool.query(
      "INSERT INTO korisnik (ime, email, sifra) VALUES ($1, $2, $3)",
      [name, email, password]
    );
    const result = await pool.query(
      "SELECT id FROM korisnik WHERE email = $1 AND sifra = $2",
      [email, password]
    );

    const id = result.rows[0].id;
    const user = req.body;
    const filteredUser = {
      name: user.name,
      email: user.email,
      id: id,
    };

    const token = jwt.sign({ userid: id }, secretKey, { expiresIn: "1h" });
    
    res.json({
      auth: token,
      user: filteredUser,
    });

    console.log("user saved!");
  } catch (err) {
    console.error(err);
    console.log("failed: " + err);
    res.status(500).send("Database error");
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT id, ime, email FROM korisnik WHERE email = $1 AND sifra = $2",
      [email, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const filteredUser = {
        name: user.name,
        email: user.email,
        id: user.id,
      };

      const token = jwt.sign({ userid: user.id }, secretKey, {
        expiresIn: "1h",
      });

      res.json({
        auth: token,
        user: filteredUser,
      });
    } else {
      res.status(401).json("No user found");
    }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Internal server error");
  }
}

export {register, login};