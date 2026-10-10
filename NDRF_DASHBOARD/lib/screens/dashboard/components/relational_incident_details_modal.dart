import 'package:flutter/material.dart';
import '../../../models/dashboard_models.dart';
import '../../../services/supabase_dashboard_service.dart';

class RelationalIncidentDetailsModal extends StatefulWidget {
  final IncidentModel incident;
  final VoidCallback onDataChanged;

  const RelationalIncidentDetailsModal({
    super.key,
    required this.incident,
    required this.onDataChanged,
  });

  static void show(
      BuildContext context, IncidentModel incident, VoidCallback onDataChanged) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => RelationalIncidentDetailsModal(
        incident: incident,
        onDataChanged: onDataChanged,
      ),
    );
  }

  @override
  State<RelationalIncidentDetailsModal> createState() =>
      _RelationalIncidentDetailsModalState();
}

class _RelationalIncidentDetailsModalState
    extends State<RelationalIncidentDetailsModal>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Color _getPriorityColor(PriorityLevel level) {
    switch (level) {
      case PriorityLevel.critical:
        return const Color(0xFFEF4444);
      case PriorityLevel.high:
        return const Color(0xFFF97316);
      case PriorityLevel.medium:
        return const Color(0xFFFBBF24);
      case PriorityLevel.low:
        return const Color(0xFF10B981);
    }
  }

  Color _getStatusColor(IncidentStatus status) {
    switch (status) {
      case IncidentStatus.triaged:
        return const Color(0xFF38BDF8);
      case IncidentStatus.assigned:
        return const Color(0xFFA855F7);
      case IncidentStatus.dispatched:
      case IncidentStatus.enRoute:
        return const Color(0xFFF59E0B);
      case IncidentStatus.resolved:
        return const Color(0xFF10B981);
    }
  }

  @override
  Widget build(BuildContext context) {
    final service = SupabaseDashboardService.instance;
    final linkedSos = service.getLinkedSos(widget.incident);
    final linkedDisaster = service.getLinkedDisasterReports(widget.incident);
    final assignedTeam = service.getAssignedTeam(widget.incident);
    
    final breakdown = widget.incident.agentBreakdown;

    final priorityColor = _getPriorityColor(widget.incident.priorityLevel);
    final statusColor = _getStatusColor(widget.incident.status);

    return DraggableScrollableSheet(
      initialChildSize: 0.88,
      minChildSize: 0.5,
      maxChildSize: 0.96,
      builder: (context, scrollController) {
        return Container(
          decoration: const BoxDecoration(
            color: Color(0xFF0F172A),
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            boxShadow: [
              BoxShadow(
                color: Colors.black54,
                blurRadius: 30,
                spreadRadius: 5,
              ),
            ],
          ),
          child: Column(
            children: [
              Center(
                child: Container(
                  margin: const EdgeInsets.only(top: 12, bottom: 8),
                  width: 48,
                  height: 5,
                  decoration: BoxDecoration(
                    color: Colors.blueGrey.shade700,
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),

              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: priorityColor.withOpacity(0.18),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: priorityColor, width: 1.2),
                          ),
                          child: Text(
                            widget.incident.priorityLevel.name.toUpperCase(),
                            style: TextStyle(
                              color: priorityColor,
                              fontWeight: FontWeight.bold,
                              fontSize: 11,
                              letterSpacing: 0.8,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: statusColor.withOpacity(0.18),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: statusColor, width: 1.2),
                          ),
                          child: Text(
                            widget.incident.status.name.toUpperCase(),
                            style: TextStyle(
                              color: statusColor,
                              fontWeight: FontWeight.bold,
                              fontSize: 11,
                              letterSpacing: 0.8,
                            ),
                          ),
                        ),
                        const Spacer(),
                        Text(
                          widget.incident.incidentId,
                          style: TextStyle(
                            color: Colors.blueGrey.shade400,
                            fontFamily: 'monospace',
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, color: Colors.white70),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      widget.incident.title,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Icon(Icons.location_on_outlined,
                            size: 14, color: Colors.blueGrey.shade400),
                        const SizedBox(width: 4),
                        Text(
                          '${widget.incident.latitude.toStringAsFixed(4)}, ${widget.incident.longitude.toStringAsFixed(4)}',
                          style: TextStyle(
                            color: Colors.blueGrey.shade400,
                            fontSize: 12,
                          ),
                        ),
                        const SizedBox(width: 14),
                        Icon(Icons.people_alt_outlined,
                            size: 14, color: Colors.blueGrey.shade400),
                        const SizedBox(width: 4),
                        Text(
                          '${widget.incident.affectedCount} affected',
                          style: TextStyle(
                            color: Colors.blueGrey.shade300,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              Container(
                margin: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: TabBar(
                  controller: _tabController,
                  isScrollable: true,
                  indicatorSize: TabBarIndicatorSize.tab,
                  indicator: BoxDecoration(
                    color: const Color(0xFF0284C7),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  labelColor: Colors.white,
                  unselectedLabelColor: Colors.blueGrey.shade400,
                  labelStyle: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                  tabs: [
                    Tab(
                      icon: const Icon(Icons.warning_amber_rounded, size: 16),
                      text: 'SOS Signals (${linkedSos.length})',
                    ),
                    Tab(
                      icon: const Icon(Icons.photo_library_outlined, size: 16),
                      text: 'Citizen Reports (${linkedDisaster.length})',
                    ),
                    const Tab(
                      icon: Icon(Icons.psychology_outlined, size: 16),
                      text: 'AI Triage Audit',
                    ),
                    Tab(
                      icon: const Icon(Icons.shield_outlined, size: 16),
                      text: assignedTeam != null
                          ? 'Assigned: ${assignedTeam.callsign.split(' ').first}'
                          : 'Team Matcher',
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 10),

              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    _buildLinkedSosView(linkedSos),
                    _buildLinkedDisasterView(linkedDisaster),
                    _buildAITriageView(breakdown),
                    _buildTeamDispatchView(assignedTeam),
                  ],
                ),
              ),

              Container(
                padding: const EdgeInsets.all(16),
                decoration: const BoxDecoration(
                  color: Color(0xFF1E293B),
                  border: Border(
                    top: BorderSide(color: Color(0xFF334155), width: 1),
                  ),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<IncidentStatus>(
                        value: widget.incident.status,
                        dropdownColor: const Color(0xFF1E293B),
                        style: const TextStyle(color: Colors.white, fontSize: 13),
                        decoration: InputDecoration(
                          labelText: 'OPERATIONAL STATUS',
                          labelStyle: TextStyle(
                            color: Colors.blueGrey.shade400,
                            fontSize: 11,
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                              horizontal: 14, vertical: 8),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                            borderSide:
                                BorderSide(color: Colors.blueGrey.shade700),
                          ),
                        ),
                        items: IncidentStatus.values.map((st) {
                          return DropdownMenuItem(
                            value: st,
                            child: Text(st.name.toUpperCase()),
                          );
                        }).toList(),
                        onChanged: (newStatus) {
                          if (newStatus != null) {
                            setState(() {
                              service.updateIncidentStatus(
                                  widget.incident.incidentId, newStatus);
                            });
                            widget.onDataChanged();
                          }
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF10B981),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      icon: const Icon(Icons.check_circle_outline, size: 18),
                      label: const Text('Resolve'),
                      onPressed: () {
                        setState(() {
                          service.updateIncidentStatus(
                              widget.incident.incidentId, IncidentStatus.resolved);
                        });
                        widget.onDataChanged();
                        Navigator.pop(context);
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildLinkedSosView(List<SOSSignalModel> signals) {
    if (signals.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.wifi_tethering_off,
                size: 48, color: Colors.blueGrey.shade600),
            const SizedBox(height: 12),
            Text(
              'No direct citizen SOS signals linked yet.',
              style: TextStyle(color: Colors.blueGrey.shade400, fontSize: 14),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: signals.length,
      itemBuilder: (context, index) {
        final s = signals[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFF1E293B),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: Colors.blueGrey.shade800),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.red.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      s.sosId,
                      style: const TextStyle(
                        color: Colors.redAccent,
                        fontWeight: FontWeight.bold,
                        fontFamily: 'monospace',
                        fontSize: 12,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.blue.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      s.emergencyType,
                      style: const TextStyle(
                        color: Colors.lightBlueAccent,
                        fontWeight: FontWeight.w600,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  const Spacer(),
                  Icon(Icons.battery_charging_full,
                      size: 15,
                      color: s.batteryPct < 25 ? Colors.red : Colors.green),
                  const SizedBox(width: 4),
                  Text(
                    '${s.batteryPct}%',
                    style: TextStyle(
                      color: Colors.blueGrey.shade300,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              if (s.note != null && s.note!.isNotEmpty)
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.mic, color: Colors.cyanAccent, size: 18),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          '"${s.note}"',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 13,
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Transport: ${s.transportSource}',
                    style: TextStyle(
                      color: Colors.blueGrey.shade400,
                      fontSize: 11,
                    ),
                  ),
                  Text(
                    '${s.latitude.toStringAsFixed(5)}, ${s.longitude.toStringAsFixed(5)}',
                    style: TextStyle(
                      color: Colors.blueGrey.shade400,
                      fontFamily: 'monospace',
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildLinkedDisasterView(List<DisasterReportModel> reports) {
    if (reports.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.image_not_supported_outlined,
                size: 48, color: Colors.blueGrey.shade600),
            const SizedBox(height: 12),
            Text(
              'No photographic damage reports linked.',
              style: TextStyle(color: Colors.blueGrey.shade400, fontSize: 14),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: reports.length,
      itemBuilder: (context, index) {
        final r = reports[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          decoration: BoxDecoration(
            color: const Color(0xFF1E293B),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: Colors.blueGrey.shade800),
          ),
          clipBehavior: Clip.antiAlias,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (r.photoUrl != null && r.photoUrl!.isNotEmpty)
                AspectRatio(
                  aspectRatio: 16 / 9,
                  child: Image.network(
                    r.photoUrl!,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      color: const Color(0xFF0F172A),
                      child: const Center(
                        child: Icon(Icons.broken_image,
                            color: Colors.blueGrey, size: 40),
                      ),
                    ),
                  ),
                ),
              Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: Colors.amber.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            r.reportId,
                            style: const TextStyle(
                              color: Colors.amberAccent,
                              fontFamily: 'monospace',
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '${r.disasterType} • Severity: ${r.severity}',
                          style: TextStyle(
                            color: Colors.blueGrey.shade200,
                            fontWeight: FontWeight.w600,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      r.description,
                      style: const TextStyle(color: Colors.white, fontSize: 14),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(Icons.place, size: 14, color: Colors.blueGrey.shade400),
                        const SizedBox(width: 4),
                        Text(
                          r.locationName,
                          style: TextStyle(
                            color: Colors.blueGrey.shade400,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildAITriageView(Map<String, dynamic> breakdown) {
    if (breakdown.isEmpty) {
      return const Center(
        child: Text(
          'AI Triage breakdown pending coordinator analysis.',
          style: TextStyle(color: Colors.blueGrey),
        ),
      );
    }

    Widget buildAgentRow(
        String name, double score, String rationale, IconData icon, Color color) {
      return Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: color, size: 18),
                const SizedBox(width: 8),
                Text(
                  name,
                  style: TextStyle(
                    color: Colors.blueGrey.shade200,
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
                const Spacer(),
                Text(
                  '${score.toInt()}/100',
                  style: TextStyle(
                    color: color,
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: score / 100.0,
                backgroundColor: const Color(0xFF0F172A),
                valueColor: AlwaysStoppedAnimation<Color>(color),
                minHeight: 6,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              rationale,
              style: TextStyle(
                color: Colors.blueGrey.shade300,
                fontSize: 12,
              ),
            ),
          ],
        ),
      );
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFF0284C7).withOpacity(0.15),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFF0284C7), width: 1.2),
          ),
          child: Row(
            children: [
              const Icon(Icons.verified, color: Color(0xFF38BDF8), size: 24),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'AI COORDINATOR ENSEMBLE CONSENSUS',
                      style: TextStyle(
                        color: Color(0xFF38BDF8),
                        fontWeight: FontWeight.bold,
                        fontSize: 11,
                        letterSpacing: 0.8,
                      ),
                    ),
                    Text(
                      'Overall Priority: ${widget.incident.priorityScore.toStringAsFixed(1)}/100',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        buildAgentRow(
          'Severity Agent',
          (breakdown['severity']?['score'] as num?)?.toDouble() ?? 0,
          breakdown['severity']?['rationale']?.toString() ?? '',
          Icons.speed,
          const Color(0xFFEF4444),
        ),
        buildAgentRow(
          'Medical Agent',
          (breakdown['medical']?['score'] as num?)?.toDouble() ?? 0,
          breakdown['medical']?['rationale']?.toString() ?? '',
          Icons.medical_services_outlined,
          const Color(0xFFF97316),
        ),
        buildAgentRow(
          'Vulnerability Agent',
          (breakdown['vulnerability']?['score'] as num?)?.toDouble() ?? 0,
          breakdown['vulnerability']?['rationale']?.toString() ?? '',
          Icons.elderly_outlined,
          const Color(0xFFEAB308),
        ),
        buildAgentRow(
          'Hazard Multiplier Agent',
          (breakdown['hazard']?['score'] as num?)?.toDouble() ?? 0,
          breakdown['hazard']?['rationale']?.toString() ?? '',
          Icons.bolt_outlined,
          const Color(0xFFA855F7),
        ),
        buildAgentRow(
          'Location & Access Agent',
          (breakdown['location']?['score'] as num?)?.toDouble() ?? 0,
          breakdown['location']?['rationale']?.toString() ?? '',
          Icons.explore_outlined,
          const Color(0xFF06B6D4),
        ),
      ],
    );
  }

  Widget _buildTeamDispatchView(RescueTeamModel? assignedTeam) {
    final service = SupabaseDashboardService.instance;
    final allTeams = service.rescueTeams;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        if (assignedTeam != null) ...[
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF10B981).withOpacity(0.15),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFF10B981), width: 1.5),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.shield, color: Color(0xFF10B981), size: 22),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        assignedTeam.callsign,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Text(
                        'CURRENTLY DEPLOYED',
                        style: TextStyle(
                          color: Colors.black,
                          fontWeight: FontWeight.bold,
                          fontSize: 10,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Channel: ${assignedTeam.contactChannel}',
                  style: TextStyle(
                    color: Colors.blueGrey.shade300,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 6,
                  runSpacing: 4,
                  children: assignedTeam.equipment.map((eq) {
                    return Chip(
                      label: Text(eq.replaceAll('_', ' '),
                          style: const TextStyle(fontSize: 10)),
                      backgroundColor: const Color(0xFF1E293B),
                      labelStyle: const TextStyle(color: Colors.white70),
                      padding: EdgeInsets.zero,
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            'REASSIGN TO ALTERNATE UNIT',
            style: TextStyle(
              color: Colors.blueGrey,
              fontWeight: FontWeight.bold,
              fontSize: 12,
              letterSpacing: 1.0,
            ),
          ),
          const SizedBox(height: 8),
        ],
        ...allTeams.map((team) {
          final isAssigned = team.teamId == widget.incident.assignedTeamId;
          final isAvailable = team.status == TeamStatus.available;

          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isAssigned
                    ? const Color(0xFF10B981)
                    : Colors.blueGrey.shade800,
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        team.callsign,
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Type: ${team.unitType} • Capacity: ${team.capacityVictims} victims',
                        style: TextStyle(
                          color: Colors.blueGrey.shade400,
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Status: ${team.status.name.toUpperCase()} (Active Missions: ${team.currentActiveMissions})',
                        style: TextStyle(
                          color: isAvailable
                              ? Colors.greenAccent
                              : Colors.orangeAccent,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: isAssigned
                        ? Colors.blueGrey.shade700
                        : const Color(0xFF0284C7),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  onPressed: isAssigned
                      ? null
                      : () {
                          setState(() {
                            service.dispatchTeam(widget.incident.incidentId, team.teamId);
                          });
                          widget.onDataChanged();
                        },
                  child: Text(isAssigned ? 'Active' : 'Dispatch'),
                ),
              ],
            ),
          );
        }),
      ],
    );
  }
}
