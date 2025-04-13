import 'package:flutter/material.dart';

class VideosPage extends StatefulWidget {
  @override
  _VideosPageState createState() => _VideosPageState();
}

class _VideosPageState extends State<VideosPage> {
  // Sample video data - would typically come from a database or API
  final List<Map<String, dynamic>> _videos = [
    {
      'title': 'Introduction to Hiragana',
      'description': 'Learn the basics of the Hiragana writing system',
      'duration': '10:25',
      'level': 'Beginner',
      'thumbnail': 'assets/images/hiragana_video.jpg',
    },
    {
      'title': 'Katakana Made Simple',
      'description': 'A comprehensive guide to Katakana characters',
      'duration': '12:15',
      'level': 'Beginner',
      'thumbnail': 'assets/images/katakana_video.jpg',
    },
    {
      'title': 'Daily Japanese Conversations',
      'description': 'Common phrases used in everyday situations',
      'duration': '15:30',
      'level': 'Intermediate',
      'thumbnail': 'assets/images/conversations_video.jpg',
    },
    {
      'title': 'Japanese Kanji Stroke Order',
      'description': 'Learn the correct way to write basic Kanji',
      'duration': '20:45',
      'level': 'Intermediate',
      'thumbnail': 'assets/images/kanji_video.jpg',
    },
    {
      'title': 'Japanese Culture & Etiquette',
      'description': 'Understanding cultural aspects of Japan',
      'duration': '18:10',
      'level': 'All Levels',
      'thumbnail': 'assets/images/culture_video.jpg',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Japanese Learning Videos'),
      ),
      body: ListView.builder(
        itemCount: _videos.length,
        itemBuilder: (context, index) {
          final video = _videos[index];
          return Card(
            margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Video thumbnail placeholder
                Container(
                  height: 180,
                  width: double.infinity,
                  color: Colors.grey[300],
                  child: Center(
                    child: Icon(
                      Icons.play_circle_outline,
                      size: 64,
                      color: Colors.grey[700],
                    ),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        video['title'],
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(video['description']),
                      SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Chip(
                            label: Text(video['level']),
                            backgroundColor: video['level'] == 'Beginner'
                                ? Colors.green[100]
                                : video['level'] == 'Intermediate'
                                ? Colors.orange[100]
                                : Colors.blue[100],
                          ),
                          Text(
                            'Duration: ${video['duration']}',
                            style: TextStyle(
                              fontWeight: FontWeight.w500,
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
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.filter_list),
        onPressed: () {
          // TODO: Implement video filtering functionality
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Video filtering not implemented yet')),
          );
        },
        tooltip: 'Filter videos',
      ),
    );
  }
}