-- ==============================================================================
-- SAMVAD JHARKHAND - COMPLETE SUPABASE DATABASE SCHEMA & POLICIES
-- ==============================================================================
-- Run this complete script in the Supabase Dashboard:
-- SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked to Supabase Auth)
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  phone text,
  role text default 'citizen' check (role in ('citizen', 'university', 'industry', 'government')),
  district text default 'Ranchi',
  block text default 'Ranchi Sadar',
  community_role text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger to auto-create profile on Supabase Auth user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    phone,
    role,
    district,
    block,
    community_role
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'phone', new.phone, ''),
    coalesce(new.raw_user_meta_data->>'role', 'citizen'),
    coalesce(new.raw_user_meta_data->>'district', 'Ranchi'),
    coalesce(new.raw_user_meta_data->>'block', 'Ranchi Sadar'),
    coalesce(new.raw_user_meta_data->>'community_role', 'Citizen Member')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    phone = coalesce(excluded.phone, profiles.phone),
    role = coalesce(excluded.role, profiles.role),
    updated_at = timezone('utc'::text, now());

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill any existing users in auth.users
insert into public.profiles (id, email, full_name, phone, role, district, block, community_role)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1)),
  coalesce(raw_user_meta_data->>'phone', phone, ''),
  coalesce(raw_user_meta_data->>'role', 'citizen'),
  coalesce(raw_user_meta_data->>'district', 'Ranchi'),
  coalesce(raw_user_meta_data->>'block', 'Ranchi Sadar'),
  'Citizen Member'
from auth.users
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 2. CHALLENGES TABLE (Societal Innovation Problems)
-- ------------------------------------------------------------------------------
create table if not exists public.challenges (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
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

drop policy if exists "Challenges are viewable by everyone" on public.challenges;
create policy "Challenges are viewable by everyone"
  on public.challenges for select
  using (true);

drop policy if exists "Anyone can submit a challenge" on public.challenges;
create policy "Anyone can submit a challenge"
  on public.challenges for insert
  with check (true);

drop policy if exists "Users or admins can update challenges" on public.challenges;
create policy "Users or admins can update challenges"
  on public.challenges for update
  using (true);

-- ------------------------------------------------------------------------------
-- 3. CIVIC REPORTS TABLE (6-Step Citizen Reports & Grievances)
-- ------------------------------------------------------------------------------
create table if not exists public.civic_reports (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
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

drop policy if exists "Reports are viewable by everyone" on public.civic_reports;
create policy "Reports are viewable by everyone"
  on public.civic_reports for select
  using (true);

drop policy if exists "Anyone can submit a report" on public.civic_reports;
create policy "Anyone can submit a report"
  on public.civic_reports for insert
  with check (true);

drop policy if exists "Reports can be updated" on public.civic_reports;
create policy "Reports can be updated"
  on public.civic_reports for update
  using (true);

-- ------------------------------------------------------------------------------
-- 4. CHALLENGE COMMENTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.challenge_comments (
  id uuid default gen_random_uuid() primary key,
  challenge_id text references public.challenges(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  author_role text not null,
  comment_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.challenge_comments enable row level security;

drop policy if exists "Challenge comments are viewable by everyone" on public.challenge_comments;
create policy "Challenge comments are viewable by everyone"
  on public.challenge_comments for select
  using (true);

drop policy if exists "Anyone can post a comment" on public.challenge_comments;
create policy "Anyone can post a comment"
  on public.challenge_comments for insert
  with check (true);

-- ------------------------------------------------------------------------------
-- 5. REPORT COMMENTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.report_comments (
  id uuid default gen_random_uuid() primary key,
  report_id text references public.civic_reports(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  author_role text not null,
  comment_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.report_comments enable row level security;

drop policy if exists "Report comments are viewable by everyone" on public.report_comments;
create policy "Report comments are viewable by everyone"
  on public.report_comments for select
  using (true);

drop policy if exists "Anyone can comment on a report" on public.report_comments;
create policy "Anyone can comment on a report"
  on public.report_comments for insert
  with check (true);

-- ------------------------------------------------------------------------------
-- 6. CHALLENGE UPVOTES TABLE (Prevents double upvoting)
-- ------------------------------------------------------------------------------
create table if not exists public.challenge_upvotes (
  id uuid default gen_random_uuid() primary key,
  challenge_id text references public.challenges(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (challenge_id, user_id)
);

alter table public.challenge_upvotes enable row level security;

drop policy if exists "Upvotes viewable by everyone" on public.challenge_upvotes;
create policy "Upvotes viewable by everyone"
  on public.challenge_upvotes for select
  using (true);

drop policy if exists "Authenticated users can upvote" on public.challenge_upvotes;
create policy "Authenticated users can upvote"
  on public.challenge_upvotes for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can remove their upvote" on public.challenge_upvotes;
create policy "Users can remove their upvote"
  on public.challenge_upvotes for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 7. REPORT SUPPORTS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.report_supports (
  id uuid default gen_random_uuid() primary key,
  report_id text references public.civic_reports(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (report_id, user_id)
);

alter table public.report_supports enable row level security;

drop policy if exists "Supports viewable by everyone" on public.report_supports;
create policy "Supports viewable by everyone"
  on public.report_supports for select
  using (true);

drop policy if exists "Users can support reports" on public.report_supports;
create policy "Users can support reports"
  on public.report_supports for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can remove support" on public.report_supports;
create policy "Users can remove support"
  on public.report_supports for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 8. NOTIFICATIONS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
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

drop policy if exists "Users can see own notifications" on public.notifications;
create policy "Users can see own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update own notifications" on public.notifications;
create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 9. SUPABASE STORAGE BUCKET FOR MEDIA UPLOADS
-- ------------------------------------------------------------------------------
-- Insert media bucket into storage.buckets if not exists
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Public can view files in media bucket
drop policy if exists "Media files are publicly viewable" on storage.objects;
create policy "Media files are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'media');

-- Anyone can upload files to media bucket
drop policy if exists "Anyone can upload media" on storage.objects;
create policy "Anyone can upload media"
  on storage.objects for insert
  with check (bucket_id = 'media');

-- ------------------------------------------------------------------------------
-- 10. INITIAL SEED DATA (Featured Jharkhand Societal Challenges)
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
