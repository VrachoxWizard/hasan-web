# Kako popraviti grešku s kontakt formom (Error 500)

Greška koju vidite (`500 Internal Server Error`) javlja se jer aplikacija pokušava poslati e-mail, ali **nedostaje API ključ** za servis za slanje e-mailova (Resend).

## Rješenje 1: Postavljanje Resend API ključa (Preporučeno)

Da bi kontakt forma stvarno slala e-mailove, morate konfigurirati Resend servis.

1.  Otiđite na [Resend.com](https://resend.com) i kreirajte besplatan račun.
2.  Kreirajte novi API Key.
3.  Dodajte taj ključ u Environment Variables na Vercelu (ili gdje je aplikacija hostana).

### Na Vercelu:

1.  Otvorite svoj projekt na Vercel Dashboardu.
2.  Idite na **Settings** > **Environment Variables**.
3.  Dodajte novu varijablu:
    - **Key**: `RESEND_API_KEY`
    - **Value**: `re_123456789...` (vaš ključ s Resenda)
4.  (Opcionalno) Dodajte i email na koji želite primati poruke:
    - **Key**: `CONTACT_EMAIL`
    - **Value**: `vasa@email.adresa` (default je `produktauto@gmail.com`)
5.  **Važno**: Morate napraviti **Redeploy** aplikacije da bi promjene stupile na snagu (ili pričekati sljedeći deploy).

## Rješenje 2: Testiranje bez slanja e-mailova (Preview Mode)

Ažurirao sam kod tako da u **Preview** okruženjima (npr. na Vercel granama koje nisu produkcija) forma "glumi" da je poslala e-mail (vraća uspjeh), ali samo ispisuje sadržaj u logove servera.

Ako koristite URL koji završava na `.vercel.app` i to je Preview deployment, forma bi sada trebala raditi bez greške (ali e-mail neće stići).

Ako je to **Production** deployment (glavna domena ili main branch), **morate** postaviti `RESEND_API_KEY` kao što je opisano u Rješenju 1.

## Provjera logova

Ako i dalje imate problema, provjerite logove na Vercelu:

1.  Kliknite na deployment.
2.  Kliknite na tab **Logs**.
3.  Pokušajte poslati formu.
4.  Ako vidite poruku `CRITICAL: Email service not configured...`, znači da ključ i dalje nedostaje.
