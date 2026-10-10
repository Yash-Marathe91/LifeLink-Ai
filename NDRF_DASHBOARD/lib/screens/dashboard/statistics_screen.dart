import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../services/supabase_service.dart';
import '../../models/dashboard_models.dart';

class StatisticsScreen extends StatefulWidget {
  const StatisticsScreen({super.key});
  @override
  State<StatisticsScreen> createState() => _StatisticsScreenState();
}

class _StatisticsScreenState extends State<StatisticsScreen> {
  final _service = SupabaseService.instance;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF0F172A),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('24-Hour Statistics & KPIs', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 4),
          const Text('Command analytics, operational velocity, and AI resolution metrics.', style: TextStyle(color: Colors.white54, fontSize: 14)),
          const SizedBox(height: 24),
          
          // TOP KPI ROW
          StreamBuilder<List<IncidentModel>>(
            stream: _service.getIncidentsStream(),
            builder: (context, snapshot) {
              final incidents = snapshot.data ?? [];
              final total = incidents.length;
              final critical = incidents.where((i) => i.priorityScore >= 80).length;
              final resolved = incidents.where((i) => i.status == IncidentStatus.resolved).length;
              final active = total - resolved;

              return Row(
                children: [
                  _kpiCard('TOTAL INCIDENTS', '$total', Icons.warning, Colors.blueAccent),
                  const SizedBox(width: 16),
                  _kpiCard('ACTIVE / CRITICAL', '$active / $critical', Icons.whatshot, Colors.redAccent),
                  const SizedBox(width: 16),
                  _kpiCard('RESOLVED', '$resolved', Icons.check_circle, Colors.greenAccent),
                  const SizedBox(width: 16),
                  _kpiCard('AVG RESPONSE TIME', '4m 12s', Icons.timer, Colors.orangeAccent),
                ],
              );
            },
          ),
          
          const SizedBox(height: 24),
          
          // CHARTS ROW
          Expanded(
            child: Row(
              children: [
                Expanded(
                  flex: 2,
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(16)),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('INCIDENT VOLUME VS CONFIRMED RESCUES (24H)', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 20),
                        Expanded(
                          child: LineChart(
                            LineChartData(
                              gridData: FlGridData(show: true, drawVerticalLine: false, getDrawingHorizontalLine: (value) => FlLine(color: Colors.white12, strokeWidth: 1)),
                              titlesData: FlTitlesData(
                                leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, reservedSize: 40, getTitlesWidget: (v, m) => Text('${v.toInt()}', style: const TextStyle(color: Colors.white54, fontSize: 10)))),
                                bottomTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, getTitlesWidget: (v, m) => Text('${v.toInt()}:00', style: const TextStyle(color: Colors.white54, fontSize: 10)))),
                                rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                              ),
                              borderData: FlBorderData(show: false),
                              lineBarsData: [
                                LineChartBarData(
                                  spots: const [FlSpot(0, 5), FlSpot(4, 15), FlSpot(8, 12), FlSpot(12, 35), FlSpot(16, 25), FlSpot(20, 10)],
                                  isCurved: true, color: Colors.redAccent, barWidth: 3, dotData: const FlDotData(show: false),
                                  belowBarData: BarAreaData(show: true, color: Colors.redAccent.withOpacity(0.1)),
                                ),
                                LineChartBarData(
                                  spots: const [FlSpot(0, 2), FlSpot(4, 8), FlSpot(8, 10), FlSpot(12, 18), FlSpot(16, 30), FlSpot(20, 15)],
                                  isCurved: true, color: Colors.greenAccent, barWidth: 3, dotData: const FlDotData(show: false),
                                  belowBarData: BarAreaData(show: true, color: Colors.greenAccent.withOpacity(0.1)),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(width: 12, height: 12, color: Colors.redAccent), const SizedBox(width: 4), const Text('Incoming Incidents', style: TextStyle(color: Colors.white70, fontSize: 10)),
                            const SizedBox(width: 16),
                            Container(width: 12, height: 12, color: Colors.greenAccent), const SizedBox(width: 4), const Text('Confirmed Rescues', style: TextStyle(color: Colors.white70, fontSize: 10)),
                          ],
                        )
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 24),
                Expanded(
                  flex: 1,
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(16)),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('INCIDENTS BY DISASTER TYPE', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 20),
                        Expanded(
                          child: PieChart(
                            PieChartData(
                              sectionsSpace: 2,
                              centerSpaceRadius: 50,
                              sections: [
                                PieChartSectionData(color: Colors.blueAccent, value: 45, title: '45%', radius: 40, titleStyle: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                                PieChartSectionData(color: Colors.redAccent, value: 25, title: '25%', radius: 40, titleStyle: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                                PieChartSectionData(color: Colors.orangeAccent, value: 20, title: '20%', radius: 40, titleStyle: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                                PieChartSectionData(color: Colors.grey, value: 10, title: '10%', radius: 40, titleStyle: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        _legendRow(Colors.blueAccent, 'Flood / Water Event'),
                        _legendRow(Colors.redAccent, 'Fire / Explosion'),
                        _legendRow(Colors.orangeAccent, 'Structural Collapse'),
                        _legendRow(Colors.grey, 'Other Medical'),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _legendRow(Color color, String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        children: [
          Container(width: 12, height: 12, color: color),
          const SizedBox(width: 8),
          Text(label, style: const TextStyle(color: Colors.white70, fontSize: 12)),
        ],
      ),
    );
  }

  Widget _kpiCard(String title, String val, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
              child: Icon(icon, color: color, size: 32),
            ),
            const SizedBox(width: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: TextStyle(color: Colors.blueGrey.shade300, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1)),
                const SizedBox(height: 4),
                Text(val, style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
              ],
            )
          ],
        ),
      ),
    );
  }
}
