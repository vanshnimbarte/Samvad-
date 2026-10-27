-- ==============================================================================
-- SAMVAD JHARKHAND - PRODUCTION DATABASE SCHEMA & STRICT RLS POLICIES
-- ==============================================================================
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- to enforce strict Row Level Security (RLS), auto profile triggers, and tables.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Strict RLS & Privacy Controls)
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key,
  email text,
  full_name text,
  phone text,
  role text default 'citizen' check (role in ('citizen', 'university', 'industry', 'government')),
  district text default 'Ranchi',
  block text default 'Ranchi Sadar',
  community_role text,
  avatar_url text,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

grant select, insert, update on table public.profiles to anon, authenticated;

alter table public.profiles drop constraint if exists profiles_id_fkey;

drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Profiles are viewable by authenticated users" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
drop policy if exists "Allow all select on profiles" on public.profiles;
drop policy if exists "Allow all insert on profiles" on public.profiles;
drop policy if exists "Allow all update on profiles" on public.profiles;

create policy "Allow all select on profiles"
  on public.profiles for select
  using (true);

create policy "Allow all insert on profiles"
  on public.profiles for insert
  with check (true);

create policy "Allow all update on profiles"
  on public.profiles for update
  using (true);

-- Trigger to auto-create profile on Supabase Auth user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    phone,
    role,
    district,
    block,
    community_role,
    is_verified
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'phone', new.phone, ''),
    coalesce(new.raw_user_meta_data->>'role', 'citizen'),
    coalesce(new.raw_user_meta_data->>'district', 'Ranchi'),
    coalesce(new.raw_user_meta_data->>'block', 'Ranchi Sadar'),
    coalesce(new.raw_user_meta_data->>'community_role', 'Citizen Member'),
    false
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    phone = coalesce(excluded.phone, profiles.phone),
    role = coalesce(excluded.role, profiles.role),
    district = coalesce(excluded.district, profiles.district),
    block = coalesce(excluded.block, profiles.block),
    community_role = coalesce(excluded.community_role, profiles.community_role),
    updated_at = timezone('utc'::text, now());

  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill any existing users in auth.users
insert into public.profiles (id, email, full_name, phone, role, district, block, community_role, is_verified)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1)),
  coalesce(raw_user_meta_data->>'phone', phone, ''),
  coalesce(raw_user_meta_data->>'role', 'citizen'),
  coalesce(raw_user_meta_data->>'district', 'Ranchi'),
  coalesce(raw_user_meta_data->>'block', 'Ranchi Sadar'),
  'Citizen Member',
  false
from auth.users
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 2. CHALLENGES TABLE (Restricted Updates & Validated Insertion)
-- ------------------------------------------------------------------------------
create table if not exists public.challenges (
  id text primary key,
  user_id uuid,
  title text not null,
  domain text not null,
  domain_icon text,
  domain_color text,
  district text not null,
  location text not null,
  description text not null,
  stage text default 'Submitted' check (stage in ('Submitted', 'Under Review', 'Validated', 'Assigned', 'In Progress', 'Pilot Testing', 'Deployed')),
  urgency text default 'Medium' check (urgency in ('Low', 'Medium', 'High', 'Critical')),
  impact_level text default 'Medium',
  submitter_type text default 'Citizen',
  submitted_by text not null,
  submitted_at text default to_char(now(), 'YYYY-MM-DD'),
  beneficiaries integer default 100,
  upvotes integer default 0,
  comments integer default 0,
  photo_count integer default 0,
  ai_tags jsonb default '[]'::jsonb,
  milestones jsonb default '[]'::jsonb,
  assigned_university jsonb,
  industry_partner jsonb,
  progress_percent integer default 0,
  image_url text,
  required_skills jsonb default '[]'::jsonb,
  funding_available text,
  applications integer default 0,
  deadline text,
  department text,
  ai_confidence integer default 85,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.challenges enable row level security;

alter table public.challenges drop constraint if exists challenges_user_id_fkey;
grant select, insert, update on table public.challenges to anon, authenticated;

drop policy if exists "Challenges are viewable by everyone" on public.challenges;
drop policy if exists "Anyone can submit a challenge" on public.challenges;
drop policy if exists "Users or admins can update challenges" on public.challenges;
drop policy if exists "Public can view challenges" on public.challenges;
drop policy if exists "Authenticated users can submit challenges" on public.challenges;
drop policy if exists "Authorized roles can update challenges" on public.challenges;

-- Public can view challenges to explore societal issues
create policy "Public can view challenges"
  on public.challenges for select
  using (true);

-- Anyone (Clerk authenticated or guest) can submit challenges to Supabase
create policy "Anyone can submit challenges"
  on public.challenges for insert
  with check (true);

-- Anyone can update challenges to update milestones, upvotes, stages
create policy "Anyone can update challenges"
  on public.challenges for update
  using (true);

-- ------------------------------------------------------------------------------
-- 3. CIVIC REPORTS TABLE (Strict Auth Insertion & Department Updates)
-- ------------------------------------------------------------------------------
create table if not exists public.civic_reports (
  id text primary key,
  user_id uuid,
  title_en text not null,
  title_hi text,
  description_en text not null,
  description_hi text,
  category_id text not null,
  status text default 'Received',
  urgency text default 'medium' check (urgency in ('low', 'medium', 'high', 'emergency')),
  location jsonb not null,
  submitted_by jsonb not null,
  affected_count integer default 50,
  affected_groups jsonb default '[]'::jsonb,
  recurring boolean default false,
  supporters integer default 1,
  media jsonb default '[]'::jsonb,
  timeline jsonb default '[]'::jsonb,
  responsible_org jsonb,
  next_expected_action jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.civic_reports enable row level security;

alter table public.civic_reports drop constraint if exists civic_reports_user_id_fkey;
grant select, insert, update on table public.civic_reports to anon, authenticated;

drop policy if exists "Reports are viewable by everyone" on public.civic_reports;
drop policy if exists "Anyone can submit a report" on public.civic_reports;
drop policy if exists "Reports can be updated" on public.civic_reports;
drop policy if exists "Public can view reports" on public.civic_reports;
drop policy if exists "Authenticated users can submit reports" on public.civic_reports;
drop policy if exists "Authorized users can update reports" on public.civic_reports;

-- Public can view civic reports
create policy "Public can view reports"
  on public.civic_reports for select
  using (true);

-- Anyone can submit reports
create policy "Anyone can submit reports"
  on public.civic_reports for insert
  with check (true);

-- Anyone can update reports
create policy "Anyone can update reports"
  on public.civic_reports for update
  using (true);

-- ------------------------------------------------------------------------------
-- 4. CHALLENGE COMMENTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.challenge_comments (
  id uuid default gen_random_uuid() primary key,
  challenge_id text references public.challenges(id) on delete cascade not null,
  user_id uuid,
  author_name text not null,
  author_role text not null,
  comment_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.challenge_comments drop constraint if exists challenge_comments_user_id_fkey;
grant select, insert on table public.challenge_comments to anon, authenticated;

drop policy if exists "Challenge comments are viewable by everyone" on public.challenge_comments;
drop policy if exists "Anyone can post a comment" on public.challenge_comments;
drop policy if exists "Public can view challenge comments" on public.challenge_comments;
drop policy if exists "Authenticated users can post challenge comments" on public.challenge_comments;

create policy "Public can view challenge comments"
  on public.challenge_comments for select
  using (true);

create policy "Anyone can post challenge comments"
  on public.challenge_comments for insert
  with check (true);

-- ------------------------------------------------------------------------------
-- 5. REPORT COMMENTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.report_comments (
  id uuid default gen_random_uuid() primary key,
  report_id text references public.civic_reports(id) on delete cascade not null,
  user_id uuid,
  author_name text not null,
  author_role text not null,
  comment_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.report_comments enable row level security;
alter table public.report_comments drop constraint if exists report_comments_user_id_fkey;
grant select, insert on table public.report_comments to anon, authenticated;

drop policy if exists "Report comments are viewable by everyone" on public.report_comments;
drop policy if exists "Anyone can comment on a report" on public.report_comments;
drop policy if exists "Public can view report comments" on public.report_comments;
drop policy if exists "Authenticated users can post report comments" on public.report_comments;

create policy "Public can view report comments"
  on public.report_comments for select
  using (true);

create policy "Anyone can post report comments"
  on public.report_comments for insert
  with check (true);

-- ------------------------------------------------------------------------------
-- 6. CHALLENGE UPVOTES TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.challenge_upvotes (
  id uuid default gen_random_uuid() primary key,
  challenge_id text references public.challenges(id) on delete cascade not null,
  user_id uuid not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (challenge_id, user_id)
);

alter table public.challenge_upvotes enable row level security;
alter table public.challenge_upvotes drop constraint if exists challenge_upvotes_user_id_fkey;
grant select, insert, delete on table public.challenge_upvotes to anon, authenticated;

drop policy if exists "Upvotes viewable by everyone" on public.challenge_upvotes;
drop policy if exists "Authenticated users can upvote" on public.challenge_upvotes;
drop policy if exists "Users can remove their upvote" on public.challenge_upvotes;
drop policy if exists "Public can view upvotes" on public.challenge_upvotes;
drop policy if exists "Users can remove own upvote" on public.challenge_upvotes;

create policy "Public can view upvotes"
  on public.challenge_upvotes for select
  using (true);

create policy "Anyone can upvote"
  on public.challenge_upvotes for insert
  with check (true);

create policy "Anyone can remove upvote"
  on public.challenge_upvotes for delete
  using (true);

-- ------------------------------------------------------------------------------
-- 7. REPORT SUPPORTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.report_supports (
  id uuid default gen_random_uuid() primary key,
  report_id text references public.civic_reports(id) on delete cascade not null,
  user_id uuid not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (report_id, user_id)
);

alter table public.report_supports enable row level security;
alter table public.report_supports drop constraint if exists report_supports_user_id_fkey;
grant select, insert, delete on table public.report_supports to anon, authenticated;

drop policy if exists "Supports viewable by everyone" on public.report_supports;
drop policy if exists "Users can support reports" on public.report_supports;
drop policy if exists "Users can remove support" on public.report_supports;
drop policy if exists "Public can view supports" on public.report_supports;
drop policy if exists "Authenticated users can support reports" on public.report_supports;
drop policy if exists "Users can remove own support" on public.report_supports;

create policy "Public can view supports"
  on public.report_supports for select
  using (true);

create policy "Anyone can support reports"
  on public.report_supports for insert
  with check (true);

create policy "Anyone can remove support"
  on public.report_supports for delete
  using (true);

-- ------------------------------------------------------------------------------
-- 8. NOTIFICATIONS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  type text not null,
  title_en text not null,
  title_hi text,
  message_en text not null,
  message_hi text,
  report_id text,
  challenge_id text,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notifications enable row level security;
alter table public.notifications drop constraint if exists notifications_user_id_fkey;
grant select, insert, update on table public.notifications to anon, authenticated;

drop policy if exists "Users can see own notifications" on public.notifications;
drop policy if exists "Users can update own notifications" on public.notifications;
drop policy if exists "Users can view own notifications" on public.notifications;
drop policy if exists "Anyone can view notifications" on public.notifications;
drop policy if exists "Anyone can update notifications" on public.notifications;
drop policy if exists "Anyone can insert notifications" on public.notifications;

create policy "Anyone can view notifications"
  on public.notifications for select
  using (true);

create policy "Anyone can insert notifications"
  on public.notifications for insert
  with check (true);

create policy "Anyone can update notifications"
  on public.notifications for update
  using (true);

-- ------------------------------------------------------------------------------
-- 9. SECURE STORAGE BUCKET FOR MEDIA UPLOADS
-- ------------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Media files are publicly viewable" on storage.objects;
drop policy if exists "Anyone can upload media" on storage.objects;
drop policy if exists "Authenticated users can upload media" on storage.objects;
drop policy if exists "Users can delete own media" on storage.objects;
drop policy if exists "Allow media update" on storage.objects;
drop policy if exists "Allow media delete" on storage.objects;

-- Public can view attached evidence photos
create policy "Media files are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'media');

-- Allow uploading media attachments for civic reports & challenges (Clerk authenticated or guest)
create policy "Anyone can upload media"
  on storage.objects for insert
  with check (bucket_id = 'media');

-- Allow updating and deleting media
create policy "Allow media update"
  on storage.objects for update
  using (bucket_id = 'media');

create policy "Allow media delete"
  on storage.objects for delete
  using (bucket_id = 'media');

-- ------------------------------------------------------------------------------
-- 10. INITIAL SEED DATA
-- ------------------------------------------------------------------------------
insert into public.challenges (
  id, title, domain, domain_icon, domain_color, district, location, description,
  stage, urgency, impact_level, submitter_type, submitted_by, beneficiaries,
  upvotes, comments, photo_count, progress_percent, image_url, ai_tags, milestones
)
values
(
  'CH-JH-2026-001',
  'Solar-powered micro cold storage for tomato harvest gluts',
  'Agriculture & Farming',
  'Sprout',
  '#16A34A',
  'Ranchi',
  'Ormanjhi block, 6 panchayats',
  'Farmers experience 35-40% post-harvest spoilage during February-March peak tomato harvests due to zero local cold chain facilities. Need decentralized 5MT solar cold rooms.',
  'Pilot Testing',
  'High',
  'High',
  'Community Org',
  'Sunita Devi (SHG Lead)',
  1200,
  42,
  8,
  3,
  75,
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
  '["Cold Chain", "Post-Harvest", "Solar Energy", "Tomato", "SHG", "Rural Economy"]'::jsonb,
  '[
    {"id": "m1", "title": "Field baseline survey & thermal load calc", "dueDate": "15 Jan 2026", "completed": true},
    {"id": "m2", "title": "PCM thermal storage prototype design", "dueDate": "10 Feb 2026", "completed": true},
    {"id": "m3", "title": "Ormanjhi prototype deployment & trial", "dueDate": "28 Feb 2026", "completed": true},
    {"id": "m4", "title": "Commercial viability & SHG handoff", "dueDate": "30 Mar 2026", "completed": false}
  ]'::jsonb
),
(
  'CH-JH-2026-002',
  'Arsenic and fluoride filtration for tribal residential schools',
  'Water & Sanitation',
  'Droplets',
  '#0284C7',
  'Sahebganj',
  'Rajmahal & Borio blocks',
  'Groundwater in 14 tribal welfare residential schools shows fluoride levels exceeding 2.8 mg/L and arsenic contamination. Students suffering from dental fluorosis and gastric illnesses.',
  'In Progress',
  'Critical',
  'Critical',
  'PRI',
  'Birsa Munda Smriti Samiti',
  3400,
  89,
  14,
  5,
  55,
  'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=1200&q=80',
  '["Fluoride", "Arsenic", "Water Quality", "School Health", "Nano Filtration", "Tribal Welfare"]'::jsonb,
  '[
    {"id": "m1", "title": "Water quality mapping across 14 schools", "dueDate": "05 Jan 2026", "completed": true},
    {"id": "m2", "title": "Adsorbent nano-composite filter selection", "dueDate": "25 Jan 2026", "completed": true},
    {"id": "m3", "title": "Installation in 3 pilot schools (Rajmahal)", "dueDate": "20 Feb 2026", "completed": false},
    {"id": "m4", "title": "IoT water quality sensor integration", "dueDate": "15 Mar 2026", "completed": false}
  ]'::jsonb
),
(
  'CH-JH-2026-003',
  'All-weather culvert design for flood-isolated forest villages',
  'Roads & Transport',
  'Truck',
  '#D97706',
  'West Singhbhum',
  'Goilkera & Manoharpur blocks',
  'Monsoon flash floods wash away makeshift earthen hume-pipe culverts every year, cutting off 8 tribal villages (population ~4,800) from PHCs and ration distribution for 4 months.',
  'Assigned',
  'High',
  'High',
  'Citizen',
  'Mangal Purty (Ward Member)',
  4800,
  64,
  5,
  4,
  35,
  'https://images.unsplash.com/photo-1515165562839-978bbcf18277?auto=format&fit=crop&w=1200&q=80',
  '["Culvert", "Flash Floods", "Prefab Concrete", "Rural Access", "Monsoon", "Saranda"]'::jsonb,
  '[
    {"id": "m1", "title": "Hydraulic catchment and soil stability study", "dueDate": "20 Jan 2026", "completed": true},
    {"id": "m2", "title": "Modular precast arch culvert design", "dueDate": "15 Feb 2026", "completed": false},
    {"id": "m3", "title": "Local stone-mason training for construction", "dueDate": "10 Mar 2026", "completed": false}
  ]'::jsonb
)
on conflict (id) do nothing;
