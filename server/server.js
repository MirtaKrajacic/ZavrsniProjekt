import express from "express";
import pool from "./config/db.js";
import cors from "cors";

import authRouter from "./routes/authRouter.js";
import korisnikRouter from "./routes/korisnikRouter.js"
import upitnikRouter from "./routes/upitnikRouter.js";
import { verifyToken } from "./middleware/jwtMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json()); // parsira sve requestove sa json bodyem u js objekt req.body

app.use('/auth', authRouter);
app.use('/korisnik', verifyToken, korisnikRouter);
app.use('/upitnik', upitnikRouter);

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
