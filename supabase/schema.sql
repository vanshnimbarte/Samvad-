-- ============================================================
-- SAMVAD JHARKHAND - COMPLETE SUPABASE DATABASE SCHEMA
-- ============================================================
-- Run this script in your Supabase Dashboard:
-- https://supabase.com/dashboard/project/iajpmeoqtuqrwwesuvgq/sql
-- ============================================================

-- 1. Profiles Table (Citizens, University, Industry, Government)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'citizen',
  district TEXT DEFAULT 'Ranchi',
  block TEXT DEFAULT 'Ranchi Sadar',
  community_role TEXT DEFAULT 'Citizen Member',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Challenges Table (Core societal challenges)
CREATE TABLE IF NOT EXISTS public.challenges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  description TEXT,
  stage TEXT DEFAULT 'Submitted',
  district TEXT NOT NULL,
  block TEXT,
  location_name TEXT,
  coordinates JSONB,
  severity TEXT DEFAULT 'Medium',
  submitter_name TEXT,
  submitter_type TEXT DEFAULT 'Citizen',
  submitter_id TEXT,
  assigned_university JSONB,
  industry_partner JSONB,
  solutions_count INT DEFAULT 0,
  upvotes INT DEFAULT 1,
  media_urls JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  ai_confidence INT DEFAULT 90,
  estimated_beneficiaries TEXT,
  budget_estimate TEXT,
  similar_challenge_ids JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Challenge Comments / Community Discussion
CREATE TABLE IF NOT EXISTS public.challenge_comments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  challenge_id TEXT REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id TEXT,
  author_name TEXT NOT NULL,
  author_role TEXT,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Challenge Supports / Upvotes
CREATE TABLE IF NOT EXISTS public.challenge_supports (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  challenge_id TEXT REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
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
-- Ensures mobile app & web client with anon key can read & write
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_supports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.civic_reports ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for all tables using the client anon key
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
-- STORAGE BUCKETS FOR CHALLENGE PHOTOS & MEDIA
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
-- SEED INITIAL CHALLENGES
-- ============================================================

INSERT INTO public.challenges (
  id, title, domain, description, stage, district, block, location_name,
  coordinates, severity, submitter_name, submitter_type, solutions_count,
  upvotes, tags, ai_confidence, estimated_beneficiaries, budget_estimate
) VALUES
(
  'SC-JH-84920',
  'Solar-powered micro cold storage for tomato harvest',
  'Agriculture & Post-Harvest',
  'Farmers in Ormanjhi face 35% spoilage of tomato crops due to lack of village-level pre-cooling facilities during peak summer harvest.',
  'In Progress',
  'Ranchi',
  'Ormanjhi',
  'Ormanjhi Village Hub',
  '{"latitude": 23.4834, "longitude": 85.4789}'::jsonb,
  'High',
  'Manoj Mahto (Kisan Samiti)',
  'Citizen',
  3,
  42,
  '["Solar", "Cold Chain", "Post Harvest", "Tomato"]'::jsonb,
  94,
  '1,200 smallholder farmers',
  '₹4,20,000'
),
(
  'SC-JH-84921',
  'Fluoride water filtration unit for school hand pumps',
  'Water, Sanitation & Health',
  'Excess fluoride levels in groundwater causing dental fluorosis among primary school students in 6 schools across Daltonganj block.',
  'Pilot Testing',
  'Palamu',
  'Daltonganj',
  'Chianki Primary School Cluster',
  '{"latitude": 24.0416, "longitude": 84.0722}'::jsonb,
  'Critical',
  'Sita Devi (Panchayat Samiti)',
  'Panchayat',
  2,
  87,
  '["Fluoride", "Filtration", "Drinking Water", "Health"]'::jsonb,
  98,
  '3,400 students & teachers',
  '₹2,80,000'
),
(
  'SC-JH-84922',
  'Mahua flower drying and value-added processing kiln',
  'Forest Produce & Livelihood',
  'Traditional open-ground drying of Mahua flowers causes dust contamination and reduces market value for tribal forest gatherers by 40%.',
  'Assigned',
  'Khunti',
  'Murhu',
  'Murhu Haat Bazaar',
  '{"latitude": 23.0712, "longitude": 85.2789}'::jsonb,
  'Medium',
  'Birsa Munda SHG Federation',
  'Citizen',
  1,
  35,
  '["Mahua", "NTFP", "Tribal Livelihood", "Solar Dryer"]'::jsonb,
  91,
  '850 tribal collectors',
  '₹1,95,000'
),
(
  'SC-JH-84923',
  'IoT soil moisture sensor network for deficit irrigation',
  'Agri-Tech & Water Management',
  'Plateau upland paddy fields require precision water scheduling during monsoon breaks to prevent crop failure.',
  'Validated',
  'Hazaribagh',
  'Barhi',
  'Barhi Research Extension Area',
  '{"latitude": 24.3012, "longitude": 85.4298}'::jsonb,
  'High',
  'Barhi Krishi Vikas Manch',
  'Citizen',
  4,
  56,
  '["IoT", "Soil Moisture", "Upland Paddy", "Water Conservation"]'::jsonb,
  89,
  '620 paddy farmers',
  '₹3,10,000'
),
(
  'SC-JH-84924',
  'Tasar silk yarn reeling machine for rural women artisans',
  'Textiles, Handicrafts & MSME',
  'Thigh reeling of wild Tasar cocoons causes chronic musculoskeletal strain for tribal women reelers in Chaibasa clusters.',
  'In Progress',
  'West Singhbhum',
  'Chaibasa',
  'Chaibasa Silk Cluster Hub',
  '{"latitude": 22.5524, "longitude": 85.8081}'::jsonb,
  'Critical',
  'Jharkhand Silk Producer Union',
  'Panchayat',
  3,
  98,
  '["Tasar Silk", "Ergonomics", "Women SHGs", "MSME"]'::jsonb,
  96,
  '1,800 women reelers',
  '₹5,50,000'
),
(
  'SC-JH-84925',
  'Decentralized biomass pelletizer for crop residue management',
  'Clean Energy & Waste-to-Wealth',
  'Open field burning of rice straw in Kanke causing seasonal air quality degradation and organic carbon loss.',
  'Submitted',
  'Ranchi',
  'Kanke',
  'Kanke Agri Block',
  '{"latitude": 23.4312, "longitude": 85.3211}'::jsonb,
  'Medium',
  'Green Ranchi Citizen Group',
  'Citizen',
  0,
  19,
  '["Biomass", "Pelletizer", "Clean Energy", "Crop Residue"]'::jsonb,
  87,
  'Entire Kanke peri-urban zone',
  '₹3,75,000'
)
ON CONFLICT (id) DO NOTHING;
