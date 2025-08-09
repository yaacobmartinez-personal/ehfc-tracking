# Supabase Setup Guide

This project uses Supabase to store pin data. Follow these steps to set up Supabase:

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be ready

## 2. Get Your Project Credentials

1. Go to your project dashboard
2. Navigate to Settings > API
3. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## 3. Update Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

## 4. Run the Database Migration

1. Install Supabase CLI (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-id
   ```

4. Run the migration:
   ```bash
   supabase db push
   ```

## 5. Verify Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try adding a pin to the map
3. Check your Supabase dashboard > Table Editor > pins to see the data

## Database Schema

The migration creates a `pins` table with the following structure:

- `id` (UUID, Primary Key)
- `title` (TEXT, Required)
- `lng` (DOUBLE PRECISION, Required)
- `lat` (DOUBLE PRECISION, Required)
- `assignees` (TEXT[], Default: empty array)
- `target_families` (TEXT[], Default: empty array)
- `created_at` (TIMESTAMP WITH TIME ZONE, Auto-generated)
- `updated_at` (TIMESTAMP WITH TIME ZONE, Auto-updated)

## Security

The migration includes Row Level Security (RLS) with a policy that allows all operations. You may want to modify this based on your authentication requirements.

## Troubleshooting

- Make sure your Supabase project is active
- Verify your environment variables are correct
- Check the browser console for any error messages
- Ensure the migration ran successfully
