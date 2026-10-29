-- ============================================================
-- SAMVAD JHARKHAND - SELF-HEALING SUPABASE DATABASE SCHEMA
-- ============================================================
-- This script safely updates existing tables (adds missing columns)
-- and seeds the database without any "column does not exist" errors.
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/iajpmeoqtuqrwwesuvgq/sql
-- ============================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'citizen';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS district TEXT DEFAULT 'Ranchi';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS block TEXT DEFAULT 'Ranchi Sadar';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS community_role TEXT DEFAULT 'Citizen Member';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Challenges Table (Core societal challenges)
CREATE TABLE IF NOT EXISTS public.challenges (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS domain TEXT;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS domain_icon TEXT DEFAULT 'Sparkles';
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS domain_color TEXT DEFAULT '#16A34A';
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS district TEXT DEFAULT 'Ranchi';
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS block TEXT DEFAULT 'Ranchi Sadar';
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Jharkhand';
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS location_name TEXT;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS stage TEXT DEFAULT 'Submitted';
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS urgency TEXT DEFAULT 'Medium';
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS impact_level TEXT DEFAULT 'Medium';
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS submitter_type TEXT DEFAULT 'Citizen';
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS submitted_by TEXT;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS submitted_at TEXT;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS beneficiaries INT DEFAULT 100;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS upvotes INT DEFAULT 1;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS comments INT DEFAULT 0;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS photo_count INT DEFAULT 0;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS ai_tags JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS milestones JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS assigned_university JSONB;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS industry_partner JSONB;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS progress_percent INT DEFAULT 0;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS required_skills JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS funding_available TEXT;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS applications INT DEFAULT 0;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS deadline TEXT;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS ai_confidence INT DEFAULT 85;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Challenge Comments / Community Discussion
CREATE TABLE IF NOT EXISTS public.challenge_comments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  challenge_id TEXT,
  user_id TEXT,
  author_name TEXT NOT NULL,
  author_role TEXT,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Challenge Supports / Upvotes
CREATE TABLE IF NOT EXISTS public.challenge_supports (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  challenge_id TEXT,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Civic Reports Table (6-Step Detailed Reports)
CREATE TABLE IF NOT EXISTS public.civic_reports (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  urgency TEXT DEFAULT 'Standard',
  status TEXT DEFAULT 'Under Review',
  district TEXT NOT NULL,
  block TEXT,
  village_or_ward TEXT,
  landmark TEXT,
  location_notes TEXT,
  coordinates JSONB,
  photos JSONB DEFAULT '[]'::jsonb,
  voice_note_uri TEXT,
  reporter_name TEXT,
  reporter_phone TEXT,
  reporter_id TEXT,
  tracking_id TEXT,
  timeline JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enables open public access for Clerk-authenticated app client
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_supports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.civic_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public access profiles" ON public.profiles;
CREATE POLICY "Public access profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access challenges" ON public.challenges;
CREATE POLICY "Public access challenges" ON public.challenges FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access comments" ON public.challenge_comments;
CREATE POLICY "Public access comments" ON public.challenge_comments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access supports" ON public.challenge_supports;
CREATE POLICY "Public access supports" ON public.challenge_supports FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access reports" ON public.civic_reports;
CREATE POLICY "Public access reports" ON public.civic_reports FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- STORAGE BUCKETS FOR MEDIA & PHOTOS
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true), ('challenge-media', 'challenge-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public media select" ON storage.objects;
CREATE POLICY "Public media select" ON storage.objects
FOR SELECT USING (bucket_id IN ('media', 'challenge-media'));

DROP POLICY IF EXISTS "Public media insert" ON storage.objects;
CREATE POLICY "Public media insert" ON storage.objects
FOR INSERT WITH CHECK (bucket_id IN ('media', 'challenge-media'));

-- ============================================================
-- SEED INITIAL CHALLENGES (Matches App Schema Exactly)
-- ============================================================

INSERT INTO public.challenges (
  id, title, domain, domain_icon, domain_color, description, stage,
  district, block, location, urgency, impact_level, submitter_type,
  submitted_by, beneficiaries, upvotes, photo_count, ai_tags,
  ai_confidence, funding_available
) VALUES
(
  'SC-JH-84920',
  'Solar-powered micro cold storage for tomato harvest',
  'Agriculture & Farming',
  'Sprout',
  '#16A34A',
  'Farmers in Ormanjhi face 35% spoilage of tomato crops due to lack of village-level pre-cooling facilities during peak summer harvest.',
  'In Progress',
  'Ranchi',
  'Ormanjhi',
  'Ormanjhi, Ranchi',
  'High',
  'High',
  'Citizen',
  'Manoj Mahto (Kisan Samiti)',
  1200,
  42,
  2,
  '["Solar", "Cold Chain", "Post Harvest", "Tomato"]'::jsonb,
  94,
  '₹4,20,000'
),
(
  'SC-JH-84921',
  'Fluoride water filtration unit for school hand pumps',
  'Water & Sanitation',
  'Droplets',
  '#0284C7',
  'Excess fluoride levels in groundwater causing dental fluorosis among primary school students in 6 schools across Daltonganj block.',
  'Pilot Testing',
  'Palamu',
  'Daltonganj',
  'Daltonganj, Palamu',
  'Critical',
  'Critical',
  'PRI',
  'Sita Devi (Panchayat Samiti)',
  3400,
  87,
  3,
  '["Fluoride", "Filtration", "Drinking Water", "Health"]'::jsonb,
  98,
  '₹2,80,000'
),
(
  'SC-JH-84922',
  'Mahua flower drying and value-added processing kiln',
  'Rural Livelihoods',
  'Trees',
  '#059669',
  'Traditional open-ground drying of Mahua flowers causes dust contamination and reduces market value for tribal forest gatherers by 40%.',
  'Assigned',
  'Khunti',
  'Murhu',
  'Murhu, Khunti',
  'Medium',
  'Medium',
  'Citizen',
  'Birsa Munda SHG Federation',
  850,
  35,
  1,
  '["Mahua", "NTFP", "Tribal Livelihood", "Solar Dryer"]'::jsonb,
  91,
  '₹1,95,000'
),
(
  'SC-JH-84923',
  'IoT soil moisture sensor network for deficit irrigation',
  'Agriculture & Farming',
  'Sprout',
  '#16A34A',
  'Plateau upland paddy fields require precision water scheduling during monsoon breaks to prevent crop failure.',
  'Validated',
  'Hazaribagh',
  'Barhi',
  'Barhi, Hazaribagh',
  'High',
  'High',
  'Citizen',
  'Barhi Krishi Vikas Manch',
  620,
  56,
  2,
  '["IoT", "Soil Moisture", "Upland Paddy", "Water Conservation"]'::jsonb,
  89,
  '₹3,10,000'
),
(
  'SC-JH-84924',
  'Tasar silk yarn reeling machine for rural women artisans',
  'Rural Livelihoods',
  'Factory',
  '#D97706',
  'Thigh reeling of wild Tasar cocoons causes chronic musculoskeletal strain for tribal women reelers in Chaibasa clusters.',
  'In Progress',
  'West Singhbhum',
  'Chaibasa',
  'Chaibasa, West Singhbhum',
  'Critical',
  'Critical',
  'PRI',
  'Jharkhand Silk Producer Union',
  1800,
  98,
  4,
  '["Tasar Silk", "Ergonomics", "Women SHGs", "MSME"]'::jsonb,
  96,
  '₹5,50,000'
),
(
  'SC-JH-84925',
  'Decentralized biomass pelletizer for crop residue management',
  'Electricity & Energy',
  'Zap',
  '#EA580C',
  'Open field burning of rice straw in Kanke causing seasonal air quality degradation and organic carbon loss.',
  'Submitted',
  'Ranchi',
  'Kanke',
  'Kanke, Ranchi',
  'Medium',
  'Medium',
  'Citizen',
  'Green Ranchi Citizen Group',
  500,
  19,
  1,
  '["Biomass", "Pelletizer", "Clean Energy", "Crop Residue"]'::jsonb,
  87,
  '₹3,75,000'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  domain = EXCLUDED.domain,
  description = EXCLUDED.description,
  stage = EXCLUDED.stage,
  district = EXCLUDED.district,
  block = EXCLUDED.block,
  location = EXCLUDED.location,
  urgency = EXCLUDED.urgency,
  impact_level = EXCLUDED.impact_level,
  submitter_type = EXCLUDED.submitter_type,
  submitted_by = EXCLUDED.submitted_by,
  beneficiaries = EXCLUDED.beneficiaries,
  funding_available = EXCLUDED.funding_available;
