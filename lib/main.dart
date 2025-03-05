import 'package:flutter/material.dart';
import 'pages/lessons_page.dart';  // Import the LessonsPage class
import 'pages/videos_page.dart';
import 'pages/voice_page.dart';

void main() {
  runApp(JapaneseLearningApp());
}

class JapaneseLearningApp extends StatefulWidget {
  @override
  _JapaneseLearningAppState createState() => _JapaneseLearningAppState();
}

class _JapaneseLearningAppState extends State<JapaneseLearningApp> {
  int _currentIndex = 0;

  // Make sure these class names match the actual classes defined in the imported files
  final List<Widget> _pages = [
    LessonsPage(),     // From lessons_page.dart
    VideosPage(),      // From videos_page.dart
    VoicePage(),       // Changed to match voice_page.dart
  ];

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Japanese Learning App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: Scaffold(
        body: _pages[_currentIndex],
        bottomNavigationBar: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) {
            setState(() => _currentIndex = index);
          },
          items: [
            BottomNavigationBarItem(
              icon: Icon(Icons.article),
              label: 'Lessons',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.video_library),
              label: 'Videos',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.record_voice_over),
              label: 'Voice',
            ),
          ],
        ),
      ),
    );
  }
}