# Deployment Next.js Projekta na Hostinger (cPanel)

Ovaj vodič opisuje kako ručno uploadati i pokrenuti Next.js 16 projekt na Hostinger hosting preko cPanela.

---

## 📋 Preduvjeti

- Hostinger hosting plan koji podržava Node.js (Business ili viši plan)
- Pristup cPanelu
- Domena povezana s hostingom (npr. `produktauto.com`)
- Projekt lokalno buildiran i testiran

---

## 1️⃣ Priprema Projekta Lokalno

### 1.1. Instaliraj Dependencies i Buildiraj

```bash
# U root folderu projekta
npm install

# Generiraj production build
npm run build
```

**Bitno**: Provjeri da build prolazi bez grešaka!

### 1.2. Kreiraj `.env.production` Datoteku

Napravi `.env.production` s production vrijednostima:

```env
# Site URL
NEXT_PUBLIC_SITE_URL=https://produktauto.com

# Database
DATABASE_URL=file:./data/app.db

# CMS Auth
CMS_ADMIN_USERNAME=admin
CMS_ADMIN_PASSWORD=<jaka-lozinka>
CMS_SESSION_SECRET=<generiraj-random-string-min-32-znaka>

# Contact Email
CONTACT_EMAIL=produktauto@gmail.com

# Optional: Email servisi (Resend ili SendGrid)
RESEND_API_KEY=re_xxxxxxxxxxxxx
# ili
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx

# Optional: Google Maps (ako koristiš mapu)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaXXXXXXXXXXXXXXXXX
```

**Napomena**: Ne commitaj ovu datoteku u Git!

### 1.3. Spakiraj Projekt

Trebamo uploadati samo potrebne fileove. Kreiraj ZIP arhivu s:

```
✅ Uključi:
- .next/                 (buildirani folder)
- public/               (statički fileovi)
- node_modules/         (production dependencies)
- package.json
- package-lock.json
- next.config.ts        (ili next.config.js)
- prisma/              (schema + migrations)
- data/                (SQLite baza ako postoji)
- .env.production      (ovaj će se ručno podesiti na serveru)

❌ NE uključuj:
- .git/
- src/                 (izvorni kod nije potreban, sve je u .next/)
- node_modules/@types/ (dev dependencies)
- .env.local
- .github/
- docs/
- __tests__/
```

**Alternativa**: Možeš uploadati cijeli projekt i buildirati na serveru, ali je to sporije.

---

## 2️⃣ Upload Projekta na Hostinger

### 2.1. Uloguj se u cPanel

1. Idi na [Hostinger hPanel](https://hpanel.hostinger.com/)
2. Odaberi svoj hosting plan
3. Klikni **"cPanel"** (pod Advanced sekcijom)

### 2.2. Otvori File Manager

1. U cPanelu, pod **"Files"** sekcijom, klikni **"File Manager"**
2. Navigiraj na `public_html/` (ili custom folder za svoju domenu)

### 2.3. Uploadaj ZIP Arhivu

1. Klikni **"Upload"** (gornji desni kut)
2. Odaberi ZIP arhivu projekta
3. Pričekaj da se upload završi (može potrajati 5-10 min za veće projekte)

### 2.4. Ekstraktuj ZIP

1. Vrati se u File Manager
2. Desni klik na ZIP datoteku → **"Extract"**
3. Odaberi destinaciju (npr. `public_html/produktauto/`)
4. Klikni **"Extract File(s)"**
5. Obriši ZIP nakon ekstrakcije

---

## 3️⃣ Postavi Node.js Aplikaciju

### 3.1. Setup Node.js u cPanelu

1. U cPanelu, pod **"Software"** sekcijom, klikni **"Setup Node.js App"**
2. Klikni **"Create Application"**

### 3.2. Konfiguriraj Aplikaciju

Popuni sljedeće:

- **Node.js version**: Odaberi `20.x` (ili najnoviju stabilnu verziju)
- **Application mode**: `Production`
- **Application root**: `produktauto` (ili tvoj folder u public_html)
- **Application URL**: Odaberi svoju domenu (npr. `produktauto.com`)
- **Application startup file**: `node_modules/next/dist/bin/next`
- **Passenger log file**: `logs/passenger.log` (opcionalno)

**Napomena**: Ako `Application startup file` ne prihvaća ovaj path, probaj:

- `server.js` (trebat ćeš kreirati custom server file)

### 3.3. Kreiraj Custom Server (ako je potrebno)

Ako cPanel ne može direktno pokrenuti Next.js, napravi `server.js` u root folderu:

```javascript
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = false; // Production mode
const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
```

Zatim postavi **Application startup file** na `server.js`.

### 3.4. Postavi Environment Variables

1. U **"Setup Node.js App"** ekranu, skrolaj do **"Environment variables"**
2. Dodaj sve varijable iz `.env.production`:

```
NEXT_PUBLIC_SITE_URL = https://produktauto.com
DATABASE_URL = file:./data/app.db
CMS_ADMIN_USERNAME = admin
CMS_ADMIN_PASSWORD = <tvoja-lozinka>
CMS_SESSION_SECRET = <random-string>
CONTACT_EMAIL = produktauto@gmail.com
RESEND_API_KEY = re_xxxxxxx
```

3. Klikni **"Save"** nakon svakog unosa

### 3.5. Instaliraj Dependencies (ako nisu uploadane)

Ako nisi uploadao `node_modules/`:

1. U **"Setup Node.js App"** ekranu, klikni **"Run NPM Install"**
2. Pričekaj da instalacija završi (može trajati 5-10 min)

### 3.6. Pokreni Aplikaciju

1. Klikni **"Restart"** (ili **"Start"** ako nije pokrenuta)
2. Provjeri status - trebao bi biti **"Running"**

---

## 4️⃣ Postavi Domenu i SSL

### 4.1. Poveži Domenu

Ako domena nije automatski povezana:

1. U cPanelu, idi na **"Domains"** → **"Addon Domains"** ili **"Parked Domains"**
2. Dodaj `produktauto.com` i uperi na folder aplikacije
3. Postavi DNS A record na IP adresu tvog hostinga (provjeri u Hostinger hPanelu)

### 4.2. Aktiviraj SSL Certifikat

1. U cPanelu, idi na **"Security"** → **"SSL/TLS Status"**
2. Pronađi `produktauto.com` i klikni **"Run AutoSSL"**
3. Pričekaj da se certifikat generira (obično 5-10 min)

Alternativno, koristi **Let's Encrypt** iz cPanela.

### 4.3. Forsiraj HTTPS

1. U cPanelu, idi na **"Domains"** → **"Domains"**
2. Klikni **"Manage"** pored domene
3. Uključi **"Force HTTPS Redirect"**

---

## 5️⃣ Postavi .htaccess za Next.js (Opcionalno)

Ako imaš problema s rutiranjem, dodaj `.htaccess` u root folder:

```apache
# .htaccess za Next.js na cPanel

# Redirect all HTTP to HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Proxy sve requestove na Node.js aplikaciju
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:PORT/$1 [P,L]

# Zamijeni PORT s portom koji Node.js koristi (provjeri u "Setup Node.js App")
```

**Napomena**: Možda `.htaccess` neće biti potreban ako Passenger već služi aplikaciju.

---

## 6️⃣ Provjera i Testiranje

### 6.1. Otvori Stranicu

1. Idi na `https://produktauto.com`
2. Provjeri da se stranica učitava bez grešaka

### 6.2. Testiraj Funkcionalnosti

- ✅ Učitavanje vozila sa baze
- ✅ CMS login (`/cms/login`)
- ✅ Kontakt forma
- ✅ Pretraživanje vozila
- ✅ Internacionalizacija (hr/en/de)
- ✅ Favoriti i usporedbe

### 6.3. Provjeri Logove

Ako nešto ne radi:

1. U cPanelu, idi na **"Setup Node.js App"**
2. Klikni na svoju aplikaciju
3. Skrolaj do **"Logs"** - klikni **"Open logs"**
4. Provjeri `stderr.log` i `stdout.log` za greške

---

## 7️⃣ Migracija Baze i Upload Slika

### 7.1. Upload Postojeće Baze (SQLite)

Ako već imaš podatke lokalno:

1. U File Manageru, navigiraj na `public_html/produktauto/data/`
2. Uploadaj `app.db` sa lokalnog računala
3. Postavi permissions na `644` (desni klik → Permissions)

### 7.2. Primijeni Prisma Migracije

Ako trebaš pokrenuti migracije na serveru:

1. U cPanelu, otvori **"Terminal"**
2. Navigiraj u folder projekta:
   ```bash
   cd public_html/produktauto
   ```
3. Pokreni migracije:
   ```bash
   npx prisma migrate deploy
   ```

### 7.3. Upload Slika

Sve slike iz `public/uploads/` (iz CMS-a):

1. Zapakiraj `public/uploads/` folder lokalno
2. Uploadaj ZIP u `public_html/produktauto/public/`
3. Ekstraktuj ZIP

---

## 8️⃣ Ažuriranje Projekta (Future Updates)

Kada napraviš izmjene na projektu:

### Opcija A: Potpuni Re-upload

1. Buildaj projekt lokalno (`npm run build`)
2. Zapakiraj samo `.next/` folder
3. Uploadaj i ekstraktuj u `public_html/produktauto/`
4. Restartuj aplikaciju u **"Setup Node.js App"**

### Opcija B: Git Deploy (Napredniji način)

1. Postavi Git repo na serveru preko cPanela (**"Git Version Control"**)
2. Kloniraj svoj GitHub repo
3. Svaki put pull-aj promjene i buildaj:
   ```bash
   git pull origin main
   npm install
   npm run build
   pm2 restart all  # ili restart preko cPanela
   ```

---

## 🛠️ Troubleshooting

### Problem: Aplikacija ne startuje

**Rješenje**:

- Provjeri Node.js verziju (min. 18.17+)
- Provjeri logove (`stderr.log`)
- Provjeri da su svi environment variables postavljeni
- Restartuj aplikaciju

### Problem: 404 na svim rutama

**Rješenje**:

- Provjeri da je `Application URL` ispravno postavljen
- Provjeri da Passenger pravilno forwarda requestove
- Dodaj `.htaccess` pravila

### Problem: Slike se ne učitavaju

**Rješenje**:

- Provjeri permissions na `public/uploads/` (755)
- Provjeri da su slike uploadane na server
- Provjeri `next.config.ts` da su domene dozvoljenе

### Problem: Baza ne radi

**Rješenje**:

- Provjeri `DATABASE_URL` environment variable
- Provjeri da `data/app.db` postoji i ima permissions 644
- Pokreni `npx prisma generate` na serveru

### Problem: CSS/JS ne učitavaju

**Rješenje**:

- Provjeri da je `.next/static/` folder uploadan
- Provjeri `NEXT_PUBLIC_SITE_URL` da pokazuje na pravu domenu
- Očisti cache i refreshaj browser

### Problem: Out of Memory na build

**Rješenje**:

- Buildaj lokalno i uploadaj `.next/` folder
- Kontaktiraj Hostinger support za povećanje memorije

---

## 📝 Bilješke

- **Node.js podrška**: Provjer da tvoj Hostinger plan podržava Node.js (Business ili viši)
- **Port**: cPanel/Passenger automatski dodjeljuje port, ne treba ga ručno postaviti
- **PM2**: Hostinger obično ne koristi PM2, već Phusion Passenger za Node.js aplikacije
- **Performanse**: Za bolje performanse, razmotri VPS umjesto shared hostinga

---

## 🔗 Korisni Linkovi

- [Hostinger Node.js Tutorial](https://support.hostinger.com/en/articles/6318933-how-to-set-up-a-node-js-application)
- [Next.js Deployment Docs](https://nextjs.org/docs/app/building-your-application/deploying)
- [cPanel Documentation](https://docs.cpanel.net/)

---

**Sretno sa deploymentom! 🚀**

Ako imaš problema, provjeri logove ili kontaktiraj Hostinger support.
