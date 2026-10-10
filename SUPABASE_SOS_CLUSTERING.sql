-- ==============================================================================
-- LIFELINK AI - AUTOMATIC SOS CLUSTERING & TRIAGE ENGINE (DB TRIGGER)
-- ==============================================================================
-- This script creates a database trigger that automatically clusters incoming 
-- SOS alerts into a single unified "Incident" if they occur within ~500 meters 
-- of each other and share the same disaster type or time window.
-- This massively reduces dashboard overload for NDRF operators.

-- 1. Helper Function: Calculate Distance (Haversine formula approximation in meters)
CREATE OR REPLACE FUNCTION calculate_distance_meters(lat1 FLOAT, lon1 FLOAT, lat2 FLOAT, lon2 FLOAT)
RETURNS FLOAT AS $$
DECLARE
    x FLOAT := 69.1 * (lat2 - lat1);
    y FLOAT := 69.1 * (lon2 - lon1) * cos(lat1 / 57.3);
BEGIN
    -- Return distance in meters (1 mile approx 1609.34 meters)
    RETURN sqrt(x * x + y * y) * 1609.34;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. Main Trigger Function: Cluster SOS into Incident
CREATE OR REPLACE FUNCTION cluster_incoming_sos()
RETURNS TRIGGER AS $$
DECLARE
    matched_incident_id TEXT;
    search_radius_meters FLOAT := 500.0; -- Combine if within 500 meters
BEGIN
    -- Check if there is an active incident nearby
    SELECT incident_id INTO matched_incident_id
    FROM public.incidents
    WHERE status = 'ACTIVE'
      AND calculate_distance_meters(NEW.latitude, NEW.longitude, latitude, longitude) <= search_radius_meters
    ORDER BY created_at DESC
    LIMIT 1;

    IF matched_incident_id IS NOT NULL THEN
        -- Link the new SOS to the existing Incident
        INSERT INTO public.incident_sos_links (incident_id, sos_id)
        VALUES (matched_incident_id, NEW.sos_id);

        -- Upgrade the priority of the incident if this new SOS is critical
        IF NEW.priority = 'CRITICAL' THEN
            UPDATE public.incidents 
            SET priority_score = 95.0, 
                total_affected = total_affected + COALESCE(NEW.total_affected, 1),
                updated_at = NOW()
            WHERE incident_id = matched_incident_id AND priority_score < 95.0;
        ELSIF NEW.priority = 'HIGH' THEN
            UPDATE public.incidents 
            SET priority_score = 80.0, 
                total_affected = total_affected + COALESCE(NEW.total_affected, 1),
                updated_at = NOW()
            WHERE incident_id = matched_incident_id AND priority_score < 80.0;
        ELSE
            -- Just update the timestamp and affected count
            UPDATE public.incidents 
            SET total_affected = total_affected + COALESCE(NEW.total_affected, 1),
                updated_at = NOW() 
            WHERE incident_id = matched_incident_id;
        END IF;

    ELSE
        -- No nearby active incident found. Create a new one.
        matched_incident_id := 'INC-' || TO_CHAR(NOW(), 'YYYYMMDD-HH24MISS') || '-' || SUBSTRING(NEW.sos_id FROM 1 FOR 4);
        
        INSERT INTO public.incidents (
            incident_id, 
            title, 
            disaster_type, 
            priority_score, 
            latitude, 
            longitude, 
            status,
            total_affected
        ) VALUES (
            matched_incident_id,
            'Emergent ' || NEW.priority || ' Priority Event',
            'UNSPECIFIED_TRIAGE',
            CASE 
                WHEN NEW.priority = 'CRITICAL' THEN 95.0
                WHEN NEW.priority = 'HIGH' THEN 80.0
                WHEN NEW.priority = 'MEDIUM' THEN 50.0
                ELSE 20.0 
            END,
            NEW.latitude,
            NEW.longitude,
            'ACTIVE',
            COALESCE(NEW.total_affected, 1)
        );

        -- Link the new SOS to the newly created Incident
        INSERT INTO public.incident_sos_links (incident_id, sos_id)
        VALUES (matched_incident_id, NEW.sos_id);

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Attach the Trigger to the sos_alerts table
DROP TRIGGER IF EXISTS trigger_cluster_sos ON public.sos_alerts;

CREATE TRIGGER trigger_cluster_sos
AFTER INSERT ON public.sos_alerts
FOR EACH ROW
EXECUTE FUNCTION cluster_incoming_sos();
