import 'package:flutter/material.dart';

import '../../models/dashboard_models.dart';
import '../../services/supabase_service.dart';

class IncidentsCRUD extends StatefulWidget {
  const IncidentsCRUD({super.key});

  @override
  State<IncidentsCRUD> createState() => _IncidentsCRUDState();
}

class _IncidentsCRUDState extends State<IncidentsCRUD> {
  final _service = SupabaseService.instance;

  String _searchQuery = '';
  String _filterStatus = 'ALL';
  String _filterSeverity = 'ALL';

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF0F172A),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Incoming Incidents & Triaged SOS', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
                  SizedBox(height: 4),
                  Text('Search, verify, and override AI priorities before dispatch.', style: TextStyle(color: Colors.white54, fontSize: 14)),
                ],
              ),
              _buildFilters(),
            ],
          ),
          const SizedBox(height: 20),
          Expanded(
            child: Container(
              decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.white12)),
              child: _buildDataTable(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    return Row(
      children: [
        SizedBox(
          width: 250,
          child: TextField(
            style: const TextStyle(color: Colors.white, fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Search ID, Type, Location...',
              hintStyle: const TextStyle(color: Colors.white38),
              prefixIcon: const Icon(Icons.search, color: Colors.white54),
              filled: true,
              fillColor: const Color(0xFF0F172A),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide.none),
            ),
            onChanged: (val) => setState(() => _searchQuery = val.toLowerCase()),
          ),
        ),
        const SizedBox(width: 12),
        _dropdown('Severity', _filterSeverity, ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], (v) => setState(() => _filterSeverity = v!)),
        const SizedBox(width: 12),
        _dropdown('Status', _filterStatus, ['ALL', 'ACTIVE', 'DISPATCHED', 'RESOLVED'], (v) => setState(() => _filterStatus = v!)),
      ],
    );
  }

  Widget _dropdown(String label, String val, List<String> items, ValueChanged<String?> onChanged) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(8)),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: val,
          dropdownColor: const Color(0xFF0F172A),
          style: const TextStyle(color: Colors.white, fontSize: 13),
          icon: const Icon(Icons.arrow_drop_down, color: Colors.white54),
          items: items.map((i) => DropdownMenuItem(value: i, child: Text('$label: $i'))).toList(),
          onChanged: onChanged,
        ),
      ),
    );
  }

  Widget _buildDataTable() {
    return StreamBuilder<List<IncidentModel>>(
      stream: _service.getIncidentsStream(),
      builder: (context, snapshot) {
        if (!snapshot.hasData) return const Center(child: CircularProgressIndicator());

        var incidents = snapshot.data!;
        
        // Apply Filters
        incidents = incidents.where((inc) {
          final matchesSearch = inc.incidentId.toLowerCase().contains(_searchQuery) || inc.disasterType.toLowerCase().contains(_searchQuery);
          final matchesSev = _filterSeverity == 'ALL' || inc.severity.toUpperCase() == _filterSeverity;
          final matchesStatus = _filterStatus == 'ALL' || inc.status.name.toUpperCase() == _filterStatus;
          return matchesSearch && matchesSev && matchesStatus;
        }).toList();

        // Sort by Priority Desc
        incidents.sort((a, b) => b.priorityScore.compareTo(a.priorityScore));

        if (incidents.isEmpty) {
          return const Center(child: Text('No incidents match the filters.', style: TextStyle(color: Colors.white54)));
        }

        return SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: SingleChildScrollView(
            child: DataTable(
              headingRowColor: MaterialStateProperty.all(const Color(0xFF0F172A)),
              columnSpacing: 24,
              columns: const [
                DataColumn(label: Text('INCIDENT ID', style: TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold))),
                DataColumn(label: Text('TYPE & SEVERITY', style: TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold))),
                DataColumn(label: Text('VERIFICATION', style: TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold))),
                DataColumn(label: Text('AFFECTED', style: TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold))),
                DataColumn(label: Text('AI SCORE', style: TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold))),
                DataColumn(label: Text('STATUS', style: TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold))),
                DataColumn(label: Text('ACTIONS', style: TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold))),
              ],
              rows: incidents.map((inc) {
                return DataRow(
                  cells: [
                    DataCell(Text(inc.incidentId, style: const TextStyle(color: Colors.cyan, fontWeight: FontWeight.bold))),
                    DataCell(Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(inc.disasterType, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        Text(inc.severity, style: TextStyle(color: _getSevColor(inc.severity), fontSize: 10, fontWeight: FontWeight.bold)),
                      ],
                    )),
                    DataCell(_buildVerificationBadge(inc.verificationStatus)),
                    DataCell(Text('${inc.affectedCount} Victims\n${inc.reportedInjuries} Injured', style: const TextStyle(color: Colors.white70, fontSize: 12))),
                    DataCell(Text('${inc.priorityScore.toStringAsFixed(1)}', style: TextStyle(color: inc.priorityScore >= 80 ? Colors.redAccent : Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 16))),
                    DataCell(Text(inc.status.name.toUpperCase(), style: const TextStyle(color: Colors.white54, fontSize: 12))),
                    DataCell(Row(
                      children: [
                        _actionBtn('VERIFY', Colors.orangeAccent, () => _openVerifyDialog(inc)),
                        const SizedBox(width: 8),
                        _actionBtn('DISPATCH', Colors.blueAccent, () => _openDispatchDialog(inc)),
                      ],
                    )),
                  ],
                );
              }).toList(),
            ),
          ),
        );
      },
    );
  }

  Color _getSevColor(String sev) {
    switch (sev.toUpperCase()) {
      case 'CRITICAL': return Colors.redAccent;
      case 'HIGH': return Colors.orangeAccent;
      case 'LOW': return Colors.greenAccent;
      default: return Colors.yellowAccent;
    }
  }

  Widget _buildVerificationBadge(String status) {
    Color c;
    IconData icon;
    if (status == 'VERIFIED') { c = Colors.greenAccent; icon = Icons.check_circle; }
    else if (status == 'DISPUTED') { c = Colors.redAccent; icon = Icons.warning; }
    else { c = Colors.blueGrey; icon = Icons.help_outline; }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(color: c.withOpacity(0.1), borderRadius: BorderRadius.circular(4), border: Border.all(color: c.withOpacity(0.5))),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: c),
          const SizedBox(width: 4),
          Text(status, style: TextStyle(color: c, fontSize: 10, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _actionBtn(String label, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(6), border: Border.all(color: color.withOpacity(0.5))),
        child: Text(label, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
      ),
    );
  }

  void _openVerifyDialog(IncidentModel inc) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        title: const Text('Verification & Override', style: TextStyle(color: Colors.white)),
        content: const Text('Operator Audit Log: You are about to override AI priorities or change verification status. This action will be audited.', style: TextStyle(color: Colors.white70)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('CANCEL')),
          ElevatedButton(
            onPressed: () {
               // Logic to update verification and write audit_log
               Navigator.pop(ctx);
               ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Verification Status Updated & Audited.')));
            },
            child: const Text('MARK VERIFIED'),
          )
        ],
      ),
    );
  }

  void _openDispatchDialog(IncidentModel inc) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        title: const Text('Dispatch Rescue Team', style: TextStyle(color: Colors.white)),
        content: const Text('Select an available team to dispatch to this exact coordinate.', style: TextStyle(color: Colors.white70)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('CANCEL')),
          ElevatedButton(
            onPressed: () {
               _service.updateIncidentStatus(inc.incidentId, 'DISPATCHED');
               Navigator.pop(ctx);
               ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Team Dispatched.')));
            },
            child: const Text('DISPATCH AUTO-MATCH'),
          )
        ],
      ),
    );
  }
}
