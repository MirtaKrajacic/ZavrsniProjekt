# Opis projekta

Ova web aplikacija razvijena je u kontekstu Završnog rada preddiplomskog studija na FERu. 
Cilj je omogućiti besplatno rješavanje i učitavanje psiholoških upitnika. Nakon rješavanja korisnik dobiva povratnu informaciju na temelju izračunatog rezultata. Namjera nije stručna dijagnoza korisnika, već početni uvid u njegovo psihološko stanje vezano uz psihološku pojavu koju upitnik ispituje. Korisnik potom sam odlučuje treba li potražiti daljnju profesionalnu pomoć izvan okvira same aplikacije. 

S jedne strane korisnik može pretraživati objavljene upitnike i rješavati ih, a s druge strane, psiholozi imaju priliku učitavati upitnike i objavljivati ih. Također, postoji opcija za kreiranjem privatnog upitnika koji je dostupan za rješavanje isključivo putem dijeljene veze. Nije potrebno da se korisnik registrira na stranicu kako bi rješavao upitnike, ali ako želi objavljivati vlastite, mora popuniti obrazac za registraciju u kojeg unosi dokaz o stručnosti (npr. licenca institucije u koju je psiholog upisan). Takve obrasce potom pregledava korisnik admin koji odlučuje smije li se registrirati novi korisnik.

## Funkcionalni zahtjevi
- Korisnik može ispunjavati javne upitnike i one podijeljene s njime putem veze.
- Korisnik može pretraživati javne upitnike.
- Korisnik se može registrirati u aplikaciju ako u cilju ima dijeliti psihološke upitnike
- Registrirani korisnik može učitati novi upitnik u XML formatu i zadati formulu izračuna rezultata.
- Registrirani korisnik ima pregled nad vlastitim upitnicima.
- Administrator može pregledavati zahtjeve za registraciju i odobravati ih.

## Korištene tehnologije
- **Frontend:** React
- **Backend:** Node.js, Express
- **Baza podataka:** PostgreSQL