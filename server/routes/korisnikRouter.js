import express from "express";
import { dohvatiKorisnika, updateKorisnika } from "../controllers/korisnikController.js";

const router = express.Router();

router.get("/get-korisnik", dohvatiKorisnika);
router.put("/update-korisnik", updateKorisnika);

export default router;