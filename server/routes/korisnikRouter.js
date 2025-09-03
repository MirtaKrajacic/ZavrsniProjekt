import express from "express";

import { verifyToken } from "../middleware/jwtMiddleware.js";
import { dohvatiKorisnika, updateKorisnika } from "../controllers/korisnikController.js";

const router = express.Router();

router.get("/get-korisnik", verifyToken, dohvatiKorisnika);
router.put("/update-korisnik", verifyToken, updateKorisnika);

export default router;