import 'dart:math';
import 'package:flutter/material.dart';
import '../../../models/dashboard_models.dart';
import '../../../services/supabase_dashboard_service.dart';
import 'relational_incident_details_modal.dart';

class TacticalMapView extends StatefulWidget {
  final VoidCallback onDataChanged;

  const TacticalMapView({super.key, required this.onDataChanged});

  @override
  State<TacticalMapView> createState() => _TacticalMapViewState();
}

class _TacticalMapViewState extends State<TacticalMapView> {
  IncidentModel? selectedIncident;
  bool showMeshLines = true;
  bool showTeams = true;

  @override
  Widget build(BuildContext context) {
    final service = SupabaseDashboardService.instance;
    final incidents = service.incidents;
    final teams = service.rescueTeams;
    final sosSignals = service.sosSignals;

    return Container(
      color: const Color(0xFF0F172A),
      child: Stack(
        children: [
          // Tactical Map Canvas
          Positioned.fill(
            child: InteractiveViewer(
              maxScale: 3.5,
              minScale: 0.8,
              child: CustomPaint(
                painter: _TacticalRadarPainter(
                  incidents: incidents,
                  teams: teams,
                  sosSignals: sosSignals,
                  showMeshLines: showMeshLines,
                  showTeams: showTeams,
                  selectedIncidentId: selectedIncident?.id,
                ),
              ),
            ),
          ),

          // Top Tactical Controls / Layer Filter Bar
          Positioned(
            top: 16,
            left: 16,
            right: 16,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B).withOpacity(0.92),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.blueGrey.shade700),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.4),
                    blurRadius: 10,
                  ),
                ],
              ),
              child: Row(
                children: [
                  const Icon(Icons.radar, color: Color(0xFF06B6D4), size: 18),
                  const SizedBox(width: 8),
                  const Text(
                    'TACTICAL GEOHASH RADAR',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                      letterSpacing: 0.8,
                    ),
                  ),
                  const Spacer(),
                  FilterChip(
                    label: const Text('Mesh Relays', style: TextStyle(fontSize: 11)),
                    selected: showMeshLines,
                    onSelected: (val) => setState(() => showMeshLines = val),
                    backgroundColor: const Color(0xFF0F172A),
                    selectedColor: const Color(0xFF0284C7),
                    labelStyle: TextStyle(
                      color: showMeshLines ? Colors.white : Colors.blueGrey.shade300,
                    ),
                    padding: EdgeInsets.zero,
                  ),
                  const SizedBox(width: 6),
                  FilterChip(
                    label: const Text('Teams', style: TextStyle(fontSize: 11)),
                    selected: showTeams,
                    onSelected: (val) => setState(() => showTeams = val),
                    backgroundColor: const Color(0xFF0F172A),
                    selectedColor: const Color(0xFF10B981),
                    labelStyle: TextStyle(
                      color: showTeams ? Colors.white : Colors.blueGrey.shade300,
                    ),
                    padding: EdgeInsets.zero,
                  ),
                ],
              ),
            ),
          ),

          // Incident Quick Selection Strip at Bottom
          Positioned(
            bottom: 16,
            left: 16,
            right: 16,
            child: SizedBox(
              height: 84,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: incidents.length,
                itemBuilder: (context, idx) {
                  final inc = incidents[idx];
                  final isCrit = inc.priorityLevel == PriorityLevel.critical;

                  return GestureDetector(
                    onTap: () {
                      RelationalIncidentDetailsModal.show(
                        context,
                        inc,
                        widget.onDataChanged,
                      );
                    },
                    child: Container(
                      width: 250,
                      margin: const EdgeInsets.only(right: 12),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B).withOpacity(0.95),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: isCrit ? Colors.redAccent : const Color(0xFF0284C7),
                          width: 1.5,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.3),
                            blurRadius: 8,
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 8,
                                height: 8,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: isCrit ? Colors.redAccent : Colors.amberAccent,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(
                                  inc.title,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                '${inc.disasterType} • ${inc.status.name.toUpperCase()}',
                                style: TextStyle(
                                  color: Colors.blueGrey.shade300,
                                  fontSize: 11,
                                ),
                              ),
                              const Text(
                                'View Relational ->',
                                style: TextStyle(
                                  color: Color(0xFF38BDF8),
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _TacticalRadarPainter extends CustomPainter {
  final List<IncidentModel> incidents;
  final List<RescueTeamModel> teams;
  final List<SOSSignalModel> sosSignals;
  final bool showMeshLines;
  final bool showTeams;
  final String? selectedIncidentId;

  _TacticalRadarPainter({
    required this.incidents,
    required this.teams,
    required this.sosSignals,
    required this.showMeshLines,
    required this.showTeams,
    this.selectedIncidentId,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = min(size.width, size.height) * 0.44;

    // Background Grid Lines
    final gridPaint = Paint()
      ..color = const Color(0xFF1E293B)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    const gridSize = 40.0;
    for (double x = 0; x < size.width; x += gridSize) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), gridPaint);
    }
    for (double y = 0; y < size.height; y += gridSize) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), gridPaint);
    }

    // Concentric Radar Rings
    final ringPaint = Paint()
      ..color = const Color(0xFF0284C7).withOpacity(0.25)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.2;

    for (int i = 1; i <= 4; i++) {
      canvas.drawCircle(center, radius * (i / 4.0), ringPaint);
    }

    // Crosshairs
    final crosshairPaint = Paint()
      ..color = const Color(0xFF0284C7).withOpacity(0.3)
      ..strokeWidth = 1.0;

    canvas.drawLine(Offset(center.dx - radius, center.dy),
        Offset(center.dx + radius, center.dy), crosshairPaint);
    canvas.drawLine(Offset(center.dx, center.dy - radius),
        Offset(center.dx, center.dy + radius), crosshairPaint);

    // Reference Coordinate bounds (centered around Nashik / Disaster Anchor)
    const baseLat = 19.9975;
    const baseLng = 73.7898;
    const geoSpan = 0.04; // ~4.5 km range

    Offset toCanvas(double lat, double lng) {
      final dx = ((lng - baseLng) / geoSpan) * radius;
      final dy = -((lat - baseLat) / geoSpan) * radius;
      return Offset(center.dx + dx, center.dy + dy);
    }

    // 1. Draw BLE Mesh Hop Lines
    if (showMeshLines) {
      final meshLinePaint = Paint()
        ..color = const Color(0xFF38BDF8).withOpacity(0.4)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.2;

      for (final inc in incidents) {
        final incPos = toCanvas(inc.latitude, inc.longitude);
        for (final sId in inc.linkedSosIds) {
          final sosList = sosSignals.where((s) => s.id == sId || s.sosId == sId);
          if (sosList.isNotEmpty) {
            final s = sosList.first;
            final sosPos = toCanvas(s.latitude, s.longitude);
            canvas.drawLine(incPos, sosPos, meshLinePaint);
          }
        }
      }
    }

    // 2. Draw SOS Distress Dots
    for (final s in sosSignals) {
      final pos = toCanvas(s.latitude, s.longitude);
      final dotPaint = Paint()..color = const Color(0xFF38BDF8);
      canvas.drawCircle(pos, 4, dotPaint);
    }

    // 3. Draw Incidents & Danger Radii
    for (final inc in incidents) {
      final pos = toCanvas(inc.latitude, inc.longitude);
      final isCrit = inc.priorityLevel == PriorityLevel.critical;

      final Color col = isCrit
          ? const Color(0xFFEF4444)
          : (inc.priorityLevel == PriorityLevel.high
              ? const Color(0xFFF97316)
              : const Color(0xFFEAB308));

      // Hazard Radius Ring
      final hazardPaint = Paint()
        ..color = col.withOpacity(0.18)
        ..style = PaintingStyle.fill;
      canvas.drawCircle(pos, 22, hazardPaint);

      final hazardBorder = Paint()
        ..color = col.withOpacity(0.6)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.5;
      canvas.drawCircle(pos, 22, hazardBorder);

      // Core Marker
      final markerPaint = Paint()..color = col;
      canvas.drawCircle(pos, 8, markerPaint);

      // Text Label
      final tp = TextPainter(
        text: TextSpan(
          text: inc.incidentId,
          style: TextStyle(
            color: Colors.white,
            fontSize: 10,
            fontWeight: FontWeight.bold,
            backgroundColor: Colors.black87,
          ),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      tp.paint(canvas, Offset(pos.dx - tp.width / 2, pos.dy - 20));
    }

    // 4. Draw Rescue Teams
    if (showTeams) {
      for (final team in teams) {
        final pos = toCanvas(team.latitude, team.longitude);
        final teamPaint = Paint()
          ..color = team.status == TeamStatus.deployed
              ? const Color(0xFF10B981)
              : const Color(0xFF0284C7);

        // Square shield marker for teams
        final rect = Rect.fromCenter(center: pos, width: 14, height: 14);
        canvas.drawRect(rect, teamPaint);

        final tp = TextPainter(
          text: TextSpan(
            text: team.callsign.split(' ').first,
            style: const TextStyle(
              color: Colors.greenAccent,
              fontSize: 9,
              fontWeight: FontWeight.bold,
              backgroundColor: Colors.black87,
            ),
          ),
          textDirection: TextDirection.ltr,
        )..layout();
        tp.paint(canvas, Offset(pos.dx - tp.width / 2, pos.dy + 10));
      }
    }
  }

  @override
  bool shouldRepaint(covariant _TacticalRadarPainter oldDelegate) => true;
}
