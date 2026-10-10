import 'package:flutter/material.dart';

import '../../services/supabase_service.dart';

class TacticalResourceModel {
  final String id;
  final String resourceId;
  final String name;
  final String category;
  final String condition;
  final int totalQuantity;
  final int availableQuantity;
  final int deployedQuantity;
  final String? assignedTeamId;
  final String? assignedIncidentId;

  TacticalResourceModel({
    required this.id, required this.resourceId, required this.name,
    required this.category, required this.condition, required this.totalQuantity,
    required this.availableQuantity, required this.deployedQuantity,
    this.assignedTeamId, this.assignedIncidentId
  });

  factory TacticalResourceModel.fromJson(Map<String, dynamic> json) {
    return TacticalResourceModel(
      id: json['id']?.toString() ?? '',
      resourceId: json['resource_id']?.toString() ?? 'RES-000',
      name: json['name']?.toString() ?? 'Equipment',
      category: json['category']?.toString() ?? 'OTHER',
      condition: json['condition']?.toString() ?? 'GOOD',
      totalQuantity: (json['total_quantity'] as num?)?.toInt() ?? 1,
      availableQuantity: (json['available_quantity'] as num?)?.toInt() ?? 1,
      deployedQuantity: (json['deployed_quantity'] as num?)?.toInt() ?? 0,
      assignedTeamId: json['assigned_team_id']?.toString(),
      assignedIncidentId: json['assigned_incident_id']?.toString(),
    );
  }
}

class ResourcesScreen extends StatefulWidget {
  const ResourcesScreen({super.key});
  @override
  State<ResourcesScreen> createState() => _ResourcesScreenState();
}

class _ResourcesScreenState extends State<ResourcesScreen> {
  final _service = SupabaseService.instance;
  String _categoryFilter = 'ALL';

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
                  Text('Tactical Resources & Inventory', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
                  SizedBox(height: 4),
                  Text('Track boats, medical kits, and vehicles. Prevent over-allocation.', style: TextStyle(color: Colors.white54, fontSize: 14)),
                ],
              ),
              Row(
                children: [
                  _dropdown('Category', _categoryFilter, ['ALL', 'BOATS', 'VEHICLES', 'MEDICAL', 'LIFE_JACKETS'], (v) => setState(() => _categoryFilter = v!)),
                  const SizedBox(width: 12),
                  ElevatedButton.icon(
                    onPressed: () {}, 
                    icon: const Icon(Icons.add), 
                    label: const Text('ADD RESOURCE'),
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0284C7), foregroundColor: Colors.white),
                  )
                ],
              )
            ],
          ),
          const SizedBox(height: 20),
          Expanded(
            child: Container(
              decoration: BoxDecoration(color: const Color(0xFF1E293B), borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.white12)),
              child: StreamBuilder<List<Map<String, dynamic>>>(
                stream: _service.client.from('tactical_resources').stream(primaryKey: ['id']),
                builder: (context, snapshot) {
                  if (!snapshot.hasData) return const Center(child: CircularProgressIndicator());
                  
                  var rawList = snapshot.data!;
                  var resources = rawList.map((j) => TacticalResourceModel.fromJson(j)).toList();

                  if (_categoryFilter != 'ALL') {
                    resources = resources.where((r) => r.category == _categoryFilter).toList();
                  }

                  if (resources.isEmpty) {
                    return const Center(child: Text('No resources available.', style: TextStyle(color: Colors.white54)));
                  }

                  return SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: SingleChildScrollView(
                      child: DataTable(
                        headingRowColor: MaterialStateProperty.all(const Color(0xFF0F172A)),
                        columnSpacing: 40,
                        columns: const [
                          DataColumn(label: Text('RESOURCE', style: TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold))),
                          DataColumn(label: Text('CONDITION', style: TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold))),
                          DataColumn(label: Text('INVENTORY (AVAIL/DEPLOYED)', style: TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold))),
                          DataColumn(label: Text('ASSIGNMENTS', style: TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold))),
                          DataColumn(label: Text('ACTIONS', style: TextStyle(color: Colors.white54, fontSize: 11, fontWeight: FontWeight.bold))),
                        ],
                        rows: resources.map((res) {
                          return DataRow(
                            cells: [
                              DataCell(Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(res.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                  Text('${res.resourceId} • ${res.category}', style: const TextStyle(color: Colors.cyan, fontSize: 10)),
                                ],
                              )),
                              DataCell(_buildConditionBadge(res.condition)),
                              DataCell(Row(
                                children: [
                                  Text('${res.availableQuantity}', style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 16)),
                                  const Text(' / ', style: TextStyle(color: Colors.white54)),
                                  Text('${res.deployedQuantity}', style: const TextStyle(color: Colors.orangeAccent, fontWeight: FontWeight.bold, fontSize: 16)),
                                  const Text(' / ', style: TextStyle(color: Colors.white54)),
                                  Text('${res.totalQuantity}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                                ],
                              )),
                              DataCell(Text(res.assignedTeamId ?? 'UNASSIGNED', style: TextStyle(color: res.assignedTeamId != null ? Colors.blueAccent : Colors.white54, fontSize: 12))),
                              DataCell(Row(
                                children: [
                                  _actionBtn('ALLOCATE', Colors.blueAccent, () {}),
                                  const SizedBox(width: 8),
                                  _actionBtn('EDIT', Colors.blueGrey, () {}),
                                ],
                              )),
                            ],
                          );
                        }).toList(),
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

  Widget _buildConditionBadge(String cond) {
    Color c;
    if (cond == 'NEW' || cond == 'GOOD') { c = Colors.greenAccent; }
    else if (cond == 'NEEDS_REPAIR') { c = Colors.orangeAccent; }
    else { c = Colors.redAccent; }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(color: c.withOpacity(0.1), borderRadius: BorderRadius.circular(4), border: Border.all(color: c.withOpacity(0.5))),
      child: Text(cond, style: TextStyle(color: c, fontSize: 10, fontWeight: FontWeight.bold)),
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

  Widget _dropdown(String label, String val, List<String> items, ValueChanged<String?> onChanged) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(color: const Color(0xFF0F172A), borderRadius: BorderRadius.circular(8)),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: val, dropdownColor: const Color(0xFF0F172A),
          style: const TextStyle(color: Colors.white, fontSize: 13),
          items: items.map((i) => DropdownMenuItem(value: i, child: Text('$label: $i'))).toList(),
          onChanged: onChanged,
        ),
      ),
    );
  }
}
