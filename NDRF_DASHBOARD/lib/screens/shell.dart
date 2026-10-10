import 'package:flutter/material.dart';


import 'dashboard/overview_screen.dart';
import 'dashboard/verification_screen.dart';
import 'dashboard/statistics_screen.dart';
import 'crud/incidents_crud.dart';
import 'crud/teams_crud.dart';
import 'crud/resources_screen.dart';

class DashboardShell extends StatefulWidget {
  const DashboardShell({super.key});

  @override
  State<DashboardShell> createState() => _DashboardShellState();
}

class _DashboardShellState extends State<DashboardShell> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const OverviewScreen(),
    const IncidentsCRUD(),
    const VerificationScreen(),
    const TeamsCRUD(),
    const ResourcesScreen(),
    const StatisticsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          // Sidebar
          Container(
            width: 260,
            color: const Color(0xFF1E293B),
            child: Column(
              children: [
                const SizedBox(height: 30),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0284C7).withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.security, color: Color(0xFF38BDF8), size: 28),
                    ),
                    const SizedBox(width: 12),
                    const Text(
                      'NDRF\nCOMMAND',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.5,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 40),
                _buildNavItem(0, 'Tactical Map', Icons.map_outlined),
                _buildNavItem(1, 'Incoming Incidents', Icons.warning_amber_rounded),
                _buildNavItem(2, 'Verification & Review', Icons.rule),
                _buildNavItem(3, 'Rescue Teams', Icons.local_shipping_outlined),
                _buildNavItem(4, 'Tactical Resources', Icons.inventory_2_outlined),
                _buildNavItem(5, 'Statistics & KPIs', Icons.analytics_outlined),
                const Spacer(),
                const Padding(
                  padding: EdgeInsets.all(20),
                  child: Text(
                    'LifeLink AI v2.0',
                    style: TextStyle(color: Colors.white38, fontSize: 12),
                  ),
                ),
              ],
            ),
          ),
          
          // Main Content Area
          Expanded(
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 300),
              child: _screens[_selectedIndex],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem(int index, String title, IconData icon) {
    final isSelected = _selectedIndex == index;
    return InkWell(
      onTap: () => setState(() => _selectedIndex = index),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF0284C7).withOpacity(0.15) : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: isSelected 
              ? Border.all(color: const Color(0xFF0284C7).withOpacity(0.5))
              : Border.all(color: Colors.transparent),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              size: 20,
              color: isSelected ? const Color(0xFF38BDF8) : Colors.blueGrey.shade400,
            ),
            const SizedBox(width: 14),
            Text(
              title,
              style: TextStyle(
                color: isSelected ? Colors.white : Colors.blueGrey.shade300,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
