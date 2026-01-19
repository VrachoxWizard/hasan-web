# CMS upute (Produkt Auto)

Ovo su upute za rad u CMS-u (admin dio za unos i uređivanje vozila).
Namijenjeno je korisniku koji ne mora znati ništa o tehnologiji.

Ako je web već online i CMS radi, preskoči dio “Tehničko postavljanje” na dnu.

---

## 1) Kako otvoriti CMS

1. Otvori internet preglednik (Chrome/Edge/Safari).
2. U adresnu traku upiši:
   - `https://VASA-DOMENA.TLD/cms`
3. Ako nisi već prijavljen/a, otvorit će se prijava:
   - `https://VASA-DOMENA.TLD/cms/login`

Važno: CMS se uvijek otvara bez jezika u linku (ne ide `/en` ili `/de`).

---

## 2) Prijava (login)

1. U polje **Korisničko ime** upiši admin korisničko ime.
2. U polje **Lozinka** upiši lozinku.
3. Klikni **Prijava**.

Ako si zaboravio/la lozinku, mora ju promijeniti osoba koja održava web (developer/hosting).

Napomena (lokalno): na računalu (localhost) korisničko ime i lozinka dolaze iz datoteke `.env.local` (polja `CMS_ADMIN_USERNAME` i `CMS_ADMIN_PASSWORD`). Ako Windows ima već postavljene varijable istog naziva, one mogu “pregaziti” vrijednosti – u tom slučaju ih treba obrisati ili promijeniti.

---

## 3) Pregled vozila

Nakon prijave vidiš popis vozila.

Tipične radnje:

- otvori vozilo za uređivanje
- dodaj novo vozilo
- obriši vozilo (koristi pažljivo)

Savjet: nakon spremanja promjena, osvježi javnu stranicu da provjeriš kako izgleda.

---

## 4) Dodavanje novog vozila

1. Klikni **Dodaj vozilo**.
2. Ispuni osnovne podatke (npr. naziv/marka/model/godište/cijena).
3. Dodaj opis i ostale informacije (oprema, napomene, karakteristike).
4. Dodaj slike:
   - klikni na dodavanje slika
   - odaberi jednu ili više slika s računala
5. Klikni **Spremi**.

Preporuka za slike:

- koristi jasne fotografije (eksterijer, interijer, detalji)
- ako je moguće, prvo dodaj “glavnu” sliku kao prvu

---

## 5) Uređivanje postojećeg vozila

1. Na popisu vozila pronađi vozilo.
2. Otvori ga (uređivanje).
3. Promijeni što treba (tekst, cijena, oprema, slike…).
4. Klikni **Spremi**.

Ako uređuješ cijenu, provjeri javnu stranicu i “Ušteda/akcija” prikaz (ako je uključen).

---

## 6) Brisanje vozila

1. Otvori vozilo.
2. Klikni **Obriši**.
3. Potvrdi brisanje.

Važno: brisanje je trajno. Ako nisi siguran/na, radije prvo ukloni vozilo iz “Ekskluzivna vozila” ili ga privremeno uredi (npr. promijeni opis) i dogovori s osobom koja održava web.

---

## 7) Ekskluzivna vozila (povuci i pusti)

Na CMS početnoj vidiš dvije liste:

- **Vozila**
- **Ekskluzivna vozila**

Kako dodati vozilo u ekskluzivna:

1. Uzmi vozilo mišem (klik i drži).
2. Povuci ga u listu **Ekskluzivna vozila**.
3. Pusti miša.

Kako promijeniti redoslijed ekskluzivnih vozila:

1. Povuci vozilo gore/dolje unutar liste **Ekskluzivna vozila**.
2. Pusti miša kad je na željenom mjestu.

Savjet: nakon preslagivanja, osvježi početnu javnu stranicu i provjeri redoslijed.

---

## 8) Odjava

Kad završiš:

1. Klikni **Odjava**.

---

## 9) Ako nešto ne radi (brza pomoć)

- **Ne mogu se prijaviti**: provjeri Caps Lock i točnost korisničkog imena/lozinke.
- **Ne vidim promjene na webu**: osvježi stranicu (Ctrl+R) ili pričekaj 10–30 sekundi pa ponovno.
- **Slike se ne prikazuju**: pokušaj ponovno uploadati sliku (idealno JPG/PNG). Ako i dalje ne radi, javi osobi koja održava web.

---

## Tehničko postavljanje (samo za osobu koja održava web)

Ako CMS već radi u produkciji, ovo ti ne treba.

### Potrebne environment varijable (hosting)

- `NEXT_PUBLIC_SITE_URL` – npr. `https://produktauto.com`
- `DATABASE_URL` – za SQLite, npr. `file:./data/app.db`
- `CMS_ADMIN_USERNAME` – admin korisničko ime
- `CMS_ADMIN_PASSWORD` – jaka lozinka
- `CMS_SESSION_SECRET` – dugačak random string (min. 32+ znakova)
- `CONTACT_EMAIL` – email za kontakt formu

Primjer je u `.env.example`.

### Baza i podaci

- Baza je SQLite datoteka: `data/app.db`
- Slike se spremaju na disk: `public/uploads`

### Jednokratni uvoz vozila iz postojećeg JSON-a (opcionalno)

- `npm run cms:import`
