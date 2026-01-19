# 🚀 Produkt Auto – Deployment na Hostinger (File Manager)

Ovo je **konačni, korak-po-korak vodič** za deploy Next.js stranice na Hostinger putem File Managera.

---

## 📋 Preduvjeti

- Hostinger **Business** plan ili viši (mora podržavati Node.js)
- Domena `produktauto.com` povezana s hostingom
- Lokalno instaliran Node.js 18+ i npm

---

## 1️⃣ LOKALNA PRIPREMA (na tvom računalu)

### 1.1 Otvori terminal u root folderu projekta

```powershell
cd C:\Users\MateVukušić\Desktop\stranica
```

### 1.2 Instaliraj dependencies

```powershell
npm install
```

### 1.3 Generiraj Prisma client

```powershell
npx prisma generate
```

### 1.4 Pokreni production build

```powershell
npm run build
```

⚠️ **Build mora proći bez grešaka!** Ako ima error-a, riješi ih prije nastavka.

### 1.5 Provjeri da postoje ovi folderi/fajlovi

Nakon builda trebaju postojati:

```
✅ .next/                    (generiran buildom)
✅ node_modules/             (dependencies)
✅ public/                   (statički fajlovi)
✅ public/uploads/           (folder za CMS slike)
✅ prisma/                   (schema + migrations)
✅ data/app.db               (SQLite baza s podacima)
✅ server.js                 (custom server za Hostinger)
✅ package.json
✅ package-lock.json
✅ next.config.ts
```

---

## 2️⃣ KREIRAJ .env.production DATOTEKU

Napravi novu datoteku `.env.production` u root folderu s ovim sadržajem:

```env
# Site
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://produktauto.com

# Database (SQLite)
DATABASE_URL=file:./data/app.db

# CMS Authentication
CMS_ADMIN_USERNAME=admin
CMS_ADMIN_PASSWORD=TVOJA_JAKA_LOZINKA_OVDJE
CMS_SESSION_SECRET=DUGACAK_RANDOM_STRING_MIN_64_ZNAKA

# Contact Form
CONTACT_EMAIL=produktauto@gmail.com

# Email Service (Resend)
RESEND_API_KEY=re_TVOJ_API_KEY
```

⚠️ **BITNO**: Zamijeni:

- `TVOJA_JAKA_LOZINKA_OVDJE` → s jakom lozinkom
- `DUGACAK_RANDOM_STRING` → generiraj na https://randomkeygen.com/ (CodeIgniter Encryption Keys)
- `re_TVOJ_API_KEY` → s tvojim Resend API ključem

---

## 3️⃣ ZAPAKIRAJ PROJEKT U ZIP

### Što UKLJUČITI u ZIP:

```
✅ .next/
✅ node_modules/
✅ prisma/
✅ public/
✅ data/                 ← SQLite baza
✅ server.js
✅ package.json
✅ package-lock.json
✅ next.config.ts
✅ .env.production  (PREIMENUJ u .env nakon uploada!)
```

### Što NE UKLJUČIVATI:

```
❌ .git/
❌ src/                (nije potreban, sve je buildirano u .next/)
❌ .env.local          (lokalne env varijable)
❌ __tests__/
❌ docs/
❌ *.md dokumenti
❌ .github/
❌ vitest.config.ts
❌ eslint.config.mjs
❌ tsconfig.json       (nije potreban za runtime)
```

### Kako napraviti ZIP (PowerShell):

```powershell
# Iz root foldera projekta
Compress-Archive -Path ".next", "node_modules", "prisma", "public", "data", "server.js", "package.json", "package-lock.json", "next.config.ts" -DestinationPath "produktauto-deploy.zip" -Force
```

⚠️ Dodaj `.env.production` ručno u ZIP ili ga uploadaj zasebno.

---

## 4️⃣ UPLOAD NA HOSTINGER

### 4.1 Prijavi se u Hostinger hPanel

1. Idi na https://hpanel.hostinger.com/
2. Odaberi svoj hosting plan
3. Klikni **File Manager**

### 4.2 Navigiraj u public_html

```
/home/USERNAME/public_html/
```

### 4.3 Uploadaj ZIP

1. Klikni **Upload** (gore desno)
2. Odaberi `produktauto-deploy.zip`
3. Pričekaj upload (može trajati 5-15 min za ~300MB)

### 4.4 Ekstraktiraj ZIP

1. Desni klik na `produktauto-deploy.zip`
2. Odaberi **Extract**
3. Ekstraktiraj u `public_html/` (ili podfolder ako želiš)

### 4.5 Uploadaj .env.production i preimenuj

1. Uploadaj `.env.production` u isti folder
2. Preimenuj u `.env` (desni klik → Rename)

### 4.6 Obriši ZIP nakon ekstrakcije

Desni klik → Delete na ZIP datoteku (štedi prostor).

---

## 5️⃣ POSTAVI NODE.JS APLIKACIJU

### 5.1 Otvori "Setup Node.js App"

U hPanelu ili cPanelu pronađi **"Setup Node.js App"** ili **"Node.js"**.

### 5.2 Kreiraj novu aplikaciju

Klikni **"Create Application"** i popuni:

| Polje                        | Vrijednost                                         |
| ---------------------------- | -------------------------------------------------- |
| **Node.js version**          | `20.x` (ili najnovija LTS)                         |
| **Application mode**         | `Production`                                       |
| **Application root**         | `public_html` (ili podfolder gdje si ekstraktirao) |
| **Application URL**          | `produktauto.com`                                  |
| **Application startup file** | `server.js`                                        |

### 5.3 Postavi Environment Variables

U istom sučelju, pod **"Environment variables"**, dodaj sve varijable:

```
NODE_ENV = production
NEXT_PUBLIC_SITE_URL = https://produktauto.com
DATABASE_URL = file:./data/app.db
CMS_ADMIN_USERNAME = admin
CMS_ADMIN_PASSWORD = tvoja_lozinka
CMS_SESSION_SECRET = tvoj_64_znaka_secret
CONTACT_EMAIL = produktauto@gmail.com
RESEND_API_KEY = re_xxxxx
```

### 5.4 Pokreni aplikaciju

1. Klikni **"Run NPM Install"** (ako nisi uploadao node_modules)
2. Klikni **"Restart"** ili **"Start"**
3. Status bi trebao biti **"Running"**

---

## 6️⃣ POSTAVI SSL (HTTPS)

### 6.1 U hPanelu

1. Idi na **SSL** ili **Security** → **SSL/TLS**
2. Klikni **Install SSL** za `produktauto.com`
3. Odaberi **Let's Encrypt** (besplatno)
4. Pričekaj generiranje (5-10 min)

### 6.2 Forsiraj HTTPS

1. Idi na **Domains** → **Manage**
2. Uključi **"Force HTTPS"**

---

## 7️⃣ TESTIRAJ STRANICU

### Otvaranje

1. Idi na `https://produktauto.com`
2. Stranica bi se trebala učitati

### Testiraj funkcionalnosti

- ✅ Naslovnica se učitava
- ✅ Lista vozila (`/vozila`)
- ✅ Detalj vozila (`/vozila/xxx`)
- ✅ Ekskluzivna vozila na naslovnici
- ✅ CMS login (`/cms/login`) → ulogiraj se
- ✅ Dodaj/uredi vozilo u CMS-u
- ✅ Kontakt forma (`/kontakt`)
- ✅ Jezik switcher (HR/EN/DE)

### Ako nešto ne radi

1. Provjeri logove u **Setup Node.js App** → **Open logs**
2. Provjeri `.env` varijable
3. Provjeri da baza postoji na `prisma/data/app.db`

---

## 8️⃣ NAKON DEPLOYA – AŽURIRANJE

### Za male promjene (samo kod)

1. Lokalno: `npm run build`
2. Zapakiraj samo `.next/` folder
3. Uploadaj i ekstraktiraj preko postojećeg
4. Restartaj Node.js app

### Za promjene u bazi/CMS-u

Promjene u CMS-u (dodavanje/brisanje vozila) se automatski vide nakon refresha – **bez redeploya**.

### Za velike promjene

Ponovi cijeli proces (koraci 1-5).

---

## 📁 FINALNA STRUKTURA NA SERVERU

```
public_html/
├── .next/
│   ├── cache/
│   ├── server/
│   ├── static/
│   └── ...
├── node_modules/
├── data/
│   └── app.db              ← SQLite baza
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
│   ├── uploads/            ← CMS slike
│   └── logoweb.png
├── server.js               ← Entry point
├── package.json
├── package-lock.json
├── next.config.ts
└── .env                    ← Environment varijable
```

---

## 🛠️ TROUBLESHOOTING

### "Application error" ili 502

- Provjeri Node.js verziju (min. 18.17+)
- Provjeri logove
- Provjeri da `.env` postoji i ima ispravne vrijednosti

### Slike se ne učitavaju

- Provjeri da `public/uploads/` postoji
- Provjeri permissions (755 za folder, 644 za fajlove)

### CMS login ne radi

- Provjeri `CMS_ADMIN_USERNAME` i `CMS_ADMIN_PASSWORD` u env
- Provjeri `CMS_SESSION_SECRET` (mora biti dugačak string)

### Baza ne radi / nema vozila

- Provjeri da `data/app.db` postoji
- Provjeri `DATABASE_URL` environment varijablu

### Kontakt forma ne šalje email

- Provjeri `RESEND_API_KEY`
- Provjeri `CONTACT_EMAIL`
- Provjeri Resend dashboard za greške

---

## ✅ CHECKLIST PRIJE DEPLOYA

- [ ] `npm run build` prolazi bez grešaka
- [ ] `.next/` folder postoji
- [ ] `data/app.db` ima podatke (vozila)
- [ ] `public/uploads/` folder postoji
- [ ] `server.js` postoji
- [ ] `.env.production` ima sve varijable
- [ ] CMS lozinka je JAKA (ne "admin")
- [ ] `CMS_SESSION_SECRET` je dugačak random string
- [ ] Resend API key je ispravan

---

**Sretno s deployom! 🚀**

Za pitanja ili probleme, kontaktiraj Hostinger support.
