# Setup: Resend (Email) + Deploy

Ovaj dokument opisuje kako podesiti **Resend** za slanje e-mailova iz kontakt forme i kako deployati projekt na hosting.

## 0) Preduvjeti

- Node.js LTS (20+)
- Projekt je pokrenut (Next.js 16 App Router)
- Pristup DNS postavkama domene (za produkcijsku Resend domenu - opcionalno ali preporučeno)
- Hosting account (Vercel, Netlify, VPS, ili bilo koji Node.js hosting)

---

## 1) CMS — lokalni setup

Projekt koristi **custom CMS** sa Prisma + SQLite (ne Sanity).

### 1.1 Baza podataka

Baza se automatski kreira pri prvom pokretanju. SQLite datoteka je u `prisma/data/app.db`.

```bash
# Generiraj Prisma klijenta (ako nije već)
npx prisma generate

# Pokreni migracije (kreiraj tablice)
npx prisma migrate dev

# Opciono: otvori Prisma Studio za pregled podataka
npx prisma studio
```

### 1.2 Postavi CMS env varijable

U `.env.local` dodaj:

```bash
# CMS Admin pristup
CMS_ADMIN_USERNAME="admin"
CMS_ADMIN_PASSWORD="sigurna-lozinka-123"
CMS_SESSION_SECRET="dugi-random-string-za-sesije-minimum-32-znaka"

# Database (SQLite)
DATABASE_URL="file:./prisma/data/app.db"

# Site URL (važno za emails i sitemap)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

**Napomena**:

- `.env.local` se ne commita (već je u `.gitignore`)
- `.env.example` sadrži ključeve bez tajnih vrijednosti za reference

### 1.3 Pristupi CMS-u

CMS je dostupan na:

- **Login**: `http://localhost:3000/cms/login`
- **Dashboard**: `http://localhost:3000/cms` (nakon logina)

Koristi `CMS_ADMIN_USERNAME` i `CMS_ADMIN_PASSWORD` iz env varijabli.

### 1.4 Uvoz postojećih vozila (opcionalno)

Ako imaš postojeće podatke u `src/data/vozila.json`, možeš ih uvesti u bazu:

```bash
node scripts/import-vozila-json-to-db.js
```

Skripta mapira JSON podatke u Prisma modele i sprema ih u bazu.

---

## 2) Resend — slanje e-mailova iz kontakt forme

Projekt ima API rutu `/api/contact` koja prima podatke iz kontakt forme i šalje e-mail putem Resenda.

### 2.1 Kreiraj Resend account + API key

1. Otvori: https://resend.com i kreiraj account
2. U Resend dashboardu idi na **API Keys**
3. Kreiraj novi API key i kopiraj ga

4. U `.env.local` dodaj:

```bash
RESEND_API_KEY="re_tvoj_api_key_ovdje"
CONTACT_EMAIL="produktauto@gmail.com"
RESEND_FROM="Produkt Auto <onboarding@resend.dev>"
```

- `RESEND_API_KEY` je API ključ iz Resend dashboarda
- `CONTACT_EMAIL` je adresa na koju stižu poruke s kontakt forme

### 2.2 Test (lokalno)

1. Pokreni dev server:

   ```bash
   npm run dev
   ```

2. Otvori stranicu `/kontakt` ili `/en/contact` ili `/de/kontakt`

3. Popuni formu i pošalji test poruku

4. Provjeri da je e-mail stigao na `CONTACT_EMAIL`

**Napomena**:

- Ako `RESEND_API_KEY` nije postavljen, API ruta će vratiti grešku
- U development modu, Resend ima limit od 100 e-mailova/dan na trial planu

### 2.3 (Produkcija - preporučeno) Verificiraj domenu

Za pouzdanije slanje i da e-mailovi ne završavaju u spam-u:

1. U Resend dashboardu idi na **Domains**
2. Klikni **Add Domain** i unesi svoju domenu (npr. `produktauto.com`)
3. Resend će dati DNS zapise koje trebaš dodati (SPF, DKIM, DMARC)
4. Dodaj te DNS zapise u postavke domene (kod registrara ili DNS providera):

   **Primjer DNS zapisa** (točne vrijednosti će biti u Resendu):

   ```
   TXT @ "v=spf1 include:spf.resend.com ~all"
   CNAME resend._domainkey.produktauto.com resend._domainkey.u12345678.wl.sendgrid.net
   TXT _dmarc "v=DMARC1; p=none; rua=mailto:dmarc@produktauto.com"
   ```

5. Pričekaj da DNS zapisi propagiraju (može trajati 24-48h)
6. U Resendu klikni **Verify** - status će biti **Verified**

Nakon verifikacije:

- Možeš koristiti vlastitu domenu u "From" adresi (npr. `info@produktauto.com`)
- E-mailovi će biti pouzdaniji i rijetko završavati u spam-u

### 2.4 Ažuriraj From adresu (opciono)

Ako si verificirao domenu, ažuriraj kod u `src/app/api/contact/route.ts`:

```typescript
from: "info@produktauto.com", // Koristi verificiranu domenu
```

Ili (preporučeno), postavi `RESEND_FROM` u env varijable (lokalno i na Vercelu), bez izmjene koda:

```bash
RESEND_FROM="Produkt Auto <info@produktauto.com>"
```

---

## 3) Deploy na Hosting

### 3.1 Vercel (preporučeno za Next.js)

Vercel je najjednostavnija opcija za Next.js projekte:

1. **Kreiraj account**: https://vercel.com
2. **Import projekt**:

   - Klikni **Add New Project**
   - Konektiraj GitHub/GitLab/Bitbucket
   - Odaberi svoj repo

3. **Postavi env varijable**:
   U Vercel dashboardu → **Settings** → **Environment Variables**:

   ```bash
   # Database
   DATABASE_URL=file:./prisma/data/app.db

   # CMS
   CMS_ADMIN_USERNAME=admin
   CMS_ADMIN_PASSWORD=tvoja-jaka-lozinka
   CMS_SESSION_SECRET=dugi-random-string-32-znaka-ili-vise

   # Email
   RESEND_API_KEY=re_tvoj_api_key
   CONTACT_EMAIL=produktauto@gmail.com

   # Site
   NEXT_PUBLIC_SITE_URL=https://produktauto.com
   ```

4. **Deploy**: Vercel automatski deploya svaki push na main branch

5. **Testiranje**:
   - Posjeti: `https://tvoj-projekt.vercel.app/cms/login`
   - Testiraj kontakt formu na `/kontakt`

**Napomena o SQLite na Vercelu**:

- SQLite na Vercelu je **read-only** nakon deploya
- Za produkciju preporučuje se **Vercel Postgres** ili **Neon** (besplatni planovi dostupni)
- Alternativno, hostaj na VPS-u gdje SQLite ima write pristup

### 3.2 Netlify

1. **Kreiraj account**: https://netlify.com
2. **Import projekt** iz Git repozitorija
3. **Build settings**:

   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: `netlify/functions` (ako koristiš)

4. **Env varijable**: Site settings → Environment Variables (iste kao za Vercel)

5. **Deploy**: Netlify automatski deploya svaki push

**Napomena**: Netlify također ima ograničenja sa SQLite. Razmotriti serverless bazu.

### 3.3 VPS (Hostinger, DigitalOcean, Hetzner)

Za punu kontrolu i SQLite write pristup:

#### 3.3.1 Pripremi server

1. **SSH pristup**:

   ```bash
   ssh root@tvoj-server-ip
   ```

2. **Instaliraj Node.js**:

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt-get install -y nodejs
   ```

3. **Instaliraj PM2** (process manager):
   ```bash
   npm install -g pm2
   ```

#### 3.3.2 Deploy projekt

1. **Kloniraj repo**:

   ```bash
   cd /var/www
   git clone https://github.com/tvoj-username/tvoj-repo.git produktauto
   cd produktauto
   ```

2. **Instaliraj dependencies**:

   ```bash
   npm install
   ```

3. **Kreiraj `.env.local`**:

   ```bash
   nano .env.local
   ```

   Dodaj sve env varijable (kao gore)

4. **Generiraj Prisma klijenta**:

   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

5. **Build projekt**:

   ```bash
   npm run build
   ```

6. **Pokreni s PM2**:
   ```bash
   pm2 start npm --name "produktauto" -- start
   pm2 save
   pm2 startup
   ```

#### 3.3.3 Nginx reverse proxy

1. **Instaliraj Nginx**:

   ```bash
   apt-get install nginx
   ```

2. **Konfiguriraj site**:

   ```bash
   nano /etc/nginx/sites-available/produktauto
   ```

   ```nginx
   server {
       listen 80;
      server_name produktauto.com www.produktauto.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Aktiviraj site**:

   ```bash
   ln -s /etc/nginx/sites-available/produktauto /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

4. **SSL certifikat** (Let's Encrypt):
   ```bash
   apt-get install certbot python3-certbot-nginx
   certbot --nginx -d produktauto.com -d www.produktauto.com
   ```

### 3.4 Update poslije promjena

**Vercel/Netlify**: Automatski s git push

**VPS**:

```bash
cd /var/www/produktauto
git pull
npm install
npm run build
pm2 restart produktauto
```

---

## 4) Post-deploy checklist

Nakon deploya, provjeri:

- ✅ CMS login radi: `https://tvoja-domena.hr/cms/login`
- ✅ CMS dashboard: dodaj/uredi/izbriši test vozilo
- ✅ Kontakt forma šalje e-mail
- ✅ Slike iz CMS-a se prikazuju (check `/uploads` folder)
- ✅ Sitemap: `https://tvoja-domena.hr/sitemap.xml`
- ✅ Robots.txt: `https://tvoja-domena.hr/robots.txt`
- ✅ Sve 3 locale rade: `/` (hr), `/en`, `/de`
- ✅ SSL certifikat aktivan (HTTPS)

---

## 5) Backup baze podataka

**SQLite backup** (na VPS-u):

```bash
# Backup
sqlite3 prisma/data/app.db ".backup backup.db"

# Ili kopiraj file
cp prisma/data/app.db backups/app-$(date +%Y%m%d).db

# Automatski backup (cron)
crontab -e
# Dodaj liniju:
0 2 * * * cp /var/www/produktauto/prisma/data/app.db /var/backups/produktauto-$(date +\%Y\%m\%d).db
```

**Preporuka**: Postavi automatski backup na cloud storage (S3, Backblaze, Google Drive)

---

## 6) Troubleshooting

### CMS se ne otvara ili baca grešku

- Provjeri env varijable: `CMS_ADMIN_USERNAME`, `CMS_ADMIN_PASSWORD`, `CMS_SESSION_SECRET`
- Provjeri `DATABASE_URL` - mora biti valid path
- Provjeri database file postoji: `prisma/data/app.db`
- Pokreni migracije: `npx prisma migrate deploy`

### Kontakt forma ne šalje e-mail

- Provjeri `RESEND_API_KEY` - mora početi s `re_`
- Provjeri `CONTACT_EMAIL` - mora biti valid email
- Provjeri Resend dashboard logs (https://resend.com/logs)
- Provjeri browser konzolu za greške
- Provjeri server logs (Vercel: funkcije, VPS: `pm2 logs`)

### Slike se ne učitavaju

- Provjeri `/public/uploads` folder postoji i ima write permission (VPS)
- Provjeri `next.config.ts` - `remotePatterns` za domenu
- Na Vercelu, razmotri korištenje Cloudinary ili Uploadcare za slike

### 500 error na deployanom site-u

- Provjeri server logs
- Provjeri sve env varijable su postavljene
- Provjeri build je uspješan: `npm run build` lokalno
- Provjeri `DATABASE_URL` path je dostupan

### SQLite "database is locked" greška

- Provjeri da samo jedan proces koristi bazu
- Restart PM2: `pm2 restart all`
- Razmotriti migraciju na PostgreSQL za višekorisničke scenarije

---

## 7) Alternativa: Migracija na PostgreSQL

Za skalabilniju produkcijsku bazu (umjesto SQLite):

1. **Kreiraj Postgres bazu** (Vercel Postgres, Neon, Supabase...)
2. **Ažuriraj schema** u `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. **Ažuriraj env**:
   ```bash
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   ```
4. **Migracije**:
   ```bash
   npx prisma migrate dev
   ```

---

**Sretno s deployom! 🚀**
