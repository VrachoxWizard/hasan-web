# Produkt Auto - Premium Rabljena Vozila

Modern web application for browsing and purchasing premium used vehicles. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Vehicle Search & Filtering** - Advanced search with filters for brand, model, year, price, mileage, and fuel type
- **Vehicle Comparison** - Compare up to 3 vehicles side-by-side
- **Favorites System** - Save favorite vehicles for later viewing
- **Financing Calculator** - Calculate monthly payments with customizable terms
- **Dark/Light Theme** - Full theme support with smooth transitions
- **Responsive Design** - Mobile-first design that works on all devices
- **Image Optimization** - Automatic image optimization with Next.js Image component
- **Contact Forms** - Validated contact and inquiry forms with Zod
- **SEO Optimized** - Dynamic sitemap, robots.txt, and metadata

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, Shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Form Validation**: Zod
- **Testing**: Vitest
- **Icons**: Lucide React

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── favoriti/        # Favorites page
│   ├── kontakt/         # Contact page
│   ├── o-nama/          # About page
│   ├── usporedi/        # Comparison page
│   └── vozila/          # Vehicles listing & detail pages
├── components/          # React components
│   └── ui/             # Shadcn/ui components
├── data/               # Vehicle data (vozila.json)
├── lib/                # Utility functions & schemas
├── stores/             # Zustand stores
└── types/              # TypeScript type definitions
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment to Vercel

This project is optimized for deployment on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Vercel will automatically detect Next.js and configure the build
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/produkt-auto)

### Build Configuration

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Framework Preset**: Next.js

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run unit tests
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:coverage` - Run tests with coverage report

## 🎨 Design Features

- Modern, clean interface with premium feel
- Smooth page transitions and micro-interactions
- Accessible UI components following WCAG guidelines
- Optimized for Core Web Vitals
- Progressive image loading with blur placeholders

## 📄 License

Private - © 2024 Produkt Auto. All rights reserved.

## 🤝 Contact

For inquiries, visit our [contact page](http://localhost:3000/kontakt) or reach out directly.
