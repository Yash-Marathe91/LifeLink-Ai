-- =========================================================================
-- LifeLink AI - Hackathon Demo Data Injection Script
-- Run this in your Supabase SQL Editor AFTER the Schema and Clustering scripts.
-- =========================================================================

-- 1. Insert Rescue Teams (Will appear as Blue Trucks on the Tactical Map)
INSERT INTO public.rescue_teams (team_id, callsign, unit_type, current_status, latitude, longitude, equipment, capacity_victims) VALUES 
('TEAM-NDRF-001', 'Alpha Rescue', 'HEAVY_RESCUE', 'AVAILABLE', 17.3750, 78.4350, '["Inflatable Boat", "Ropes", "Medical Kit"]', 12),
('TEAM-NDRF-002', 'Bravo Marine', 'WATER_EVAC', 'STANDBY', 17.3680, 78.4250, '["Zodiac Boat", "Life Jackets"]', 20),
('TEAM-MED-001', 'Charlie Med', 'MEDICAL_RESPONSE', 'DEPLOYED', 17.3720, 78.4180, '["Trauma Kits", "Stretchers"]', 6);

-- 2. Insert Tactical Resources (Will appear in the Resources tab)
INSERT INTO public.tactical_resources (resource_id, name, category, condition, total_quantity, available_quantity, deployed_quantity) VALUES
('RES-BOAT-01', 'Zodiac Inflatable Boat', 'BOATS', 'GOOD', 10, 8, 2),
('RES-BOAT-02', 'Motorized Dinghy', 'BOATS', 'NEEDS_REPAIR', 5, 4, 1),
('RES-MED-01', 'Advanced Trauma Kit', 'MEDICAL', 'NEW', 50, 45, 5),
('RES-LIFE-01', 'Type III Life Jacket', 'LIFE_JACKETS', 'GOOD', 200, 180, 20),
('RES-VEH-01', '4x4 Evacuation Truck', 'VEHICLES', 'GOOD', 15, 12, 3);

-- 3. Insert Raw SOS Distress Signals (This will instantly trigger the AI Clustering algorithm!)
-- These are clustered around the Musi River in Hyderabad
INSERT INTO public.sos_alerts (sos_id, emergency_type, latitude, longitude, priority, status, total_affected) VALUES
('SOS-DEMO-001', 'Flood', 17.3689, 78.4185, 'CRITICAL', 'PENDING', 5),
('SOS-DEMO-002', 'Flood', 17.3690, 78.4186, 'HIGH', 'PENDING', 2),     -- Very close to 001, should merge!
('SOS-DEMO-003', 'Medical', 17.3754, 78.4287, 'HIGH', 'PENDING', 1),
('SOS-DEMO-004', 'Fire', 17.3667, 78.4459, 'MEDIUM', 'PENDING', 3),
('SOS-DEMO-005', 'Building Collapse', 17.3719, 78.4655, 'CRITICAL', 'PENDING', 15);

-- 4. Insert Some Pre-Resolved Incidents (To populate the 24-hour KPI Charts)
INSERT INTO public.incidents (incident_id, title, disaster_type, priority_score, latitude, longitude, severity, status, verification_status, total_affected, created_at) VALUES
('INC-HIST-001', 'Evacuation: North Bank', 'Flood', 85.0, 17.3800, 78.4500, 'HIGH', 'RESOLVED', 'VERIFIED', 8, NOW() - INTERVAL '12 hours'),
('INC-HIST-002', 'Medical Emergency', 'Medical', 40.0, 17.3700, 78.4600, 'MEDIUM', 'RESOLVED', 'VERIFIED', 1, NOW() - INTERVAL '6 hours'),
('INC-HIST-003', 'Rooftop Rescue', 'Flood', 95.0, 17.3650, 78.4200, 'CRITICAL', 'RESOLVED', 'VERIFIED', 4, NOW() - INTERVAL '2 hours');
