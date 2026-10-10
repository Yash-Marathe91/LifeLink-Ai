import 'dart:convert';

/// Emergency Severity Categories
enum PriorityLevel { critical, high, medium, low }

/// Operational Status of an Incident
enum IncidentStatus { triaged, assigned, dispatched, enRoute, resolved }

/// Operational Status of a Rescue Team
enum TeamStatus { available, enRoute, deployed, standby, maintenance }

/// Model representing a Clustered & Triaged Incident
class IncidentModel {
  final String id;
  final String incidentId;
  final String? primarySosId;
  final String title;
  final String disasterType;
  IncidentStatus status;
  final double priorityScore;
  final PriorityLevel priorityLevel;
  final double latitude;
  final double longitude;
  final int affectedCount;
  final int reportedInjuries;
  final String? address;
  final String severity;
  final String verificationStatus;
  final String? description;
  final List<String> images;
  String? assignedTeamId;
  final String explanation;
  final Map<String, dynamic> agentBreakdown;
  final Map<String, dynamic>? aiPriorityFactors;
  final DateTime createdAt;

  // Relational references
  List<String> linkedSosIds;
  List<String> linkedDisasterReportIds;

  IncidentModel({
    required this.id,
    required this.incidentId,
    this.primarySosId,
    required this.title,
    required this.disasterType,
    required this.status,
    required this.priorityScore,
    required this.priorityLevel,
    required this.latitude,
    required this.longitude,
    required this.affectedCount,
    this.reportedInjuries = 0,
    this.address,
    required this.severity,
    required this.verificationStatus,
    this.description,
    this.images = const [],
    this.assignedTeamId,
    required this.explanation,
    required this.agentBreakdown,
    this.aiPriorityFactors,
    required this.createdAt,
    List<String>? linkedSosIds,
    List<String>? linkedDisasterReportIds,
  })  : linkedSosIds = linkedSosIds ?? [],
        linkedDisasterReportIds = linkedDisasterReportIds ?? [];

  factory IncidentModel.fromJson(Map<String, dynamic> json) {
    IncidentStatus parseStatus(String? s) {
      switch (s?.toUpperCase()) {
        case 'ASSIGNED':
          return IncidentStatus.assigned;
        case 'DISPATCHED':
          return IncidentStatus.dispatched;
        case 'EN_ROUTE':
          return IncidentStatus.enRoute;
        case 'RESOLVED':
          return IncidentStatus.resolved;
        default:
          return IncidentStatus.triaged;
      }
    }

    PriorityLevel parsePriority(String? p) {
      switch (p?.toUpperCase()) {
        case 'CRITICAL':
          return PriorityLevel.critical;
        case 'HIGH':
          return PriorityLevel.high;
        case 'LOW':
          return PriorityLevel.low;
        default:
          return PriorityLevel.medium;
      }
    }

    Map<String, dynamic> parseAgentBreakdown(dynamic v) {
      if (v is Map<String, dynamic>) return v;
      if (v is String) {
        try {
          return jsonDecode(v);
        } catch (_) {}
      }
      return {};
    }

    return IncidentModel(
      id: json['id']?.toString() ?? '',
      incidentId: json['incident_id']?.toString() ?? 'INC-001',
      primarySosId: json['primary_sos_id']?.toString(),
      title: json['title']?.toString() ?? 'Emergency Incident',
      disasterType: json['disaster_type']?.toString() ?? 'Other',
      status: parseStatus(json['status']?.toString()),
      priorityScore: (json['priority_score'] as num?)?.toDouble() ?? 50.0,
      priorityLevel: parsePriority(json['category']?.toString()),
      latitude: (json['latitude'] as num?)?.toDouble() ?? 19.9975,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 73.7898,
      address: json['address']?.toString(),
      severity: json['severity']?.toString() ?? 'MEDIUM',
      verificationStatus: json['verification_status']?.toString() ?? 'UNVERIFIED',
      affectedCount: (json['total_affected'] as num?)?.toInt() ?? 1,
      reportedInjuries: (json['reported_injuries'] as num?)?.toInt() ?? 0,
      description: json['description']?.toString(),
      images: (json['images'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      assignedTeamId: json['assigned_team_id']?.toString(),
      explanation: json['explanation']?.toString() ?? '',
      agentBreakdown: parseAgentBreakdown(json['agent_breakdown']),
      aiPriorityFactors: json['ai_priority_factors'] as Map<String, dynamic>?,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}

/// Model representing a Citizen SOS Distress Signal (sos_alerts)
class SOSSignalModel {
  final String id;
  final String sosId;
  final String emergencyType;
  final double latitude;
  final double longitude;
  final double accuracyMeters;
  String status;
  final String transportSource;
  final int batteryPct;
  final String? voiceUrl;
  final String? voicePath;
  final int voiceDurationSeconds;
  final Map<String, dynamic> hazards;
  final String? note;
  final DateTime createdAt;

  SOSSignalModel({
    required this.id,
    required this.sosId,
    required this.emergencyType,
    required this.latitude,
    required this.longitude,
    required this.accuracyMeters,
    required this.status,
    required this.transportSource,
    required this.batteryPct,
    this.voiceUrl,
    this.voicePath,
    required this.voiceDurationSeconds,
    required this.hazards,
    this.note,
    required this.createdAt,
  });

  factory SOSSignalModel.fromJson(Map<String, dynamic> json) {
    Map<String, dynamic> parseHazards(dynamic v) {
      if (v is Map<String, dynamic>) return v;
      if (v is String) {
        try {
          return jsonDecode(v);
        } catch (_) {}
      }
      return {};
    }

    return SOSSignalModel(
      id: json['id']?.toString() ?? '',
      sosId: json['sos_id']?.toString() ?? 'SOS-000',
      emergencyType: json['emergency_type']?.toString() ?? 'Other',
      latitude: (json['latitude'] as num?)?.toDouble() ?? 19.99,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 73.78,
      accuracyMeters: (json['accuracy_meters'] as num?)?.toDouble() ?? 10.0,
      status: json['status']?.toString() ?? 'RELAY_PENDING',
      transportSource: json['transport_source']?.toString() ?? 'BLE_MESH',
      batteryPct: (json['battery_pct'] as num?)?.toInt() ?? 100,
      voiceUrl: json['voice_url']?.toString(),
      voicePath: json['voice_path']?.toString(),
      voiceDurationSeconds: (json['voice_duration_seconds'] as num?)?.toInt() ?? 0,
      hazards: parseHazards(json['hazards']),
      note: json['note']?.toString(),
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}

/// Model representing a Citizen Disaster Report
class DisasterReportModel {
  final String id;
  final String reportId;
  final String disasterType;
  final String severity;
  final String description;
  final double latitude;
  final double longitude;
  final String locationName;
  final String? photoUrl;
  final String? photoPath;
  String status;
  final DateTime createdAt;

  DisasterReportModel({
    required this.id,
    required this.reportId,
    required this.disasterType,
    required this.severity,
    required this.description,
    required this.latitude,
    required this.longitude,
    required this.locationName,
    this.photoUrl,
    this.photoPath,
    required this.status,
    required this.createdAt,
  });

  factory DisasterReportModel.fromJson(Map<String, dynamic> json) {
    return DisasterReportModel(
      id: json['id']?.toString() ?? '',
      reportId: json['report_id']?.toString() ?? 'LL-000',
      disasterType: json['disaster_type']?.toString() ?? 'Other',
      severity: json['severity']?.toString() ?? 'Medium',
      description: json['description']?.toString() ?? '',
      latitude: (json['latitude'] as num?)?.toDouble() ?? 19.99,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 73.78,
      locationName: json['location_name']?.toString() ?? 'GPS Tagged',
      photoUrl: json['photo_url']?.toString(),
      photoPath: json['photo_path']?.toString(),
      status: json['status']?.toString() ?? 'PENDING',
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}

/// Model representing a Rescue Team
class RescueTeamModel {
  final String id;
  final String teamId;
  final String callsign;
  final String unitType;
  TeamStatus status;
  final double latitude;
  final double longitude;
  final List<String> equipment;
  final int capacityVictims;
  int currentActiveMissions;
  final String contactChannel;

  RescueTeamModel({
    required this.id,
    required this.teamId,
    required this.callsign,
    required this.unitType,
    required this.status,
    required this.latitude,
    required this.longitude,
    required this.equipment,
    required this.capacityVictims,
    required this.currentActiveMissions,
    required this.contactChannel,
  });

  factory RescueTeamModel.fromJson(Map<String, dynamic> json) {
    TeamStatus parseStatus(String? s) {
      switch (s?.toUpperCase()) {
        case 'DEPLOYED':
          return TeamStatus.deployed;
        case 'EN_ROUTE':
          return TeamStatus.enRoute;
        case 'STANDBY':
          return TeamStatus.standby;
        case 'MAINTENANCE':
          return TeamStatus.maintenance;
        default:
          return TeamStatus.available;
      }
    }

    List<String> parseEquipment(dynamic eq) {
      if (eq is List) {
        return eq.map((e) => e.toString()).toList();
      }
      return [];
    }

    return RescueTeamModel(
      id: json['id']?.toString() ?? '',
      teamId: json['team_id']?.toString() ?? 'TEAM-000',
      callsign: json['callsign']?.toString() ?? 'Rescue Unit',
      unitType: json['unit_type']?.toString() ?? 'GENERAL_EVAC',
      status: parseStatus(json['current_status']?.toString()),
      latitude: (json['latitude'] as num?)?.toDouble() ?? 19.99,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 73.78,
      equipment: parseEquipment(json['equipment']),
      capacityVictims: (json['capacity_victims'] as num?)?.toInt() ?? 8,
      currentActiveMissions: (json['current_active_missions'] as num?)?.toInt() ?? 0,
      contactChannel: json['contact_channel']?.toString() ?? 'VHF_146.5',
    );
  }
}
