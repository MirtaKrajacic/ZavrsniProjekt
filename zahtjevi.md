## Funkcionalni zahtjevi
- korisnik se može registrirati na stranicu ako u cilju ima dijeliti psihološke upitnike
- registracija se odvija putem obrasca kojeg korisnik ispunjava te se on šalje na pregled adminu
- postoje upitnici javno dostupni za rješavanje na stranici 
- postoje privatni privatni upitnici koji su dostupni samo putem dijeljene adrese
- registrirani korisnik 
    - može učitati novi upitnik u XML formatu 
    - pri učitavanju upitnika zadaje formulu računanja rezultata upitnika
    - može označiti upitnik za javnu objavu na stranici
    - može upitnik napraviti privatnim i kopirati adresu putem koje je dostupan za rješavanje
    - može pregledavati svoje upitnike
- neregistrirani korisnik 
    - može pretraživati javne upitnike na temelju ključnih riječi iz naslova upitnika
    - može proizvoljno rješavati objavljene upitnike
    - dobiva rezultat rješenog upitnika putem e-pošte 
- administrator (admin)
    - ima pregled nad obrascima za registraciju
    - može u bazi označiti je li korisnik odobren za registraciju 

## Nefunkcionalni zahtjevi
- samo ovjereni korisnici mogu objavljivati sadržaj
- korisnik admin je ovlaštena osoba te se to provjerava autentikacijom
- e-pošta na koju se šalju rezultati upitnika ne pohranjuje se trajno u sustav
- dizajn mora biti responzivan i prilagođen za mobilne uređaje
- sustav mora podržavati istovremene korisnike
- aplikacija mora biti dostupna cijelo vrijeme
