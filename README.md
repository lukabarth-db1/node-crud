# First CRUD — Node.js + MongoDB

A simple CRUD API built with Node.js, Express, and MongoDB, developed for learning purposes.

## Tech Stack

- **Node.js** with **TypeScript**
- **Express** — HTTP framework
- **MongoDB** with **Mongoose** — database and ODM
- **Zod** — input validation
- **dotenv** — environment variables
- **@faker-js/faker** — fake data generation (dev)

## Project Structure

```
src/
├── config/         # Database connection
├── controllers/    # HTTP request handlers
├── dtos/           # Data Transfer Objects
├── middlewares/    # Error handling and validation
├── models/         # Mongoose schemas
├── repositories/   # Database access layer
├── routes/         # Route definitions
├── seeds/          # Database seed scripts
├── services/       # Business logic
└── validators/     # Zod validation schemas
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- MongoDB Atlas account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Copy the environment file and fill in your values:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```

## Environment Variables

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<appname>
PORT=3000
OPEN_EXCHANGE_RATES_APP_ID=your_app_id_here
```

> Get a free App ID at [openexchangerates.org](https://openexchangerates.org/signup/free).

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/products` | List all products |
| `GET` | `/products/:id` | Get product by ID |
| `GET` | `/products/:id/price?currency=EUR` | Get product price in a given currency |
| `POST` | `/products` | Create a product |
| `PUT` | `/products/:id` | Update a product |
| `DELETE` | `/products/:id` | Delete a product |

### Currency conversion — GET `/products/:id/price`

Returns the product price converted to any currency supported by Open Exchange Rates (base: USD).  
Exchange rates are cached in memory for **5 minutes** to stay within the free plan limits.

```http
GET /products/64f1a2b3c4d5e6f7a8b9c0d1/price?currency=BRL
```

```json
{
  "productId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Awesome Notebook",
  "originalPrice": 100,
  "currency": "BRL",
  "convertedPrice": 520.50
}
```

### Request body — POST `/products`

```json
{
  "name": "Notebook",
  "description": "Gaming notebook 16GB RAM",
  "price": 4500
}
```

### Request body — PUT `/products/:id`

All fields are optional.

```json
{
  "price": 4000
}
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start with hot reload |
| `pnpm build` | Compile TypeScript |
| `pnpm start` | Run compiled build |
| `pnpm seed` | Clear and repopulate DB with 20 fake products |

## Seeding

To populate the database with fake product data for testing:

```bash
pnpm seed
```

This will clear all existing products and insert 20 randomly generated products using `@faker-js/faker`. You can adjust the count by changing `SEED_COUNT` in `src/seeds/seed.ts`.
