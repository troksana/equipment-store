# Equipment Store / Order Management System

A web application for managing employee equipment orders.

## Features

* Create equipment orders
* Edit orders in DRAFT status
* View order details
* Order status management (DRAFT, APPROVED, CANCELLED)
* Admin panel for order approval
* Order validation rules
* Multilingual interface (English / Polish)
* PostgreSQL database with Prisma ORM

## Technology Stack

* Next.js 15
* React
* TypeScript
* Prisma ORM
* PostgreSQL (Neon)
* Tailwind CSS

## Installation

### 1. Clone repository

```bash
git clone <repository-url>
cd equipment-store
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create `.env` file in the project root:

```env
DATABASE_URL="your_database_url"
```

### 4. Run database migrations

```bash
npx prisma migrate deploy
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Start development server

```bash
npm run dev
```

Application will be available at:

```text
http://localhost:3000
```

## Database

The application uses PostgreSQL.

A free Neon database can be created at:

https://neon.tech

## Business Rules

* Order must contain at least one item
* Duplicate products are not allowed
* Quantity per item: 1–20
* Total quantity per order: max 20
* Orders above 5000 PLN require HIGH priority
* Only DRAFT orders can be edited

## Project Structure

```text
app/
 ├─ admin/
 ├─ api/
 ├─ orders/
 └─ context/

prisma/
 ├─ schema.prisma
 └─ migrations/
```

## 🌱 Database Seed

This project includes a ready-to-use database seed script that populates the system with realistic demo data.

The seed creates:

- 6 equipment items (laptops, desktop, peripherals)
- 3 sample orders covering all statuses:
  - APPROVED order (sales department)
  - CANCELLED order (administrative department)
  - DRAFT order (management)

This allows reviewers to immediately explore all application features without manual data entry.

---

### ▶️ Run seed

```bash
npx prisma db seed


## Author

Roksana Tenczyńska

Created as a project demonstrating:

* Next.js
* TypeScript
* REST API development
* Prisma ORM
* PostgreSQL
* React state management
* Internationalization (i18n)
