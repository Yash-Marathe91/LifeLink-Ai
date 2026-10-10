import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:animate_do/animate_do.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import '../../models/dashboard_models.dart';
import '../../services/supabase_service.dart';
import '../../musi_zone.dart';

class OverviewScreen extends StatefulWidget {
  const OverviewScreen({super.key});

  @override
  State<OverviewScreen> createState() => _OverviewScreenState();
}

class _OverviewScreenState extends State<OverviewScreen> {
  final _service = SupabaseService.instance;
  final MapController _mapController = MapController();

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF0F172A),
      child: Row(
        children: [
          // LEFT PANEL: Dense Log / Feed (250px)
          _buildLeftFeedPanel(),

          // CENTER PANEL: Huge Map (Expanded)
          Expanded(
            flex: 5,
            child: Stack(
              children: [
                _buildMapLayer(),
                Positioned(
                  top: 16,
                  left: 16,
                  right: 16,
                  child: _buildHUDMetrics(),
                ),
                Positioned(
                  bottom: 16,
                  left: 16,
                  right: 16,
                  height: 140,
                  child: _buildBottomTelemetryStrip(),
                ),
              ],
            ),
          ),

          // RIGHT PANEL: Dense Analytics (320px)
          _buildRightAnalyticsPanel(),
        ],
      ),
    );
  }

  // ==========================================
  // LEFT: DENSE FEED
  // ==========================================
  Widget _buildLeftFeedPanel() {
    return Container(
      width: 260,
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        border: Border(right: BorderSide(color: Colors.white.withOpacity(0.1))),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            color: const Color(0xFF0284C7).withOpacity(0.2),
            child: const Text(
              'LIVE DISPATCH FEED',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1.5),
            ),
          ),
          Expanded(
            child: StreamBuilder<List<IncidentModel>>(
              stream: _service.getIncidentsStream(),
              builder: (context, snapshot) {
                final incidents = snapshot.data ?? [];
                return ListView.separated(
                  padding: const EdgeInsets.all(8),
                  itemCount: incidents.length,
                  separatorBuilder: (_, __) => Divider(color: Colors.white.withOpacity(0.05)),
                  itemBuilder: (context, index) {
                    final inc = incidents[index];
                    final isCrit = inc.priorityScore >= 80;
                    return InkWell(
                      onTap: () => _mapController.move(LatLng(inc.latitude, inc.longitude), 15.0),
                      child: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: isCrit ? Colors.red.withOpacity(0.1) : Colors.transparent,
                          borderRadius: BorderRadius.circular(8),
                          border: isCrit ? Border.all(color: Colors.red.withOpacity(0.3)) : null,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(isCrit ? Icons.warning : Icons.info_outline, size: 14, color: isCrit ? Colors.redAccent : Colors.blueAccent),
                                const SizedBox(width: 6),
                                Text(inc.incidentId, style: TextStyle(color: Colors.blueGrey.shade300, fontSize: 10)),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(inc.title, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
                            const SizedBox(height: 4),
                            Text('${inc.latitude.toStringAsFixed(3)}, ${inc.longitude.toStringAsFixed(3)}', style: const TextStyle(color: Colors.cyan, fontSize: 10)),
                          ],
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          )
        ],
      ),
    );
  }

  // ==========================================
  // CENTER: MAP & HUD
  // ==========================================
  Widget _buildMapLayer() {
    final mapboxToken = dotenv.env['MAPBOX_ACCESS_TOKEN'] ?? '';
    final urlTemplate = 'https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/256/{z}/{x}/{y}@2x?access_token=$mapboxToken';

    // Mock Safe Shelters for Hackathon Demo
    final List<LatLng> shelters = [
      const LatLng(19.9920, 73.7900),
      const LatLng(19.9850, 73.7700),
    ];

    return StreamBuilder<List<IncidentModel>>(
      stream: _service.getIncidentsStream(),
      builder: (context, incSnapshot) {
        return StreamBuilder<List<RescueTeamModel>>(
          stream: _service.getTeamsStream(),
          builder: (context, teamSnapshot) {
            final incidents = incSnapshot.data ?? [];
            final teams = teamSnapshot.data ?? [];

            return FlutterMap(
              mapController: _mapController,
              options: MapOptions(
                initialCenter: const LatLng(17.37, 78.42), // Centered on Musi River, Hyderabad
                initialZoom: 13.0,
                interactionOptions: const InteractionOptions(flags: InteractiveFlag.all & ~InteractiveFlag.rotate),
              ),
              children: [
                TileLayer(urlTemplate: urlTemplate, additionalOptions: {'accessToken': mapboxToken}),
                
                // RISK ZONES
                PolygonLayer(
                  polygons: MusiRedZone.polygons.map<Polygon>((poly) => Polygon(
                    points: poly,
                    color: Colors.red.withOpacity(0.25),
                    borderColor: Colors.redAccent,
                    borderStrokeWidth: 2,
                  )).toList(),
                ),

                // MARKERS: Shelters, Teams, Incidents
                MarkerLayer(
                  markers: [
                    // 1. SAFE SHELTERS
                    ...shelters.map((pos) => Marker(
                      point: pos,
                      width: 40, height: 40,
                      child: const Icon(Icons.security, color: Colors.greenAccent, size: 30),
                    )),
                    
                    // 2. RESCUE TEAMS
                    ...teams.map((team) => Marker(
                      point: LatLng(team.latitude, team.longitude),
                      width: 50, height: 50,
                      child: Container(
                        decoration: BoxDecoration(color: Colors.blueAccent.withOpacity(0.8), shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 2)),
                        child: const Icon(Icons.local_shipping, color: Colors.white, size: 20),
                      ),
                    )),

                    // 3. INCIDENTS (CLUSTERED SOS)
                    ...incidents.map((inc) {
                      Color sevColor;
                      if (inc.priorityScore >= 90) { sevColor = Colors.red; }
                      else if (inc.priorityScore >= 70) { sevColor = Colors.orange; }
                      else if (inc.priorityScore >= 40) { sevColor = Colors.yellow; }
                      else { sevColor = Colors.blueGrey; }

                      return Marker(
                        point: LatLng(inc.latitude, inc.longitude),
                        width: 70, height: 70,
                        child: Pulse(
                          infinite: true,
                          duration: Duration(milliseconds: inc.priorityScore >= 90 ? 800 : 2000),
                          child: InkWell(
                            onTap: () {
                               // Open detailed incident view panel logic
                            },
                            child: Container(
                              decoration: BoxDecoration(
                                color: sevColor.withOpacity(0.5),
                                shape: BoxShape.circle,
                                border: Border.all(color: sevColor, width: 2),
                              ),
                              child: Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Icon(Icons.warning, color: Colors.white, size: 16),
                                    Text(
                                      '${inc.affectedCount}', 
                                      style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                      );
                    }),
                  ],
                ),
              ],
            );
          }
        );
      },
    );
  }

  Widget _buildHUDMetrics() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A).withOpacity(0.85),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.5), blurRadius: 10)],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _hudItem('ACTIVE THREATS', '14', Icons.whatshot, Colors.redAccent),
          _hudItem('UNITS DEPLOYED', '8', Icons.local_shipping, Colors.greenAccent),
          _hudItem('CITIZENS RESCUED', '1,204', Icons.groups, Colors.cyanAccent),
          _hudItem('NETWORK MESH', 'OPTIMAL', Icons.wifi_tethering, Colors.purpleAccent),
        ],
      ),
    );
  }

  Widget _hudItem(String label, String val, IconData icon, Color color) {
    return Row(
      children: [
        Icon(icon, color: color, size: 28),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(label, style: TextStyle(color: Colors.blueGrey.shade300, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 1)),
            Text(val, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        )
      ],
    );
  }

  Widget _buildBottomTelemetryStrip() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B).withOpacity(0.9),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.cyan.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('METEOROLOGICAL TELEMETRY (data.gov.in)', style: TextStyle(color: Colors.cyan, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
          const SizedBox(height: 8),
          Expanded(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _telemetryNode('RAINFALL', '14.2 mm', '+2.4%', Colors.blue),
                _telemetryNode('WIND SPEED', '24 km/h', 'SEVERE', Colors.orange),
                _telemetryNode('GROUNDWATER', 'Level 4', 'STABLE', Colors.green),
                _telemetryNode('HUMIDITY', '88%', '+4.0%', Colors.purple),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _telemetryNode(String label, String val, String sub, Color color) {
    return Container(
      width: 120,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(12)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(label, style: TextStyle(color: Colors.blueGrey.shade400, fontSize: 9, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(val, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
          Text(sub, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  // ==========================================
  // RIGHT: DENSE ANALYTICS
  // ==========================================
  Widget _buildRightAnalyticsPanel() {
    return Container(
      width: 320,
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        border: Border(left: BorderSide(color: Colors.white.withOpacity(0.1))),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            color: const Color(0xFF0284C7).withOpacity(0.2),
            child: const Text('RESOURCE UTILIZATION', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1.5)),
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 200,
            child: PieChart(
              PieChartData(
                sectionsSpace: 2,
                centerSpaceRadius: 40,
                sections: [
                  PieChartSectionData(color: Colors.redAccent, value: 40, title: 'Deployed', radius: 40, titleStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white)),
                  PieChartSectionData(color: Colors.greenAccent, value: 30, title: 'Standby', radius: 40, titleStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white)),
                  PieChartSectionData(color: Colors.blueGrey, value: 15, title: 'Maint.', radius: 40, titleStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white)),
                  PieChartSectionData(color: Colors.orangeAccent, value: 15, title: 'Transit', radius: 40, titleStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white)),
                ],
              ),
            ),
          ),
          const Divider(color: Colors.white12, height: 40),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16),
            child: Text('AI PREDICTION ENGINE', style: TextStyle(color: Colors.cyan, fontWeight: FontWeight.bold, fontSize: 10, letterSpacing: 1.5)),
          ),
          const SizedBox(height: 16),
          _aiPredictionRow('Flood Risk (Nashik)', 0.85, Colors.redAccent),
          _aiPredictionRow('Landslide Probability', 0.45, Colors.orangeAccent),
          _aiPredictionRow('Mesh Network Health', 0.92, Colors.greenAccent),
          const Spacer(),
          Padding(
            padding: const EdgeInsets.all(16),
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.redAccent.withOpacity(0.2),
                foregroundColor: Colors.redAccent,
                padding: const EdgeInsets.all(16),
              ),
              icon: const Icon(Icons.warning_amber_rounded),
              label: const Text('ISSUE MASS EVACUATION'),
              onPressed: () {},
            ),
          )
        ],
      ),
    );
  }

  Widget _aiPredictionRow(String label, double val, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: const TextStyle(color: Colors.white70, fontSize: 12)),
              Text('${(val * 100).toInt()}%', style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 12)),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: val,
            backgroundColor: const Color(0xFF0F172A),
            valueColor: AlwaysStoppedAnimation<Color>(color),
            minHeight: 6,
            borderRadius: BorderRadius.circular(10),
          ),
        ],
      ),
    );
  }
}
