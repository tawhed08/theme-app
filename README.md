# Theme Studio

Theme Studio is a Next.js design-system platform backed by an Express API and MongoDB.

## Local setup

1. Copy `frontend/.env.example` to `frontend/.env.local`.
2. Copy `backend/.env.example` to `backend/.env` and set a MongoDB connection string plus a unique `JWT_SECRET` of at least 32 random characters. Generate one with:

   ```sh
   node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
   ```

3. Start the API from `backend/` with `npm install` and `npm run dev`.
4. Start the site from `frontend/` with `npm install` and `npm run dev`.

For deployment, set `FRONTEND_URL` on the API to the exact frontend origin, use HTTPS, and set `NEXT_PUBLIC_SITE_URL` to the canonical public URL. Keep MongoDB credentials and `JWT_SECRET` only in the backend environment; never prefix these secrets with `NEXT_PUBLIC_`.

## Routes

- `/` — landing page and theme/feature carousels
- `/themes` — searchable curated theme library
- `/colors`, `/fonts`, `/gradients`, `/radius`, `/shadows`, `/spacing` — individual design tools
- `/generator` — complete theme generator and CSS export
- `/login`, `/signup` — account access
- `/dashboard` — private saved themes
- `/studio` — complete authenticated editor
- `/privacy`, `/terms` — legal information

The original curated theme data remains in `data/themes.ts`. Passwords are bcrypt-hashed, session JWTs are issued only in HTTP-only cookies, and saved theme endpoints require a valid user session.

## Validation

Run in `frontend/`:

```sh
npx tsc --noEmit
npm run lint
npm run build
```
