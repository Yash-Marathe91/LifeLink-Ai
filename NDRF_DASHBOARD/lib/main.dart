import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:google_fonts/google_fonts.dart';

import 'screens/shell.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await dotenv.load(fileName: ".env");

  await Supabase.initialize(
    url: dotenv.env['SUPABASE_URL']!,
    anonKey: dotenv.env['SUPABASE_ANON_KEY']!,
  );

  runApp(const NDRFDashboardApp());
}

class NDRFDashboardApp extends StatelessWidget {
  const NDRFDashboardApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NDRF Tactical Dashboard',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        textTheme: ThemeData.dark().textTheme.apply(
          bodyColor: Colors.white,
          displayColor: Colors.white,
        ),
        colorScheme: ColorScheme.dark(
          primary: const Color(0xFF0284C7),
          surface: const Color(0xFF1E293B),
          background: const Color(0xFF0F172A),
        ),
        useMaterial3: true,
      ),
      debugShowCheckedModeBanner: false,
      home: const DashboardShell(),
    );
  }
}
