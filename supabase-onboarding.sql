-- ============================================================
-- Onboarding tracking
-- Run this in Supabase > SQL Editor
-- ============================================================

-- Add column (new users default to false = needs onboarding)
alter table public.profiles
  add column if not exists onboarding_completed boolean default false;

-- Mark ALL existing users as already onboarded so they're not disrupted
update public.profiles
  set onboarding_completed = true
  where onboarding_completed = false;
