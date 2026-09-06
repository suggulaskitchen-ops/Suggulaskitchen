# Suggula's Kitchen
React and Vite frontend for the homemade food business, backed entirely by Supabase.

## Setup

Create `client/.env` with:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Configure the Supabase tables used by `client/src/services/supabase/api.js`, create the `menu-photos` Storage bucket, and create the admin user in Supabase Auth.

## Scripts

- `npm run dev` - start the Vite development server
- `npm run build` - create the production build
- `npm run preview` - preview the production build
- `npm run deploy` - publish `dist` to GitHub Pages

All authentication, database operations, and image storage use Supabase. There is no local JSON database or Express upload server.
