# Wholesale Management System

A full-stack wholesale management system with React frontend and Node.js/Express backend.

## Features

- **User Authentication**: JWT-based login system with role support (User/Admin)
- **Products Management**: View product catalog from ERP system
- **Orders Management**: Track orders with status and tracking numbers
- **User Profile**: View and update personal information

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- React Router v6
- Ant Design (UI components)
- Axios (HTTP client)

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- MySQL
- JWT Authentication

## Project Structure

```
wholesale_backaground/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── layouts/         # Layout components
│   │   ├── pages/           # Page components
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   └── profile/
│   │   ├── services/        # API services
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── backend/                  # Express backend
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── src/
│   │   ├── config/          # Configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   │   ├── erp.service.ts  # ERP integration
│   │   │   └── ...
│   │   ├── scripts/         # Utility scripts
│   │   └── index.ts
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:
```
DATABASE_URL="mysql://username:password@localhost:3306/wholesale_db"
JWT_SECRET="your-secret-key"
```

5. Run Prisma migrations:
```bash
npm run prisma:migrate
```

6. Generate Prisma client:
```bash
npm run prisma:generate
```

7. Seed the database with test users:
```bash
npx ts-node src/scripts/seed.ts
```

8. Start the development server:
```bash
npm run dev
```

Backend will run on http://localhost:3001

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on http://localhost:5173

## Test Accounts

After seeding the database, you can use these accounts:

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | admin@wholesale.com | admin123  |
| User  | user@wholesale.com  | user123   |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - Get all products (supports `?sku=` query)
- `GET /api/products/:sku` - Get product by SKU

### Orders
- `GET /api/orders` - Get user's orders (or all orders for admin)

### User Profile
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update user profile

## ERP Integration

The ERP service (`backend/src/services/erp.service.ts`) is pre-configured with mock data. To connect to your actual ERP system:

1. Update the ERP API URL in `.env`:
```
ERP_API_BASE_URL="https://your-erp-api.com"
ERP_API_KEY="your-api-key"
```

2. Modify the functions in `erp.service.ts`:
- `getProductsFromERP()` - Fetch products from ERP
- `getOrdersFromERP(userId)` - Fetch orders for a user

## License

MIT

