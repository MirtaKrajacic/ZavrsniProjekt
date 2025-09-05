import express from "express";

import { verifyToken } from "../middleware/jwtMiddleware.js";
import { dohvatiKorisnika, updateKorisnika, dohvatiProfilKorisnika } from "../controllers/korisnikController.js";

const router = express.Router();

router.get("/get-korisnik", verifyToken, dohvatiKorisnika);
router.put("/update-korisnik", verifyToken, updateKorisnika);

// dohvacanje podataka korisnika radi prikaza profila javno u aplikaciji
router.get("/get-korisnik/:id", dohvatiProfilKorisnika); 

export default router;