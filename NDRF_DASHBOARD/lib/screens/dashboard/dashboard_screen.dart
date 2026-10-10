import 'package:flutter/material.dart';
import '../../services/supabase_dashboard_service.dart';
import 'components/tactical_map_view.dart';
import 'package:fl_chart/fl_chart.dart';

class AnalyticalDashboardScreen extends StatefulWidget {
  const AnalyticalDashboardScreen({super.key});

  @override
  State<AnalyticalDashboardScreen> createState() => _AnalyticalDashboardScreenState();
}

class _AnalyticalDashboardScreenState extends State<AnalyticalDashboardScreen> {
  final service = SupabaseDashboardService.instance;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _initService();
  }

  Future<void> _initService() async {
    await service.initialize();
    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  void _refreshData() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: Color(0xFF0F172A),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(color: Color(0xFF0284C7)),
              SizedBox(height: 16),
              Text(
                'INITIALIZING SECURE DASHBOARD...',
                style: TextStyle(
                  color: Colors.white,
                  letterSpacing: 2,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      );
    }

    final metrics = service.calculateMetrics();

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        elevation: 10,
        title: Row(
          children: [
            const Icon(Icons.shield, color: Color(0xFF38BDF8), size: 26),
            const SizedBox(width: 12),
            const Text(
              'NDRF TACTICAL COMMAND',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.5,
              ),
            ),
            const Spacer(),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: service.isConnectedToCloud
                    ? Colors.green.withOpacity(0.2)
                    : Colors.red.withOpacity(0.2),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: service.isConnectedToCloud ? Colors.green : Colors.red,
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    service.isConnectedToCloud ? Icons.cloud_done : Icons.cloud_off,
                    size: 14,
                    color: service.isConnectedToCloud ? Colors.greenAccent : Colors.redAccent,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    service.isConnectedToCloud ? 'CLOUD SYNCED' : 'LOCAL MESH MODE',
                    style: TextStyle(
                      color: service.isConnectedToCloud ? Colors.greenAccent : Colors.redAccent,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      body: Row(
        children: [
          // Left Sidebar Metrics
          Container(
            width: 320,
            color: const Color(0xFF1E293B),
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _buildStatCard(
                  title: 'ACTIVE INCIDENTS (AI TRIAGED)',
                  value: metrics['totalIncidents'].toString(),
                  icon: Icons.hub,
                  color: const Color(0xFF0284C7),
                ),
                _buildStatCard(
                  title: 'CRITICAL PRIORITY',
                  value: metrics['criticalIncidents'].toString(),
                  icon: Icons.warning_amber_rounded,
                  color: const Color(0xFFEF4444),
                ),
                _buildStatCard(
                  title: 'RAW DISTRESS SIGNALS',
                  value: metrics['totalSos'].toString(),
                  icon: Icons.wifi_tethering,
                  color: const Color(0xFFF97316),
                ),
                _buildStatCard(
                  title: 'CITIZEN REPORTS VERIFIED',
                  value: metrics['totalDisasterReports'].toString(),
                  icon: Icons.camera_alt_outlined,
                  color: const Color(0xFFEAB308),
                ),
                _buildStatCard(
                  title: 'DEPLOYED RESCUE UNITS',
                  value: '${metrics['deployedTeams']} / ${service.rescueTeams.length}',
                  icon: Icons.airport_shuttle,
                  color: const Color(0xFF10B981),
                ),
                const SizedBox(height: 20),
                const Text(
                  'DISASTER TYPOLOGY',
                  style: TextStyle(
                    color: Colors.white70,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.0,
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  height: 200,
                  child: PieChart(
                    PieChartData(
                      sectionsSpace: 2,
                      centerSpaceRadius: 40,
                      sections: _buildTypologyChart(metrics['categoryCount'] as Map<String, int>),
                    ),
                  ),
                ),
              ],
            ),
          ),
          
          // Main Map View
          Expanded(
            child: TacticalMapView(
              onDataChanged: _refreshData,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.05),
            blurRadius: 10,
            spreadRadius: 2,
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withOpacity(0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    color: Colors.blueGrey.shade400,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.0,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  List<PieChartSectionData> _buildTypologyChart(Map<String, int> categories) {
    if (categories.isEmpty) {
      return [
        PieChartSectionData(
          value: 1,
          color: Colors.blueGrey.withOpacity(0.3),
          title: 'None',
          radius: 30,
        )
      ];
    }
    
    final colors = [
      const Color(0xFF0284C7),
      const Color(0xFFF97316),
      const Color(0xFFEF4444),
      const Color(0xFF10B981),
      const Color(0xFFA855F7),
    ];
    
    int c = 0;
    return categories.entries.map((e) {
      final color = colors[c % colors.length];
      c++;
      return PieChartSectionData(
        value: e.value.toDouble(),
        color: color,
        title: '${e.key}\n${e.value}',
        titleStyle: const TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
        radius: 40,
      );
    }).toList();
  }
}
