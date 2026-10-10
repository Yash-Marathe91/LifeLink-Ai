// LifeLink AI - SOS Packet Dart Model
// Mirrors the compact binary protocol and BitChat BLE mesh format

import 'dart:typed_data';
import 'package:uuid/uuid.dart';

enum EmergencyType {
  unknown(0),
  medical(1),
  floodDrowning(2),
  fireSmoke(3),
  earthquakeTrapped(4),
  structuralCollapse(5),
  landslide(6),
  evacuationNeeded(7);

  final int value;
  const EmergencyType(this.value);
}

enum MedicalUrgency {
  none(0),
  minorInjury(1),
  severeTraumaBleeding(2),
  hypothermiaShock(3),
  criticalLifeSupport(4),
  unconscious(5);

  final int value;
  const MedicalUrgency(this.value);
}

class SOSPacket {
  final String sosId;
  final int timestamp;
  final double latitude;
  final double longitude;
  final int accuracyMeters;
  final int batteryPct;
  final EmergencyType emergencyType;
  final MedicalUrgency medicalUrgency;
  final int totalPeople;
  final int elderlyCount;
  final int childrenCount;
  final int vulnerableCount;
  final Map<String, bool> hazards;
  final String note;
  int ttl;

  SOSPacket({
    String? sosId,
    int? timestamp,
    required this.latitude,
    required this.longitude,
    this.accuracyMeters = 10,
    required this.batteryPct,
    this.emergencyType = EmergencyType.medical,
    this.medicalUrgency = MedicalUrgency.none,
    this.totalPeople = 1,
    this.elderlyCount = 0,
    this.childrenCount = 0,
    this.vulnerableCount = 0,
    required this.hazards,
    this.note = '',
    this.ttl = 7,
  })  : sosId = sosId ?? const Uuid().v4(),
        timestamp = timestamp ?? DateTime.now().millisecondsSinceEpoch ~/ 1000;

  Map<String, dynamic> toJson() => {
        'sos_id': sosId,
        'timestamp': timestamp,
        'latitude': latitude,
        'longitude': longitude,
        'accuracy_meters': accuracyMeters,
        'battery_pct': batteryPct,
        'emergency_type': emergencyType.value,
        'medical_urgency': medicalUrgency.value,
        'total_people': totalPeople,
        'elderly_count': elderlyCount,
        'children_count': childrenCount,
        'vulnerable_count': vulnerableCount,
        'hazards': hazards,
        'note': note,
        'ttl': ttl,
      };

  factory SOSPacket.fromJson(Map<String, dynamic> json) => SOSPacket(
        sosId: json['sos_id'],
        timestamp: json['timestamp'],
        latitude: (json['latitude'] as num).toDouble(),
        longitude: (json['longitude'] as num).toDouble(),
        accuracyMeters: json['accuracy_meters'] ?? 10,
        batteryPct: json['battery_pct'] ?? 100,
        emergencyType: EmergencyType.values.firstWhere(
          (e) => e.value == json['emergency_type'],
          orElse: () => EmergencyType.medical,
        ),
        medicalUrgency: MedicalUrgency.values.firstWhere(
          (e) => e.value == json['medical_urgency'],
          orElse: () => MedicalUrgency.none,
        ),
        totalPeople: json['total_people'] ?? 1,
        elderlyCount: json['elderly_count'] ?? 0,
        childrenCount: json['children_count'] ?? 0,
        vulnerableCount: json['vulnerable_count'] ?? 0,
        hazards: Map<String, bool>.from(json['hazards'] ?? {}),
        note: json['note'] ?? '',
        ttl: json['ttl'] ?? 7,
      );
}
