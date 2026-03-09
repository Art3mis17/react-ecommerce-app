# CartCrazy

A full-featured e-commerce SPA built with **React 19 + TypeScript + Vite**. Powered by the [DummyJSON API](https://dummyjson.com).

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19, TypeScript |
| Build | Vite |
| Routing | React Router v6 |
| HTTP | Axios |
| Forms | React Hook Form |
| Styling | CSS custom properties + utility classes (no external UI library) |
| State | `useContext` + `useReducer` (cart), `useState` (local UI) |

---

## Features

- **Product catalog** — browse all products with category filtering and full-text search
- **Product detail** — images, rating, discount badge, availability status, brand, and customer reviews
- **Shopping cart** — add / remove / increment / decrement items, order summary, checkout simulation
- **Admin panel** — create, edit, and delete products (admin role only)
- **Authentication** — hardcoded admin login + DummyJSON customer login (any valid DummyJSON account)
- **Route guards** — `ProtectedRoute` (auth) and `AdminRoute` (role) components
- **Persistent sessions** — logged-in user stored in `localStorage`
- **Edit persistence** — admin edits saved to `localStorage` override layer (compensates for DummyJSON's simulated writes)

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type-check without emitting
npx tsc --noEmit

# Build for production
npm run build
```

---

## Demo Credentials

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin` |
| Customer | any [DummyJSON user](https://dummyjson.com/docs/users) e.g. `emilys` | `emilyspass` |

---

## Project Structure

```
src/
├── main.tsx                 # App bootstrap & provider tree
├── App.tsx                  # Route definitions
├── index.css                # Design tokens & global styles
├── contexts/
│   ├── AuthContext.tsx      # Auth state (login, logout, role)
│   └── CartContext.tsx      # Cart state via useReducer
├── hooks/
│   ├── useProduct.ts        # Fetch single product by id
│   └── useProducts.ts       # Fetch catalog with search & category filter
├── services/
│   └── productService.ts    # All Axios calls to DummyJSON Products API
├── models/
│   └── types.ts             # Shared TypeScript interfaces
├── components/shared/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── LoadingSpinner.tsx
│   ├── ProtectedRoute.tsx
│   └── AdminRoute.tsx
└── pages/
    ├── LoginPage.tsx
    ├── NotFoundPage.tsx
    ├── cart/CartPage.tsx
    └── products/
        ├── ProductsPage.tsx
        ├── ProductDetailPage.tsx
        └── ProductFormPage.tsx
```

---

## API Reference

All product data comes from **[DummyJSON](https://dummyjson.com/docs/products)** (`https://dummyjson.com/products`).

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/products?limit=0` | Full product catalog |
| GET | `/products/search?q=` | Full-text search |
| GET | `/products/:id` | Single product |
| GET | `/products/category-list` | Category slug list |
| GET | `/products/category/:slug` | Products by category |
| POST | `/products/add` | Create product (simulated) |
| PATCH | `/products/:id` | Update product (simulated) |
| DELETE | `/products/:id` | Delete product (simulated) |
| POST | `/auth/login` | Customer authentication |

> Write operations (POST/PATCH/DELETE) are simulated by DummyJSON — responses are valid but changes are not persisted server-side. The app uses a `localStorage` override layer to keep admin edits visible across navigation.

---
 