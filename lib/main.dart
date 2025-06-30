import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'pages/lessons_page.dart';
import 'pages/videos_page.dart';
import 'pages/voice_page.dart';
import 'pages/conversation_page.dart';
import 'pages/profile_page.dart';
import 'providers/lesson_provider.dart';
import 'providers/conversation_provider.dart';
import 'providers/gamification_provider.dart';
import 'providers/offline_provider.dart';

void main() {
  runApp(JapaneseLearningApp());
}

class JapaneseLearningApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => LessonProvider()),
        ChangeNotifierProvider(create: (_) => ConversationProvider()),
        ChangeNotifierProvider(create: (_) => GamificationProvider()),
        ChangeNotifierProvider(create: (_) => OfflineProvider()),
      ],
      child: MaterialApp(
        title: 'Japanese Learning App',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          visualDensity: VisualDensity.adaptivePlatformDensity,
          fontFamily: 'Roboto',
          appBarTheme: AppBarTheme(
            elevation: 0,
            backgroundColor: Colors.blue[600],
            foregroundColor: Colors.white,
          ),
          cardTheme: CardTheme(
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            ),
          ),
        ),
        home: MainScreen(),
      ),
    );
  }
}

class MainScreen extends StatefulWidget {
  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;

  final List<Widget> _pages = [
    LessonsPage(),
    ConversationPage(),
    VoicePage(),
    VideosPage(),
    ProfilePage(),
  ];

  @override
  void initState() {
    super.initState();
    // Initialize all providers when the app starts
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _initializeApp();
    });
  }

  Future<void> _initializeApp() async {
    final lessonProvider = Provider.of<LessonProvider>(context, listen: false);
    final conversationProvider = Provider.of<ConversationProvider>(context, listen: false);
    final gamificationProvider = Provider.of<GamificationProvider>(context, listen: false);
    final offlineProvider = Provider.of<OfflineProvider>(context, listen: false);

    // Initialize offline service first
    await offlineProvider.initialize();

    // Initialize other providers
    await Future.wait([
      lessonProvider.initializeData(),
      conversationProvider.initialize(),
      gamificationProvider.initialize(),
    ]);

    // Check for offline content sync if online
    if (await offlineProvider.isOnline()) {
      if (await offlineProvider.needsContentUpdate()) {
        await offlineProvider.downloadOfflineContent();
      }
      await offlineProvider.syncPendingActions();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() => _currentIndex = index);
        },
        selectedItemColor: Colors.blue[600],
        unselectedItemColor: Colors.grey[600],
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.school),
            label: 'Lessons',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.chat),
            label: 'Chat',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.mic),
            label: 'Voice',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.video_library),
            label: 'Videos',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}