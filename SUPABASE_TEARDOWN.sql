-- ==============================================================================
-- LIFELINK AI - CLEANUP PREVIOUS TABLES
-- Run this to clear all old tables before running SUPABASE_SETUP.sql
-- ==============================================================================

-- Drop all relational links first
DROP TABLE IF EXISTS public.incident_sos_links CASCADE;
DROP TABLE IF EXISTS public.dispatch_history CASCADE;

-- Drop dependent tables
DROP TABLE IF EXISTS public.incidents CASCADE;
DROP TABLE IF EXISTS public.dispatches CASCADE;

-- Drop base tables
DROP TABLE IF EXISTS public.sos_alerts CASCADE;
DROP TABLE IF EXISTS public.disaster_reports CASCADE;
DROP TABLE IF EXISTS public.rescue_teams CASCADE;
DROP TABLE IF EXISTS public.mesh_telemetry CASCADE;
DROP TABLE IF EXISTS public.safety_guidelines CASCADE;

-- Optionally, you can empty the buckets (but Supabase Dashboard UI is safer for this)
-- DELETE FROM storage.objects WHERE bucket_id = 'report-photos';
-- DELETE FROM storage.objects WHERE bucket_id = 'sos-voice-notes';
