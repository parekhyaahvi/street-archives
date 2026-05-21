# VIBRANT

A streetwear e-commerce platform with product catalog, cart, checkout, and user auth.

## Run & Operate

- `artifacts/api-server: API Server` workflow — Express backend on port 8080
- `artifacts/vibrant: web` workflow — Vite static server on port 23614
- Required secrets: `MONGODB_URI`, `JWT_SECRET`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 + Mongoose (MongoDB)
- Frontend: Vanilla HTML/CSS/JS served via Vite static dev server
- Auth: JWT (jsonwebtoken + bcryptjs)
- Build: esbuild (api-server CJS bundle)

## Where things live

- `artifacts/vibrant/` — frontend HTML/CSS/JS app
  - `public/` — all HTML pages, CSS, JS assets
  - `index.html` — root (VIBRANT homepage)
- `artifacts/api-server/src/` — Express backend
  - `models/` — Mongoose models (User, Product, Cart, Order)
  - `routes/` — Express routes (auth, cart, products, orders)
  - `middlewares/auth.ts` — JWT protect + admin middleware
  - `lib/db.ts` — MongoDB connection via Mongoose

## Architecture decisions

- Vanilla HTML/JS frontend served as Vite static files (not React) — the imported app was fully vanilla
- MongoDB/Mongoose for data (not Drizzle/PostgreSQL) — original app used MongoDB Atlas
- JWT tokens stored in localStorage, sent as Bearer headers
- Cart `imageUrl` is optional (not required) — products may lack images

## Product

- Browse and filter a product catalog
- View product detail pages and add items to cart (select size + quantity)
- User registration and login
- Cart management (add, update quantity, remove, clear)
- Checkout with shipping address (mock payment)
- Profile page with order history

## Gotchas

- The `MONGODB_URI` secret must point to a MongoDB Atlas cluster
- Products require an `imageUrl` to display images (can be empty string — won't break cart)
- Cart add-to-bag error was caused by Mongoose validation requiring `imageUrl` on cart items when products had empty imageUrl — fixed by making it optional with `default: ""`
