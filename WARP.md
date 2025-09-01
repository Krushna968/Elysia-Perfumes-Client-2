# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
- **Start development server**: `npm run dev` (runs on http://localhost:3000, auto-opens browser)
- **Build for production**: `npm run build` (outputs to `dist/` with sourcemaps)
- **Preview production build**: `npm run preview`
- **Run tests**: `npm run test` (using Vitest)

### Deployment
- **Build and deploy to GitHub Pages**: `npm run deploy` (runs predeploy → build → gh-pages)
- **Manual predeploy**: `npm run predeploy` (same as build)

## Architecture Overview

### Technology Stack
- **Frontend Framework**: React 18.3.1 with ES Modules
- **Build Tool**: Vite 6.0.3 (configured for port 3000, auto-open, sourcemaps enabled)
- **Styling**: Tailwind CSS 4.1.12 with PostCSS and Autoprefixer
- **State Management**: Redux Toolkit 2.8.2 with React-Redux
- **Routing**: React Router DOM 7.8.2 with BrowserRouter
- **Animations**: Framer Motion 12.23.12 
- **Icons**: Lucide React
- **Notifications**: React Hot Toast with custom styling

### Application Structure

**Entry Point**: `src/main.jsx` → Redux Provider wrapper → `src/App.jsx`

**Key Architecture Patterns**:
1. **Component-Based Structure**: Clear separation between `components/`, `pages/`, and `store/`
2. **Redux State Management**: Centralized cart and user state with dedicated slices
3. **Route-Based Code Splitting**: Each page is a separate component
4. **Mock Data Pattern**: Centralized product data in `src/mockData.js`

### Directory Structure
```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx       # Navigation and cart toggle
│   ├── Footer.jsx       # Site footer
│   ├── CartSidebar.jsx  # Sliding cart panel
│   ├── ProductCard.jsx  # Product display card
│   ├── PageTransition.jsx # Route transition animations
│   └── AddToCartToast.jsx # Custom toast component
├── pages/               # Route-level components
│   ├── Homepage.jsx     # Landing page with hero and bestsellers
│   ├── ProductsPage.jsx # Product catalog with filtering
│   ├── ProductDetailPage.jsx # Individual product view
│   └── AccountPage.jsx  # User account page
├── store/               # Redux state management
│   ├── store.js         # Store configuration
│   ├── cartSlice.js     # Cart state and actions
│   └── userSlice.js     # User state management
├── mockData.js          # Product data and testimonials
├── App.jsx             # Main app component with routing
└── main.jsx            # Application entry point
```

### State Management (Redux)

**Cart Slice** (`src/store/cartSlice.js`):
- State: `items[]`, `isOpen`, `totalItems`, `totalPrice`
- Actions: `addToCart`, `removeFromCart`, `updateQuantity`, `toggleCart`, `closeCart`
- Handles quantity updates and price calculations automatically

**User Slice** (`src/store/userSlice.js`):
- User authentication and profile state

### Data Layer

**Product Data** (`src/mockData.js`):
- Mock perfume catalog with full product details
- Includes pricing (in Indian Rupees), ratings, categories, descriptions
- Images use Unsplash with consistent sizing (400x500 thumbnails, 600x700 detail views)
- Product categories: "Daily Wear", "Evening Wear", "Unisex", "Men", "Women"

### UI/UX Patterns

**Design System**:
- **Color Scheme**: Dark theme with amber/orange accents
- **Currency**: Indian Rupees (₹) with proper number formatting
- **Images**: Reliable Unsplash placeholders with consistent aspect ratios
- **Animations**: Framer Motion for page transitions and micro-interactions

**Toast Notifications**:
- Positioned top-right with custom white styling
- 3-second duration with success/error states
- Integrated "View Cart" buttons in cart-related toasts

### Routing Structure
- `/` - Homepage with hero section and bestsellers
- `/products` - Product catalog with category filtering via query params
- `/products?category=For+Him` - Men's fragrances
- `/products?category=For+Her` - Women's fragrances  
- `/products?category=Unisex` - Unisex fragrances
- `/product/:id` - Individual product detail pages
- `/account` - User account management

## Development Notes

### Build Configuration
- **Vite Config**: Custom port 3000, auto-open browser, sourcemap generation enabled
- **Tailwind Config**: Scans all JSX files in `src/`, minimal custom configuration
- **PostCSS**: Uses Tailwind's PostCSS plugin with Autoprefixer

### Code Patterns
- **Component Naming**: PascalCase for components, kebab-case for assets
- **Import Style**: ES6 modules throughout, `.jsx` extensions explicit
- **State Updates**: Immutable updates via Redux Toolkit (Immer under the hood)
- **Error Handling**: React Hot Toast for user-facing notifications

### Deployment Target
- **Platform**: GitHub Pages via `gh-pages` package
- **Homepage**: https://Krushna968.github.io/Elysia-Perfumes-Client-2
- **Build Output**: Static files in `dist/` directory

### Testing
- **Framework**: Vitest (configured but no tests currently implemented)
- **Command**: `npm run test` for running tests
- **Recommendation**: Add component tests for cart functionality and routing
