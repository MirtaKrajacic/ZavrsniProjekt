import express from "express";

// rutama koje koriste verifyToken pristup ima samo prijavljeni korisnik
// koriste token kako bi znale s kojim korisnikom se komunicira (na temelju id-a)

import { verifyToken } from "../middleware/jwtMiddleware.js";
import {
  listJavniUpitnici,         
  searchJavniUpitnici,       
  getUpitnikRjesavanje,                 
  getUpitnikRjesavanjePriv,        
  addUpitnik,                
  addPrivatniUpitnik,        
  listMojiUpitnici,            
  deleteUpitnik
} from "../controllers/upitnikController.js";

const router = express.Router();

// ruta za dohvacanje svih upitnika iz baze
router.get("/get-upitnici", listJavniUpitnici);

// ruta za dohvacanje javnih upitnika koji matchaju search
router.get("/search/:key", searchJavniUpitnici);

// dohvacanje podataka upitnika sa zadanim id-em radi rjesavanja
router.get("/get-upitnik/:id", getUpitnikRjesavanje);

// dohvacanje xml zapisa privatnog upitnika sa zadanim uuid-em
router.get("/get-upitnik/private/:uuid", getUpitnikRjesavanjePriv);

// ruta za dodavanje upitnika u bazu - jos se treba editat
router.post("/add-upitnik", verifyToken, addUpitnik);

// ruta za dodavanje privatnog upitnika u bazu 
router.post("/add-privatni-upitnik/:uuid", verifyToken, addPrivatniUpitnik);

// ruta za dohvacanje svih upitnika iz baze od autora zadanog id-a
router.get("/get-moji-upitnici", verifyToken, listMojiUpitnici);

// brisanje upitnika zadanog id-a iz baze
router.delete("/del-upitnik/:id", verifyToken, deleteUpitnik);



export default router;