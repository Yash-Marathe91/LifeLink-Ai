-- ==============================================================================
-- LIFELINK AI - PROFESSIONAL SUPABASE RELATIONAL & VECTOR SCHEMA
-- ==============================================================================
-- This schema supports both the Citizen App and the NDRF Dashboard on a single 
-- unified backend. It includes operational tables, telemetry tables, and pgvector.

-- 1. ENABLE EXTENSIONS
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "vector"; -- Enables pgvector for AI Embeddings

-- 2. OPERATIONAL TABLES (CITIZEN & NDRF)
-- ==============================================================================

-- SOS Alerts (From Citizens)
CREATE TABLE public.sos_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sos_id TEXT UNIQUE NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accuracy DOUBLE PRECISION,
    priority TEXT NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ASSIGNED', 'RESOLVED')),
    is_offline_mesh BOOLEAN DEFAULT false,
    total_affected INTEGER DEFAULT 1,
    ai_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Disaster Reports (Citizen Photos & Reports)
CREATE TABLE public.disaster_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id TEXT UNIQUE NOT NULL,
    disaster_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    description TEXT,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'VERIFYING' CHECK (status IN ('VERIFYING', 'CONFIRMED', 'REJECTED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Rescue Teams (NDRF Units)
CREATE TABLE public.rescue_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id TEXT UNIQUE NOT NULL,
    callsign TEXT NOT NULL,
    unit_type TEXT NOT NULL,
    current_status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (current_status IN ('AVAILABLE', 'DEPLOYED', 'MAINTENANCE', 'OFF_DUTY')),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    equipment TEXT[] DEFAULT '{}',
    capacity_victims INTEGER DEFAULT 0,
    current_active_missions INTEGER DEFAULT 0,
    contact_channel TEXT,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Triaged Incidents (AI Clustered Events)
CREATE TABLE public.incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    disaster_type TEXT NOT NULL,
    priority_score DOUBLE PRECISION NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT,
    location_accuracy DOUBLE PRECISION,
    severity TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DISPATCHED', 'RESOLVED', 'CLOSED')),
    verification_status TEXT NOT NULL DEFAULT 'UNVERIFIED' CHECK (verification_status IN ('UNVERIFIED', 'VERIFIED', 'DISPUTED', 'REJECTED')),
    total_affected INTEGER DEFAULT 0,
    reported_injuries INTEGER DEFAULT 0,
    description TEXT,
    images TEXT[] DEFAULT '{}',
    assigned_team_id TEXT REFERENCES public.rescue_teams(team_id) ON DELETE SET NULL,
    ai_priority_factors JSONB, -- Stores why AI gave this score
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tactical Resources (Equipment & Supplies)
CREATE TABLE public.tactical_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('BOATS', 'VEHICLES', 'MEDICAL', 'LIFE_JACKETS', 'ROPES', 'COMMUNICATIONS', 'FOOD', 'WATER', 'OTHER')),
    condition TEXT NOT NULL DEFAULT 'GOOD' CHECK (condition IN ('NEW', 'GOOD', 'NEEDS_REPAIR', 'DAMAGED')),
    total_quantity INTEGER NOT NULL DEFAULT 1,
    available_quantity INTEGER NOT NULL DEFAULT 1,
    deployed_quantity INTEGER NOT NULL DEFAULT 0,
    assigned_team_id TEXT REFERENCES public.rescue_teams(team_id) ON DELETE SET NULL,
    assigned_incident_id TEXT REFERENCES public.incidents(incident_id) ON DELETE SET NULL,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit History Log (Overrides, Dispatch, Verification)
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id TEXT NOT NULL, -- The ID of the incident, team, or resource
    action_type TEXT NOT NULL CHECK (action_type IN ('VERIFICATION_CHANGE', 'PRIORITY_OVERRIDE', 'DISPATCH', 'RESOURCE_ALLOCATION')),
    operator_id TEXT NOT NULL, -- Who did it
    previous_value TEXT,
    new_value TEXT,
    reason TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Relational Linking (Many-to-Many for Incidents <-> SOS)
CREATE TABLE public.incident_sos_links (
    incident_id TEXT REFERENCES public.incidents(incident_id) ON DELETE CASCADE,
    sos_id TEXT REFERENCES public.sos_alerts(sos_id) ON DELETE CASCADE,
    linked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (incident_id, sos_id)
);


-- 3. TELEMETRY & VECTOR TABLES (METEOROLOGICAL DATA)
-- ==============================================================================

-- Defines the Data.gov.in Sources
CREATE TABLE public.telemetry_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_uuid TEXT UNIQUE NOT NULL, -- The data.gov.in UUID
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('RAINFALL', 'GROUND_WATER', 'HUMIDITY', 'WIND_SPEED', 'OTHER')),
    region TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Stores actual readings and AI Vector Embeddings for predictive analytics
CREATE TABLE public.telemetry_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_uuid TEXT REFERENCES public.telemetry_sources(source_uuid) ON DELETE CASCADE,
    reading_timestamp TIMESTAMPTZ NOT NULL,
    numeric_value DOUBLE PRECISION,
    unit TEXT,
    raw_data JSONB, -- Store full JSON payload from data.gov.in
    embedding VECTOR(1536), -- OpenAI standard vector dimension for semantic similarity/predictive clustering
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 4. HIGH-PERFORMANCE INDEXING
-- ==============================================================================
-- Geospatial querying optimizations
CREATE INDEX idx_sos_location ON public.sos_alerts (latitude, longitude);
CREATE INDEX idx_incident_location ON public.incidents (latitude, longitude);

-- Time-series optimizations for dashboards
CREATE INDEX idx_telemetry_time ON public.telemetry_readings (reading_timestamp DESC);
CREATE INDEX idx_incidents_created ON public.incidents (created_at DESC);

-- Vector Index (HNSW for rapid AI Similarity Search)
CREATE INDEX idx_telemetry_embedding ON public.telemetry_readings USING hnsw (embedding vector_cosine_ops);


-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Enable RLS
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disaster_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rescue_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_readings ENABLE ROW LEVEL SECURITY;

-- Unified Security: Both Apps share the DB securely.
-- Mobile app creates SOS Alerts (Public Insert)
CREATE POLICY "Allow public SOS creation" ON public.sos_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public Report creation" ON public.disaster_reports FOR INSERT WITH CHECK (true);

-- Dashboards and Backend have global read access (In production, bind this to 'authenticated' roles)
CREATE POLICY "Allow global read SOS" ON public.sos_alerts FOR SELECT USING (true);
CREATE POLICY "Allow global read Reports" ON public.disaster_reports FOR SELECT USING (true);
CREATE POLICY "Allow global read Teams" ON public.rescue_teams FOR SELECT USING (true);
CREATE POLICY "Allow global read Incidents" ON public.incidents FOR SELECT USING (true);

-- Backend specific updates (In production, restrict to service_role)
CREATE POLICY "Allow all updates Incidents" ON public.incidents FOR ALL USING (true);
CREATE POLICY "Allow all updates Teams" ON public.rescue_teams FOR ALL USING (true);


-- 6. STORAGE BUCKETS (If not already created)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('report-photos', 'report-photos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('sos-voice-notes', 'sos-voice-notes', false) ON CONFLICT (id) DO NOTHING;
