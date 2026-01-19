# Hostinger – Purge/Clear Cache (korak po korak)

Ovaj dokument služi da nakon izmjena (posebno u CMS-u ili slikama) ručno očistiš cache kako bi se promjene odmah vidjele na domeni `produktauto.com`.

> Napomena: U ovoj aplikaciji smo već postavili da se vozila i ekskluzivna vozila ne cache-aju na razini Next.js-a (`revalidate = 0` i API `no-store`). Ako i dalje vidiš “staro”, problem je gotovo uvijek CDN/Hostinger cache ili Cloudflare cache.

---

## 1) Brzi test prije purge-a (najčešći “lažni alarm”)

1. Otvori stranicu u Incognito/Private prozoru.
2. Hard refresh:
   - Windows/Chrome/Edge: `Ctrl + F5`
   - macOS/Safari: `Cmd + Shift + R`

Ako se promjene vide u Incognito, onda je problem samo u cache-u browsera.

---

## 2) Purge cache u Hostinger hPanelu (Hostinger CDN)

Ovo vrijedi ako koristiš Hostinger-ov CDN (ili opciju “CDN” u hPanelu).

1. Ulogiraj se u Hostinger hPanel.
2. Otvori **Websites**.
3. Nađi svoju domenu/website (`produktauto.com`) i klikni **Manage**.
4. U lijevom meniju pronađi **CDN** (nekad je pod “Performance” ili “Advanced”).
5. Klikni **Clear cache / Purge cache**.
6. Pričekaj 1–5 minuta i refreshaj stranicu (Incognito + `Ctrl+F5`).

Ako ne vidiš “CDN” u hPanelu, vrlo vjerojatno ne koristiš Hostinger CDN (preskoči na sljedeći korak).

---

## 3) Purge cache ako koristiš Cloudflare

Ako je DNS na Cloudflare-u (ili je Hostinger povezan s Cloudflare-om), napravi purge ovako:

1. Ulogiraj se u Cloudflare.
2. Odaberi zonu `produktauto.com`.
3. Idi na **Caching** → **Configuration**.
4. Klikni **Purge Everything**.
   - Alternativa (preporučeno ako želiš ciljano): **Custom Purge** i unesi URL-ove koje želiš očistiti.

Tipični URL-ovi koje ima smisla “custom purge” očistiti:

- `https://produktauto.com/`
- `https://produktauto.com/vozila`
- `https://produktauto.com/api/vehicles`

> Napomena: Ako je uključeno agresivno cache-anje HTML-a u Cloudflare-u (Cache Rules/Page Rules), možda će trebati prilagoditi pravila, jer Next.js stranice bi se trebale renderirati svježe.

---

## 4) Cache na razini hostinga (cPanel / LiteSpeed) – ako postoji

Na nekim shared hosting planovima cache može biti LiteSpeed/LSCache. To je najčešće za WordPress, ali može postojati i globalni cache.

1. Otvori cPanel.
2. Potraži stavke tipa:
   - **LiteSpeed Web Cache Manager**
   - **Cache Manager**
3. Ako postoji opcija **Flush/Purge All**, klikni je.

Ako nema takvih opcija, preskoči ovaj korak.

---

## 5) Restart Node.js aplikacije (nije purge CDN-a, ali pomaže)

Ovo pomaže ako sumnjaš na proces koji je “zapeo”, ali NE briše CDN cache.

1. U cPanelu otvori **Setup Node.js App**.
2. Odaberi aplikaciju.
3. Klikni **Restart**.
4. Pričekaj 10–30 sekundi i testiraj stranicu.

---

## 6) Purge nakon promjena slika (uploads)

Ako mijenjaš slike u `public/uploads` (CMS upload) i vidiš stare slike:

1. Purge CDN cache (korak 2 ili 3).
2. U browseru otvoriti direktan URL slike i napraviti `Ctrl+F5`.
3. Ako se koristi isti filename (npr. `uploads/auto.jpg`), cache će se često držati duže.

Preporuka:

- Za zamjenu slike koristi novi filename (npr. `auto-2025-12-21.jpg`) ili obavezno radi purge.

---

## 7) Ako se i dalje prikazuje staro

Najbrži način da dijagnosticiraš gdje je cache:

1. Otvori DevTools → Network.
2. Klikni request na `https://produktauto.com/api/vehicles?...`.
3. Provjeri Response headers:
   - Trebao bi vidjeti `Cache-Control: no-store`.

Ako API vraća svježe podatke, a UI prikazuje staro:

- Najčešće je cache HTML-a na CDN-u (Cloudflare rules / Hostinger CDN).

---

## Sažetak (najčešći scenario)

- Ako promjena iz CMS-a nije vidljiva: **Purge CDN cache** (Hostinger CDN ili Cloudflare) + refresh u Incognito.
- “Vozila” i “Ekskluzivna vozila” su podešena da budu live bez Next.js cache-a.
