import 'package:flutter/material.dart';


import '../../models/dashboard_models.dart';
import '../../services/supabase_service.dart';

class TeamsCRUD extends StatefulWidget {
  const TeamsCRUD({super.key});

  @override
  State<TeamsCRUD> createState() => _TeamsCRUDState();
}

class _TeamsCRUDState extends State<TeamsCRUD> {
  final _service = SupabaseService.instance;

  void _showAddTeamDialog() {
    // A full implementation would have text fields here. For now we will insert a mock real team.
    final newTeam = RescueTeamModel(
      id: '',
      teamId: 'NDRF-N-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
      callsign: 'NDRF Fast Response',
      unitType: 'RAPID_DEPLOY',
      status: TeamStatus.available,
      latitude: 19.9980,
      longitude: 73.7900,
      equipment: ['MEDICAL_KIT', 'DRONE'],
      capacityVictims: 4,
      currentActiveMissions: 0,
      contactChannel: 'VHF-146',
    );
    _service.createRescueTeam(newTeam);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF0F172A),
      padding: const EdgeInsets.all(32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Rescue Units',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Track, add, and manage on-ground rescue teams.',
                    style: TextStyle(color: Colors.blueGrey.shade400, fontSize: 16),
                  ),
                ],
              ),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0284C7),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                icon: const Icon(Icons.add),
                label: const Text('Add New Unit'),
                onPressed: _showAddTeamDialog,
              ),
            ],
          ),
          const SizedBox(height: 32),
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white.withOpacity(0.05)),
              ),
              clipBehavior: Clip.antiAlias,
              child: StreamBuilder<List<RescueTeamModel>>(
                stream: _service.getTeamsStream(),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  }

                  final teams = snapshot.data ?? [];
                  if (teams.isEmpty) {
                    return const Center(
                      child: Text('No units available.', style: TextStyle(color: Colors.white54)),
                    );
                  }

                  return GridView.builder(
                    padding: const EdgeInsets.all(24),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      crossAxisSpacing: 20,
                      mainAxisSpacing: 20,
                      childAspectRatio: 1.5,
                    ),
                    itemCount: teams.length,
                    itemBuilder: (context, index) {
                      final team = teams[index];
                      final isDeployed = team.status == TeamStatus.deployed;

                      return Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: const Color(0xFF0F172A),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isDeployed ? Colors.green.withOpacity(0.5) : Colors.blue.withOpacity(0.2),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: isDeployed ? Colors.green.withOpacity(0.2) : Colors.blueGrey.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    team.status.name.toUpperCase(),
                                    style: TextStyle(
                                      color: isDeployed ? Colors.greenAccent : Colors.blueGrey.shade200,
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                IconButton(
                                  padding: EdgeInsets.zero,
                                  constraints: const BoxConstraints(),
                                  icon: const Icon(Icons.delete_outline, size: 16, color: Colors.redAccent),
                                  onPressed: () => _service.deleteTeam(team.teamId),
                                )
                              ],
                            ),
                            const Spacer(),
                            Text(
                              team.callsign,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'ID: ${team.teamId} • Cap: ${team.capacityVictims}',
                              style: TextStyle(color: Colors.blueGrey.shade400, fontSize: 12),
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                const Icon(Icons.radio, size: 14, color: Colors.cyan),
                                const SizedBox(width: 4),
                                Text(
                                  team.contactChannel,
                                  style: const TextStyle(color: Colors.cyan, fontSize: 12),
                                ),
                              ],
                            )
                          ],
                        ),
                      );
                    },
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
