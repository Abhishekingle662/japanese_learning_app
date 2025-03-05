import 'package:flutter/material.dart';

class VoicePage extends StatefulWidget {
  @override
  _VoicePageState createState() => _VoicePageState();
}

class _VoicePageState extends State<VoicePage> {
  bool _isRecording = false;

  // Sample data for pronunciation exercises
  final List<Map<String, dynamic>> _pronunciationExercises = [
    {
      'japanese': 'こんにちは',
      'romaji': 'Konnichiwa',
      'meaning': 'Hello',
      'category': 'Greetings',
    },
    {
      'japanese': 'ありがとう',
      'romaji': 'Arigatou',
      'meaning': 'Thank you',
      'category': 'Greetings',
    },
    {
      'japanese': 'さようなら',
      'romaji': 'Sayounara',
      'meaning': 'Goodbye',
      'category': 'Greetings',
    },
    {
      'japanese': 'おはようございます',
      'romaji': 'Ohayou gozaimasu',
      'meaning': 'Good morning',
      'category': 'Greetings',
    },
    {
      'japanese': 'お元気ですか',
      'romaji': 'O-genki desu ka',
      'meaning': 'How are you?',
      'category': 'Phrases',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Pronunciation Practice'),
      ),
      body: Column(
        children: [
          // Voice recording status card
          Card(
            margin: EdgeInsets.all(16),
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                children: [
                  Text(
                    'Practice Your Pronunciation',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Select a word below and tap the mic button to record your pronunciation.',
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 16),
                  Icon(
                    _isRecording ? Icons.mic : Icons.mic_none,
                    size: 50,
                    color: _isRecording ? Colors.red : Colors.grey,
                  ),
                  SizedBox(height: 8),
                  Text(_isRecording ? 'Recording...' : 'Ready to record'),
                ],
              ),
            ),
          ),

          // List of pronunciation exercises
          Expanded(
            child: ListView.builder(
              itemCount: _pronunciationExercises.length,
              itemBuilder: (context, index) {
                final exercise = _pronunciationExercises[index];
                return Card(
                  margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: ListTile(
                    title: Text(
                      exercise['japanese'],
                      style: TextStyle(fontSize: 22),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('${exercise['romaji']} - ${exercise['meaning']}'),
                        SizedBox(height: 4),
                        Chip(
                          label: Text(exercise['category']),
                          backgroundColor: Colors.blue[100],
                        ),
                      ],
                    ),
                    trailing: IconButton(
                      icon: Icon(Icons.play_arrow),
                      onPressed: () {
                        // TODO: Implement audio playback for example
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Playing example pronunciation...')),
                        );
                      },
                      tooltip: 'Listen to example',
                    ),
                    isThreeLine: true,
                    onTap: () {
                      // TODO: Show detailed practice view
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Practice ${exercise['japanese']}...')),
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          setState(() {
            _isRecording = !_isRecording;
          });

          // TODO: Implement actual recording functionality
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(_isRecording ? 'Started recording' : 'Stopped recording'),
            ),
          );
        },
        tooltip: 'Record pronunciation',
        child: Icon(_isRecording ? Icons.stop : Icons.mic),
        backgroundColor: _isRecording ? Colors.red : null,
      ),
    );
  }
}