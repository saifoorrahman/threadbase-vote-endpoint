# Threadbase Vote Endpoint

Implementation of `POST /posts/:id/vote` using Prisma transactions and atomic score increments.

## Endpoint

`POST /posts/:id/vote`

### Expected responses

- `201` — vote recorded and score incremented
- `409` — user already voted
- `404` — post not found
- `400` — invalid post id

## Setup

1. Create a PostgreSQL database named `threadbase`.
2. Set `DATABASE_URL` in `.env`.
3. Run `npm install`.
4. Run `npx prisma migrate dev --name add-votes`.
5. Seed at least one user and two posts.
6. Run `npx ts-node src/app.ts`.

The route uses one Prisma `$transaction` containing the vote creation and atomic `score: { increment: 1 }` update.
