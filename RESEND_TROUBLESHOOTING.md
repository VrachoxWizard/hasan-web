# Rješavanje problema s Resend API ključem

Ako ste dodali `RESEND_API_KEY` ali i dalje dobivate greške, provjerite sljedeće:

## 1. Ponovno pokretanje (Redeploy)

Ako koristite Vercel, **promjena Environment Variables ne utječe na trenutno pokrenutu aplikaciju**.

- Morate napraviti **Redeploy** da bi aplikacija "pokupila" novi ključ.
- Idite na Vercel Dashboard -> Deployments -> Kliknite na zadnji deployment -> Redeploy.

Ako radite lokalno (`npm run dev`), morate zaustaviti server (Ctrl+C) i ponovno ga pokrenuti.

## 2. Provjera domene (Resend Verification)

Resend ima stroga pravila za slanje e-mailova:

- **Ako niste verificirali domenu**: Možete slati e-mailove **samo na e-mail adresu s kojom ste se registrirali na Resend**.

  - Ako pokušavate poslati na `produktauto@gmail.com`, a registrirali ste se s `mate@example.com`, Resend će odbiti zahtjev.
  - **Rješenje**: Promijenite `CONTACT_EMAIL` u Environment Variables na vašu Resend email adresu (za testiranje).

- **From adresa**: Ako domena nije verificirana, `from` adresa mora biti `onboarding@resend.dev`.
  - Kod je već podešen da koristi ovo ako `RESEND_FROM` nije postavljen, tako da ovo vjerojatno nije problem, osim ako ste ručno postavili `RESEND_FROM` na nešto drugo.

## 3. Provjera greške

Ažurirao sam kod da ispisuje točnu grešku u logove.

1.  Otvorite Vercel Logs (ili terminal ako ste lokalno).
2.  Pokušajte poslati formu.
3.  Potražite liniju koja počinje s `Resend API Error:`.

Najčešće greške:

- `missing_api_key`: Ključ nije dobro postavljen.
- `invalid_api_key`: Ključ je pogrešan (provjerite jeste li kopirali razmake).
- `restricted_api_key`: Ključ nema dozvolu za slanje e-mailova.
- `validation_error`: Problem s domenom ili primateljem (vidi točku 2).
