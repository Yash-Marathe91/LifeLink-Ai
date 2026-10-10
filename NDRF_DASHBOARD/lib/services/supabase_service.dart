import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/dashboard_models.dart';

class SupabaseService {
  static final SupabaseService instance = SupabaseService._internal();
  SupabaseService._internal();

  final SupabaseClient client = Supabase.instance.client;

  // Streams for Real-Time UI Updates
  Stream<List<IncidentModel>> getIncidentsStream() {
    return client
        .from('incidents')
        .stream(primaryKey: ['id'])
        .order('created_at', ascending: false)
        .map((data) => data.map((e) => IncidentModel.fromJson(e)).toList());
  }

  Stream<List<SOSSignalModel>> getSOSStream() {
    return client
        .from('sos_alerts')
        .stream(primaryKey: ['id'])
        .order('created_at', ascending: false)
        .map((data) => data.map((e) => SOSSignalModel.fromJson(e)).toList());
  }

  Stream<List<RescueTeamModel>> getTeamsStream() {
    return client
        .from('rescue_teams')
        .stream(primaryKey: ['id'])
        .map((data) => data.map((e) => RescueTeamModel.fromJson(e)).toList());
  }

  // CRUD Operations
  Future<void> updateIncidentStatus(String incidentId, String status) async {
    await client
        .from('incidents')
        .update({'status': status})
        .eq('incident_id', incidentId);
  }

  Future<void> assignTeamToIncident(String incidentId, String teamId) async {
    await client
        .from('incidents')
        .update({'assigned_team_id': teamId, 'status': 'DISPATCHED'})
        .eq('incident_id', incidentId);
        
    // Update team status to deployed
    final teamData = await client.from('rescue_teams').select('current_active_missions').eq('team_id', teamId).single();
    final missions = (teamData['current_active_missions'] as int) + 1;
    
    await client
        .from('rescue_teams')
        .update({
          'current_status': 'DEPLOYED',
          'current_active_missions': missions
        })
        .eq('team_id', teamId);
  }
  
  Future<void> deleteIncident(String incidentId) async {
    await client.from('incidents').delete().eq('incident_id', incidentId);
  }
  
  Future<void> deleteSOS(String sosId) async {
    await client.from('sos_alerts').delete().eq('sos_id', sosId);
  }

  Future<void> createRescueTeam(RescueTeamModel team) async {
    await client.from('rescue_teams').insert({
      'team_id': team.teamId,
      'callsign': team.callsign,
      'unit_type': team.unitType,
      'current_status': team.status.name.toUpperCase(),
      'latitude': team.latitude,
      'longitude': team.longitude,
      'equipment': team.equipment,
      'capacity_victims': team.capacityVictims,
      'current_active_missions': team.currentActiveMissions,
      'contact_channel': team.contactChannel,
    });
  }

  Future<void> deleteTeam(String teamId) async {
    await client.from('rescue_teams').delete().eq('team_id', teamId);
  }
}
