import express from "express";
import pool from "./db/config.js";
import cors from "cors";
import jwt from "jsonwebtoken";

const secretKey = "secret-key";
const app = express();
const secureRouter = express.Router(); // ruter za secure rutu

app.use(cors());

app.get("/", (req, res) => {
});

app.use(express.json()); // parsira sve requestove sa json bodyem u js objekt req.body
// probni zapis novog korisnika u bazu


app.post("/register", async (req, res) => {
  console.log(req.body);
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
});

app.post("/login", async (req, res) => {
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
});

// ruta za dohvacanje svih upitnika iz baze
app.get("/get-upitnici", async (req, res) => {
  try {
    const products = await pool.query(`
      SELECT u.*, k.ime
      FROM upitnik u
      JOIN korisnik k ON k.id = u.autor_id
      ORDER BY u.naslov ASC`
    );
    if (products.rows.length > 0) {
      res.send(products.rows);
    } else {
      res.status(401).json("nisu produnađeni upitnici");
    }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Internal server error");
  }
});

// ruta za dohvacanje javnih upitnika koji matchaju search
app.get("/search/:key", async (req, res) => {
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
});

// dohvacanje xml zapisa upitnika sa zadanim id-em
app.get("/get-xml/:id", async (req, res) => {
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
});

// dohvacanje xml zapisa privatnog upitnika sa zadanim uuid-em
app.get("/get-xml/private/:uuid", async (req, res) => {
  try {
    const token = req.params.uuid;
    const result = await pool.query("SELECT * FROM upitnik WHERE link_token = $1", [
      token,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send("Nema upitnika s danim tokenom");
    }
    res.json({ xml: result.rows[0].sadrzaj }); // prikazuje sve koji matchaju sa searchom u imenu
  } catch (err) {
    res.status(500).send("Internal server error: " + err.message);
    console.log(err.message);
  }
});

// ruta za dodavanje upitnika u bazu - jos se treba editat
app.post("/add-upitnik", async (req, res) => {
  let { naslov, autor_id, sadrzaj, status, kratki_opis } = req.body;
  console.log('got request: ', autor_id);
  try {
    await pool.query(
      "INSERT INTO upitnik (naslov, autor_id, sadrzaj, status, kratki_opis) VALUES ($1, $2, $3, $4, $5)",
      [naslov, parseInt(autor_id), sadrzaj, status, kratki_opis]
    );
    res.status(201).send("upitnik dodan!");
  } catch (err) {
    console.log("Database error:", err);
    res.status(500).send("Internal server error");
  }
});

// ruta za dohvacanje svih upitnika iz baze od autora zadanog id-a
secureRouter.get("/get-upitnici/:autor_id", async (req, res) => {
  try {
    const products = await pool.query(`
      SELECT u.*, k.ime
      FROM upitnik u
      JOIN korisnik k ON k.id = u.autor_id
      WHERE u.autor_id = $1
      ORDER BY u.naslov ASC`,
      [req.params.autor_id]
    );
    if (products.rows.length > 0) {
      res.send(products.rows);
    } else {
      res.status(401).json("nisu pronađeni upitnici");
    }
  } catch (err) {
    console.log(err);
    console.error("Database error:", err);
    res.status(500).send("Internal server error");
  }
});

// brisanje upitnika zadanog id-a iz baze 
secureRouter.delete("/del-upitnik/:id", async (req, res) => {
  let result = await pool.query("DELETE FROM upitnik WHERE id = $1", [
    req.params.id,
  ]);
  res.send(result); 
});

/*
app.put("/product/:id", verifyToken, async (req, res) => {
  try {
    const { name, price, category, company } = req.body;
    const fields = [];
    const values = [];
    let paramIndex = 1;
    if (name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (price !== undefined) {
      fields.push(`price = $${paramIndex++}`);
      values.push(price);
    }
    if (category !== undefined) {
      fields.push(`category = $${paramIndex++}`);
      values.push(category);
    }
    if (company !== undefined) {
      fields.push(`company = $${paramIndex++}`);
      values.push(company);
    }
    if (fields.length === 0) {
      return res.status(400).send("No valid fields provided for update.");
    }
    // Add the id as the last parameter
    values.push(req.params.id);
    const query = `
      UPDATE proizvod
      SET ${fields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).send("Product not found.");
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).send("Internal server error: " + err.message);
  }
});
*/

// secure rute su one kojima pristup ima samo prijavljeni korisnik
// koriste token kako bi znale s kojim korisnikom se komunicira (na temelju id-a)
app.use("/secure", verifyToken, secureRouter);
function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    jwt.verify(token, secretKey, (err, succ) => {
      if (err) {
        res.status(401).send("provide valid token");
      } else {
        console.log("good token");
        next();
      }
    });
  } else {
    console.log("provide token");
    res.status(403).send("provide token");
  }
}

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
