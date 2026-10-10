-- ==============================================================================
-- LIFELINK AI - SUPABASE SCHEMA & BUCKET CONFIGURATION
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For advanced geospatial queries if needed

-- 2. DISASTER REPORTS TABLE
CREATE TABLE public.disaster_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  report_id text NOT NULL UNIQUE,
  disaster_type text NOT NULL,
  severity text NOT NULL,
  description text,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  location_name text,
  photo_url text,
  photo_path text,
  reporter_device_id text,
  network_status text,
  status text DEFAULT 'PENDING',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- 3. SOS ALERTS TABLE
CREATE TABLE public.sos_alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sos_id text NOT NULL UNIQUE,
  emergency_type text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  accuracy_meters double precision,
  battery_pct integer,
  voice_url text,
  voice_path text,
  voice_attached boolean DEFAULT false,
  voice_duration_seconds integer DEFAULT 0,
  total_people integer DEFAULT 1,
  elderly_count integer DEFAULT 0,
  children_count integer DEFAULT 0,
  vulnerable_count integer DEFAULT 0,
  hazards jsonb DEFAULT '{}'::jsonb,
  note text,
  transport_source text DEFAULT 'CELLULAR',
  status text DEFAULT 'RELAY_PENDING',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- 4. RESCUE TEAMS TABLE
CREATE TABLE public.rescue_teams (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  team_id text NOT NULL UNIQUE,
  callsign text NOT NULL,
  unit_type text NOT NULL,
  current_status text DEFAULT 'AVAILABLE',
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  equipment jsonb DEFAULT '[]'::jsonb,
  capacity_victims integer DEFAULT 4,
  current_active_missions integer DEFAULT 0,
  contact_channel text,
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- 5. INCIDENTS (AI TRIAGE CLUSTERS) TABLE
CREATE TABLE public.incidents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  incident_id text NOT NULL UNIQUE,
  primary_sos_id text REFERENCES public.sos_alerts(sos_id),
  title text NOT NULL,
  disaster_type text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  status text DEFAULT 'TRIAGED',
  priority_score double precision DEFAULT 0,
  category text DEFAULT 'MEDIUM',
  color text,
  explanation text,
  total_affected integer DEFAULT 1,
  assigned_team_id text REFERENCES public.rescue_teams(team_id),
  agent_breakdown jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- 6. INCIDENT <-> SOS RELATIONAL LINKS
CREATE TABLE public.incident_sos_links (
  incident_id text NOT NULL REFERENCES public.incidents(incident_id) ON DELETE CASCADE,
  sos_id text NOT NULL REFERENCES public.sos_alerts(sos_id) ON DELETE CASCADE,
  PRIMARY KEY (incident_id, sos_id)
);

-- ==============================================================================
-- 7. SUPABASE STORAGE BUCKETS SETUP
-- ==============================================================================

-- Create buckets for Photos and Voice Notes
INSERT INTO storage.buckets (id, name, public) VALUES ('report-photos', 'report-photos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('sos-voice-notes', 'sos-voice-notes', false);

-- Enable Row Level Security (RLS) for Buckets
CREATE POLICY "Public Access to Photos" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'report-photos' );

CREATE POLICY "Allow Insert to Photos" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'report-photos' );

CREATE POLICY "Authenticated Access to Voice Notes" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'sos-voice-notes' AND auth.role() = 'authenticated' );

CREATE POLICY "Allow Insert to Voice Notes" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'sos-voice-notes' );
