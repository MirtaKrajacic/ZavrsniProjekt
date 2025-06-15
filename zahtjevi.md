## Funkcionalni zahtjevi
- neregistrirani korisnik 
    - može se prijaviti za registraciju u sustav
    - može pretraživati javne upitnike na temelju ključnih riječi iz naslova upitnika
    - može proizvoljno rješavati objavljene upitnike
    - dobiva rezultat rješenog upitnika putem e-pošte 
- registrirani korisnik 
    - može se prijaviti u sustav svojim korisničkim imenom i lozinkom
    - može učitati novi upitnik u XML formatu 
    - pri učitavanju upitnika zadaje formulu računanja rezultata upitnika
    - može označiti upitnik za javnu objavu na stranici
    - može upitnik napraviti privatnim i kopirati adresu putem koje je dostupan za rješavanje
    - može pregledavati svoje upitnike (i brisati ih)
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
