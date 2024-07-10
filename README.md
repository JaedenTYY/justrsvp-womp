This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
## Initial Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/nathangtg/justrsvp-api.git
    cd justrsvp-api
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up PostgreSQL database**:

    Ensure you have PostgreSQL installed and running. Create a new database for the project.

4. **Configure environment variables**:

    Create a `.env` file in the project root and add your database connection string:

    ```env
    DATABASE_URL=postgresql://username:password@localhost:5432/your-database
    ```

5. **Initialize Prisma**:

    ```bash
    npx prisma init
    ```

6. **Update `prisma/schema.prisma`**:

    ```prisma
    generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }

    model Category {
      id   Int     @id @default(autoincrement())
      name String
      events Event[]
    }

    model User {
      id        Int     @id @default(autoincrement())
      clerkId   String
      email     String  @unique
      username  String  @unique
      firstName String?
      lastName  String?
      photo     String?
      events    Event[]
      orders    Order[]
    }

    model Event {
      id          Int      @id @default(autoincrement())
      title       String
      description String?
      location    String?
      imageUrl    String?
      startDate   DateTime @default(now())
      endDate     DateTime @default(now())
      price       String?
      isFree      Boolean
      url         String?
      categoryId  Int
      organizerId Int
      category    Category @relation(fields: [categoryId], references: [id])
      organizer   User     @relation(fields: [organizerId], references: [id])
      orders      Order[]
    }

    model Order {
      id         Int      @id @default(autoincrement())
      createdAt  DateTime @default(now())
      stripeId   String?
      totalAmount String?
      eventId    Int
      buyerId    Int
      event      Event @relation(fields: [eventId], references: [id])
      buyer      User  @relation(fields: [buyerId], references: [id])
    }
    ```

7. **Generate Prisma client**:

    ```bash
    npx prisma generate
    ```

8. **Migrate the database**:

    ```bash
    npx prisma migrate dev --name init
    ```

## API Routes

### Users

- **GET /api/users**: Fetch all users
- **POST /api/users**: Create a new user
- **PUT /api/users**: Update a user
- **DELETE /api/users**: Delete a user

### Categories

- **GET /api/categories**: Fetch all categories
- **POST /api/categories**: Create a new category
- **PUT /api/categories**: Update a category
- **DELETE /api/categories**: Delete a category

### Events

- **GET /api/events**: Fetch all events
- **POST /api/events**: Create a new event
- **PUT /api/events**: Update an event
- **DELETE /api/events**: Delete an event

### Orders

- **GET /api/orders**: Fetch all orders
- **POST /api/orders**: Create a new order
- **PUT /api/orders**: Update an order
- **DELETE /api/orders**: Delete an order

## Example Code

### `src/lib/prisma.ts`
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
