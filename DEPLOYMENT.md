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

## Database setup

This project uses MongoDB through Prisma. After `DATABASE_URL` is configured, sync Prisma indexes with:

```sh
npx prisma db push
```

Do not run database setup inside the Vercel build command. The build only generates Prisma Client and compiles Next.js.
