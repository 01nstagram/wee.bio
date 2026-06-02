# Deployment

This project is deployed on Vercel from the GitHub repository `01nstagram/wee.bio`.

## Vercel project settings

- Framework preset: Next.js
- Install command: `npm ci`
- Build command: `npm run vercel-build`
- Production branch: `master`

## Required environment variables

Set these variables in Vercel before deploying:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`

## Database migrations

Run Prisma migrations against the production database after `DATABASE_URL` is configured:

```sh
npx prisma migrate deploy
```

Do not run database migrations inside the Vercel build command. The build only generates Prisma Client and compiles Next.js.
