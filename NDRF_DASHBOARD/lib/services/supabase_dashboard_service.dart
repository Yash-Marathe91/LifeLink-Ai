import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/dashboard_models.dart';

/// Supabase & Local Relational Emergency Data Service
class SupabaseDashboardService {
  static final SupabaseDashboardService instance =
      SupabaseDashboardService._internal();

  SupabaseDashboardService._internal();

  String supabaseUrl = 'https://jamlthqscbvbasuvrkjq.supabase.co';
  String supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbWx0aHFzY2J2YmFzdXZya2pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NjI3NjksImV4cCI6MjEwNjIzODc2OX0.8N9EclKJj4dwJR4CT9pnS9jUKaLERZihRK7_TXoKZz4';
  bool isConnectedToCloud = false;

  final List<IncidentModel> _incidents = [];
  final List<RescueTeamModel> _rescueTeams = [];
  final List<SOSSignalModel> _sosSignals = [];
  final List<DisasterReportModel> _disasterReports = [];

  bool _isInitialized = false;

  List<IncidentModel> get incidents => List.unmodifiable(_incidents);
  List<RescueTeamModel> get rescueTeams => List.unmodifiable(_rescueTeams);
  List<SOSSignalModel> get sosSignals => List.unmodifiable(_sosSignals);
  List<DisasterReportModel> get disasterReports =>
      List.unmodifiable(_disasterReports);

  Future<void> initialize({String? customUrl, String? customKey}) async {
    if (_isInitialized && customUrl == null) return;

    if (customUrl != null) supabaseUrl = customUrl;
    if (customKey != null) supabaseAnonKey = customKey;

    _populateDefaultRelationalData();
    await _loadFromLocalStorage();

    if (supabaseUrl.startsWith('http') &&
        !supabaseUrl.contains('your-project-id')) {
      _testSupabaseConnection();
    }

    _isInitialized = true;
  }

  void _populateDefaultRelationalData() {
    _rescueTeams.clear();
    _incidents.clear();
    _sosSignals.clear();
    _disasterReports.clear();

    final teamWater = RescueTeamModel(
      id: 'team-ndrf-01',
      teamId: 'NDRF-W-01',
      callsign: 'NDRF Water Rescue Bravo-1',
      unitType: 'NDRF_WATER_RESCUE',
      status: TeamStatus.deployed,
      latitude: 19.9912,
      longitude: 73.7811,
      equipment: ['INFLATABLE_MOTORBOAT', 'LIFE_JACKETS'],
      capacityVictims: 12,
      currentActiveMissions: 1,
      contactChannel: 'VHF-156.800',
    );

    final teamUsar = RescueTeamModel(
      id: 'team-ndrf-02',
      teamId: 'NDRF-U-03',
      callsign: 'NDRF USAR Alpha-3',
      unitType: 'NDRF_COLLAPSE_USAR',
      status: TeamStatus.available,
      latitude: 20.0051,
      longitude: 73.7925,
      equipment: ['HYDRAULIC_CUTTER', 'SEARCH_CAMERAS'],
      capacityVictims: 6,
      currentActiveMissions: 0,
      contactChannel: 'VHF-156.825',
    );

    _rescueTeams.addAll([teamWater, teamUsar]);

    final sos1 = SOSSignalModel(
      id: 'sos-001',
      sosId: 'SOS-84192',
      emergencyType: 'Medical',
      latitude: 19.9925,
      longitude: 73.7842,
      accuracyMeters: 5.0,
      status: 'DISPATCHED',
      transportSource: 'BLE_MESH',
      batteryPct: 38,
      voiceDurationSeconds: 14,
      hazards: {'rising_water': true},
      createdAt: DateTime.now().subtract(const Duration(minutes: 25)),
    );

    _sosSignals.add(sos1);

    final dis1 = DisasterReportModel(
      id: 'dis-001',
      reportId: 'LL-1712839001',
      disasterType: 'Flood',
      severity: 'High',
      description: 'Godavari river overflowing.',
      latitude: 19.9928,
      longitude: 73.7845,
      locationName: 'Ramkund Riverbank Zone',
      photoUrl:
          'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
      status: 'VERIFIED',
      createdAt: DateTime.now().subtract(const Duration(minutes: 30)),
    );

    _disasterReports.add(dis1);

    final inc1 = IncidentModel(
      id: 'inc-001',
      incidentId: 'INC-2026-001',
      title: 'Godavari Riverbank Inundation',
      disasterType: 'Flood',
      status: IncidentStatus.dispatched,
      priorityScore: 94.5,
      priorityLevel: PriorityLevel.critical,
      latitude: 19.9927,
      longitude: 73.7845,
      affectedCount: 10,
      assignedTeamId: teamWater.teamId,
      severity: 'CRITICAL',
      verificationStatus: 'VERIFIED',
      explanation: 'Multi-agent consensus: Rapid flood surge.',
      agentBreakdown: {
        'severity': {'score': 92, 'rationale': 'Rapid water rise'},
        'medical': {'score': 96, 'rationale': 'Elderly patient trapped'},
      },
      createdAt: DateTime.now().subtract(const Duration(minutes: 28)),
      linkedSosIds: [sos1.sosId],
      linkedDisasterReportIds: [dis1.reportId],
    );

    _incidents.add(inc1);
  }

  Future<void> _loadFromLocalStorage() async {
    try {
      final prefs = await SharedPreferences.getInstance();

      final disasterRaw = prefs.getString('latest_report');
      if (disasterRaw != null) {
        final Map<String, dynamic> data = jsonDecode(disasterRaw);
        final reportId = data['reportId']?.toString() ??
            'LL-${DateTime.now().millisecondsSinceEpoch}';

        if (!_disasterReports.any((d) => d.reportId == reportId)) {
          final localDis = DisasterReportModel(
            id: 'local-dis-${DateTime.now().millisecondsSinceEpoch}',
            reportId: reportId,
            disasterType: data['disaster']?.toString() ?? 'Other',
            severity: data['severity']?.toString() ?? 'Medium',
            description: data['description']?.toString() ?? 'Local Report',
            latitude: (data['latitude'] as num?)?.toDouble() ?? 19.9975,
            longitude: (data['longitude'] as num?)?.toDouble() ?? 73.7898,
            locationName: data['location']?.toString() ?? 'Current Device GPS',
            photoPath: data['photoPath']?.toString(),
            status: data['status']?.toString() ?? 'PENDING',
            createdAt: DateTime.now(),
          );
          _disasterReports.insert(0, localDis);
          _clusterIntoIncident(disaster: localDis);
        }
      }

      final sosRaw = prefs.getString('latest_sos');
      if (sosRaw != null) {
        final Map<String, dynamic> data = jsonDecode(sosRaw);
        final sosId = data['sosId']?.toString() ??
            'SOS-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';

        if (!_sosSignals.any((s) => s.sosId == sosId)) {
          final localSos = SOSSignalModel(
            id: 'local-sos-${DateTime.now().millisecondsSinceEpoch}',
            sosId: sosId,
            emergencyType: data['type']?.toString() ?? 'Medical',
            latitude: (data['latitude'] as num?)?.toDouble() ?? 19.9975,
            longitude: (data['longitude'] as num?)?.toDouble() ?? 73.7898,
            accuracyMeters: 5.0,
            status: data['status']?.toString() ?? 'RELAY_PENDING',
            transportSource: 'BLE_MESH',
            batteryPct: 90,
            voicePath: data['voicePath']?.toString(),
            voiceDurationSeconds: 10,
            hazards: {},
            createdAt: DateTime.now(),
          );
          _sosSignals.insert(0, localSos);
          _clusterIntoIncident(sos: localSos);
        }
      }
    } catch (e) {
      debugPrint('Error reading local storage: $e');
    }
  }

  void _clusterIntoIncident({SOSSignalModel? sos, DisasterReportModel? disaster}) {
    final title = disaster != null
        ? '${disaster.disasterType} Alert: ${disaster.locationName}'
        : 'Emergency ${sos?.emergencyType} Distress Signal';

    final category = disaster?.disasterType ?? sos?.emergencyType ?? 'Other';
    final lat = disaster?.latitude ?? sos?.latitude ?? 19.9975;
    final lng = disaster?.longitude ?? sos?.longitude ?? 73.7898;

    final newInc = IncidentModel(
      id: 'inc-dyn-${DateTime.now().millisecondsSinceEpoch}',
      incidentId: 'INC-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}',
      title: title,
      disasterType: category,
      status: IncidentStatus.triaged,
      priorityScore: 78.5,
      priorityLevel: PriorityLevel.high,
      latitude: lat,
      longitude: lng,
      affectedCount: 1,
      assignedTeamId: null,
      severity: 'HIGH',
      verificationStatus: 'UNVERIFIED',
      explanation: 'Real-time local event ingested.',
      agentBreakdown: {
        'severity': {'score': 75, 'rationale': 'Citizen report received.'},
      },
      createdAt: DateTime.now(),
      linkedSosIds: sos != null ? [sos.sosId] : [],
      linkedDisasterReportIds: disaster != null ? [disaster.reportId] : [],
    );

    _incidents.insert(0, newInc);
  }

  Future<void> _testSupabaseConnection() async {
    try {
      final client = HttpClient();
      final uri = Uri.parse('$supabaseUrl/rest/v1/incidents?select=count');
      final request = await client.getUrl(uri);
      request.headers.set('apikey', supabaseAnonKey);
      request.headers.set('Authorization', 'Bearer $supabaseAnonKey');
      final response = await request.close().timeout(const Duration(seconds: 4));
      isConnectedToCloud = (response.statusCode >= 200 && response.statusCode < 300);
      client.close();
    } catch (_) {
      isConnectedToCloud = false;
    }
  }

  List<SOSSignalModel> getLinkedSos(IncidentModel incident) {
    return _sosSignals.where((s) => incident.linkedSosIds.contains(s.sosId)).toList();
  }

  List<DisasterReportModel> getLinkedDisasterReports(IncidentModel incident) {
    return _disasterReports.where((d) => incident.linkedDisasterReportIds.contains(d.reportId)).toList();
  }

  RescueTeamModel? getAssignedTeam(IncidentModel incident) {
    if (incident.assignedTeamId == null) return null;
    try {
      return _rescueTeams.firstWhere((t) => t.teamId == incident.assignedTeamId);
    } catch (_) {
      return null;
    }
  }

  void dispatchTeam(String incidentId, String teamId) {
    try {
      final inc = _incidents.firstWhere((i) => i.incidentId == incidentId);
      final team = _rescueTeams.firstWhere((t) => t.teamId == teamId);

      inc.assignedTeamId = teamId;
      inc.status = IncidentStatus.dispatched;
      team.status = TeamStatus.deployed;
      team.currentActiveMissions += 1;

      for (final sId in inc.linkedSosIds) {
        for (final s in _sosSignals) {
          if (s.sosId == sId) {
            s.status = 'DISPATCHED';
          }
        }
      }
    } catch (e) {
      debugPrint('Error dispatching team: $e');
    }
  }

  void updateIncidentStatus(String incidentId, IncidentStatus newStatus) {
    try {
      final inc = _incidents.firstWhere((i) => i.incidentId == incidentId);
      inc.status = newStatus;

      if (newStatus == IncidentStatus.resolved && inc.assignedTeamId != null) {
        final team = getAssignedTeam(inc);
        if (team != null) {
          team.currentActiveMissions = (team.currentActiveMissions - 1).clamp(0, 99);
          if (team.currentActiveMissions == 0) {
            team.status = TeamStatus.available;
          }
        }
      }
    } catch (e) {
      debugPrint('Error updating incident status: $e');
    }
  }

  Map<String, dynamic> calculateMetrics() {
    final totalIncidents = _incidents.length;
    final totalSos = _sosSignals.length;
    final totalDisasterReports = _disasterReports.length;
    final criticalIncidents = _incidents.where((i) => i.priorityLevel == PriorityLevel.critical).length;
    final activeDispatches = _incidents.where((i) => i.status == IncidentStatus.dispatched).length;
    final resolvedIncidents = _incidents.where((i) => i.status == IncidentStatus.resolved).length;
    final deployedTeams = _rescueTeams.where((t) => t.status == TeamStatus.deployed).length;
    final totalAffected = _incidents.fold<int>(0, (sum, i) => sum + i.affectedCount);

    final Map<String, int> categoryCount = {};
    for (final inc in _incidents) {
      categoryCount[inc.disasterType] = (categoryCount[inc.disasterType] ?? 0) + 1;
    }

    final Map<String, int> severityCount = {
      'Critical': _incidents.where((i) => i.priorityLevel == PriorityLevel.critical).length,
      'High': _incidents.where((i) => i.priorityLevel == PriorityLevel.high).length,
      'Medium': _incidents.where((i) => i.priorityLevel == PriorityLevel.medium).length,
      'Low': _incidents.where((i) => i.priorityLevel == PriorityLevel.low).length,
    };

    return {
      'totalIncidents': totalIncidents,
      'totalSos': totalSos,
      'totalDisasterReports': totalDisasterReports,
      'criticalIncidents': criticalIncidents,
      'activeDispatches': activeDispatches,
      'resolvedIncidents': resolvedIncidents,
      'deployedTeams': deployedTeams,
      'totalAffected': totalAffected,
      'categoryCount': categoryCount,
      'severityCount': severityCount,
      'averageResponseMinutes': 9.2,
      'meshRelayRatePercentage': 75.0,
    };
  }
}
