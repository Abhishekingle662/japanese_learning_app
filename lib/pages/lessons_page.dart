import 'package:flutter/material.dart';

class LessonsPage extends StatefulWidget {
  @override
  _LessonsPageState createState() => _LessonsPageState();
}

class _LessonsPageState extends State<LessonsPage> {
  // Sample lesson data - would typically come from a database or API
  final List<Map<String, dynamic>> _lessons = [
    {
      'title': 'Hiragana Basics',
      'description': 'Learn the basic Japanese Hiragana characters',
      'level': 'Beginner',
      'icon': Icons.looks_one,
    },
    {
      'title': 'Katakana Introduction',
      'description': 'Master the Katakana writing system',
      'level': 'Beginner',
      'icon': Icons.looks_two,
    },
    {
      'title': 'Basic Greetings',
      'description': 'Common Japanese greetings and phrases',
      'level': 'Beginner',
      'icon': Icons.record_voice_over,
    },
    {
      'title': 'Numbers & Counting',
      'description': 'Learn how to count in Japanese',
      'level': 'Beginner',
      'icon': Icons.format_list_numbered,
    },
    {
      'title': 'Basic Kanji',
      'description': 'Introduction to your first Kanji characters',
      'level': 'Intermediate',
      'icon': Icons.translate,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Japanese Lessons'),
      ),
      body: ListView.builder(
        itemCount: _lessons.length,
        itemBuilder: (context, index) {
          final lesson = _lessons[index];
          return Card(
            margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: ListTile(
              leading: CircleAvatar(
                child: Icon(lesson['icon']),
              ),
              title: Text(lesson['title']),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(lesson['description']),
                  SizedBox(height: 4),
                  Chip(
                    label: Text(lesson['level']),
                    backgroundColor: lesson['level'] == 'Beginner'
                        ? Colors.green[100]
                        : Colors.orange[100],
                  ),
                ],
              ),
              isThreeLine: true,
              onTap: () {
                // TODO: Navigate to specific lesson page
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Opening ${lesson['title']}...')),
                );
              },
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.search),
        onPressed: () {
          // TODO: Implement search functionality
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Search not implemented yet')),
          );
        },
        tooltip: 'Search lessons',
      ),
    );
  }
}