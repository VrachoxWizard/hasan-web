# Produkt Auto Color System

A premium, sophisticated color system designed to communicate **savings and trust** without looking like a discount shop.

---

## Color Philosophy

| Color                                 | Purpose                             | Psychology                                                              |
| ------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| **Teal-Green** (`--savings`)          | Discounted prices, savings amounts  | Smart money, growth, prosperity—sophisticated alternative to neon green |
| **Bronze/Copper** (`--savings-label`) | "Ušteda" labels, savings indicators | Warm, trustworthy, premium—like a bank seal                             |
| **Deep Navy** (`--primary`)           | Headers, text, dark sections        | Authority, stability, professionalism                                   |
| **Sapphire Blue** (`--accent`)        | CTAs, interactive elements          | Trust, action, reliability                                              |
| **Gold** (`--premium`)                | Exclusive/premium badges            | Luxury, exclusivity, high value                                         |
| **Green** (`--success`)               | Form success, feature checkmarks    | Positive confirmation, completion                                       |

---

## Semantic Color Tokens

### Savings Colors (NEW)

Use these for anything related to **discounts, price reductions, or financial benefits**:

```css
/* CSS Variables */
--savings: oklch(0.52 0.12 168); /* Teal-green for prices */
--savings-foreground: oklch(0.98 0 0); /* White text on savings bg */
--savings-label: oklch(0.58 0.11 55); /* Bronze for "Ušteda" label */
--savings-muted: oklch(0.95 0.03 168); /* Subtle badge background */
```

```tsx
/* Tailwind Classes */
text - savings; // Discounted price text
text - savings - label; // "Ušteda:" label text
bg - savings - muted; // Badge/pill background
border - savings / 20; // Subtle border
shadow - savings / 10; // Soft shadow tint
```

### When to Use `--savings` vs `--success`

| Scenario                 | Use                                   |
| ------------------------ | ------------------------------------- |
| Discounted price display | `text-savings`                        |
| "Ušteda: 1.500 €" text   | `text-savings` + `text-savings-label` |
| Price drop badge         | `bg-savings-muted`, `text-savings`    |
| Form submission success  | `text-success`, `bg-success/10`       |
| Feature checkmarks (✓)   | `text-success`                        |
| Positive feedback toast  | `text-success`                        |

**Rule of thumb**: Savings = money/financial. Success = action completed.

---

## Design Tokens (TypeScript)

Import from `@/lib/designTokens`:

```tsx
import { savings, badges } from "@/lib/designTokens";

// Savings price display
<span className={savings.price.card}>19.990 €</span>
<span className={savings.price.list}>19.990 €</span>

// Old price (strikethrough)
<span className={savings.oldPrice.card}>24.990 €</span>

// Savings label and amount
<span className={savings.label}>Ušteda:</span>
<span className={savings.amount}>5.000 €</span>

// Badge styling
<div className={savings.badge.container}>...</div>

// Icons
<TrendingDown className={savings.icon.default} />
<div className={savings.icon.background}>...</div>
```

### Badge Tokens

```tsx
import { badges } from "@/lib/designTokens";

// Exclusive vehicles (gold gradient)
<Badge className={badges.ekskluzivno}>Ekskluzivno</Badge>

// Featured vehicles (accent blue)
<Badge className={badges.istaknuto}>Istaknuto</Badge>

// Savings badge
<Badge className={badges.savings}>Ušteda 1.500 €</Badge>
```

---

## Component Patterns

### Price with Discount

```tsx
import PriceDisplay from "@/components/PriceDisplay";

// Automatically uses savings tokens when oldPrice > price
<PriceDisplay
  price={19990}
  oldPrice={24990}
  variant="card" // or "list" | "detail"
/>;
```

### Price Drop Badge

```tsx
import PriceDropBadge from "@/components/PriceDropBadge";

// Shows only when discount ≥ 5%
<PriceDropBadge originalPrice={24990} currentPrice={19990} />;
```

### Manual Savings Display

```tsx
import { savings } from "@/lib/designTokens";

<div className="flex flex-col">
  <span className={`text-lg ${savings.oldPrice.list}`}>24.990 €</span>
  <span className={`text-2xl ${savings.price.list}`}>19.990 €</span>
  <span className="text-sm">
    <span className={savings.label}>Ušteda: </span>
    <span className={savings.amount}>5.000 €</span>
  </span>
</div>;
```

---

## Color Values Reference

### Light Mode

| Token             | OKLCH                  | Hex (approx) | Preview       |
| ----------------- | ---------------------- | ------------ | ------------- |
| `--savings`       | `oklch(0.52 0.12 168)` | `#2a9d8f`    | 🟢 Teal       |
| `--savings-label` | `oklch(0.58 0.11 55)`  | `#b08968`    | 🟤 Bronze     |
| `--savings-muted` | `oklch(0.95 0.03 168)` | `#e8f5f3`    | ⬜ Light teal |
| `--success`       | `oklch(0.55 0.16 150)` | `#38a169`    | 🟢 Green      |
| `--premium`       | `oklch(0.65 0.15 60)`  | `#d4a574`    | 🟡 Gold       |
| `--accent`        | `oklch(0.45 0.19 250)` | `#2563eb`    | 🔵 Sapphire   |

### Dark Mode

| Token             | OKLCH                  | Adjustment              |
| ----------------- | ---------------------- | ----------------------- |
| `--savings`       | `oklch(0.62 0.14 168)` | Brighter for visibility |
| `--savings-label` | `oklch(0.68 0.12 55)`  | Brighter bronze         |
| `--savings-muted` | `oklch(0.25 0.04 168)` | Dark teal background    |

---

## Do's and Don'ts

### ✅ Do

- Use `text-savings` for discounted prices
- Use `text-savings-label` for "Ušteda" labels
- Use `bg-savings-muted` for badge backgrounds
- Use `text-success` for feature checkmarks
- Use `badges.ekskluzivno` for exclusive vehicle badges
- Keep contrast ratios WCAG AA compliant

### ❌ Don't

- Use `text-green-500` or `text-green-600` (hardcoded)
- Use `text-orange-500` for savings labels (hardcoded)
- Use `from-amber-500 to-orange-500` for exclusive badges
- Mix savings colors with success colors
- Use overly saturated "discount shop" greens

---

## Migration Checklist

When adding new components that display savings/discounts:

1. Import tokens: `import { savings, badges } from "@/lib/designTokens";`
2. Use `PriceDisplay` component when possible
3. Use `PriceDropBadge` for discount indicators
4. Use `savings.*` tokens for custom implementations
5. Test in both light and dark modes

---

## Accessibility

All savings colors meet WCAG AA contrast requirements:

- `--savings` on white: 4.5:1+
- `--savings-label` on white: 4.5:1+
- White on `--savings`: 4.5:1+

Dark mode variants are adjusted for visibility while maintaining harmony.
