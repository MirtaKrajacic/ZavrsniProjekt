import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const secretKey = "secret-key";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.query(
      "INSERT INTO korisnik (ime, email, lozinka) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    const result = await pool.query(
      "SELECT id FROM korisnik WHERE email = $1 AND lozinka = $2",
      [email, hashedPassword]
    );

    const id = result.rows[0].id;
    const token = jwt.sign({ userid: id }, secretKey, { expiresIn: "24h" });

    res.json({
      auth: token,
    });
    console.log("user saved!");
  } catch (err) {
    console.error(err);
    console.log("failed: " + err);
    res.status(500).send("Database error");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query(
      "SELECT id, ime, email, lozinka FROM korisnik WHERE email = $1",
      [email]
    );
    const user = result.rows[0];
    const hashedPassword = user.lozinka;

    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      return res.status(401).json("Netočno korisničko ime ili lozinka");
    }

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const token = jwt.sign({ userid: user.id }, secretKey, {
        expiresIn: "1h",
      });

      res.json({
        auth: token,
      });
    } else {
      res.status(401).json("No user found");
    }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Internal server error");
  }
};

export { register, login };
