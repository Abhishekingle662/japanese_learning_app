import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/lesson_provider.dart';
import '../models/vocabulary.dart';

class VoicePage extends StatefulWidget {
  @override
  _VoicePageState createState() => _VoicePageState();
}

class _VoicePageState extends State<VoicePage> {
  bool _isRecording = false;
  String _selectedCategory = 'All';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Pronunciation Practice'),
        actions: [
          PopupMenuButton<String>(
            onSelected: (String category) {
              setState(() {
                _selectedCategory = category;
              });
            },
            itemBuilder: (BuildContext context) {
              return ['All', 'Greetings', 'Phrases', 'Numbers', 'Food']
                  .map((String category) {
                return PopupMenuItem<String>(
                  value: category,
                  child: Text(category),
                );
              }).toList();
            },
            child: Padding(
              padding: EdgeInsets.all(16.0),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(_selectedCategory),
                  Icon(Icons.arrow_drop_down),
                ],
              ),
            ),
          ),
        ],
      ),
      body: Consumer<LessonProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return Center(child: CircularProgressIndicator());
          }

          if (provider.error != null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.error, size: 64, color: Colors.red),
                  SizedBox(height: 16),
                  Text(
                    'Error: ${provider.error}',
                    style: TextStyle(color: Colors.red),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => provider.loadVocabulary(),
                    child: Text('Retry'),
                  ),
                ],
              ),
            );
          }

          // Filter vocabulary by selected category
          List<Vocabulary> filteredVocabulary = _selectedCategory == 'All'
              ? provider.vocabulary
              : provider.vocabulary
                  .where((vocab) => vocab.category == _selectedCategory)
                  .toList();

          if (filteredVocabulary.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.mic_off, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text(
                    'No vocabulary available for pronunciation practice',
                    style: TextStyle(fontSize: 18, color: Colors.grey),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            );
          }

          return Column(
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

              // Statistics card
              Card(
                margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      Column(
                        children: [
                          Text(
                            '${filteredVocabulary.where((v) => v.isLearned).length}',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.green,
                            ),
                          ),
                          Text('Learned'),
                        ],
                      ),
                      Column(
                        children: [
                          Text(
                            '${filteredVocabulary.length}',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.blue,
                            ),
                          ),
                          Text('Total'),
                        ],
                      ),
                      Column(
                        children: [
                          Text(
                            '${((filteredVocabulary.where((v) => v.isLearned).length / filteredVocabulary.length) * 100).toInt()}%',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.orange,
                            ),
                          ),
                          Text('Progress'),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              // List of pronunciation exercises
              Expanded(
                child: ListView.builder(
                  itemCount: filteredVocabulary.length,
                  itemBuilder: (context, index) {
                    final vocabulary = filteredVocabulary[index];
                    return Card(
                      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: vocabulary.isLearned 
                              ? Colors.green 
                              : _getLevelColor(vocabulary.level),
                          child: vocabulary.isLearned
                              ? Icon(Icons.check, color: Colors.white)
                              : Text(
                                  vocabulary.japanese.substring(0, 1),
                                  style: TextStyle(color: Colors.white),
                                ),
                        ),
                        title: Text(
                          vocabulary.japanese,
                          style: TextStyle(fontSize: 22),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('${vocabulary.romaji} - ${vocabulary.english}'),
                            SizedBox(height: 4),
                            Row(
                              children: [
                                Chip(
                                  label: Text(vocabulary.category),
                                  backgroundColor: Colors.blue[100],
                                ),
                                SizedBox(width: 8),
                                Chip(
                                  label: Text(vocabulary.level),
                                  backgroundColor: _getLevelColor(vocabulary.level).withOpacity(0.2),
                                ),
                                if (vocabulary.reviewCount > 0) ...[
                                  SizedBox(width: 8),
                                  Chip(
                                    label: Text('${vocabulary.reviewCount}x'),
                                    backgroundColor: Colors.grey[200],
                                  ),
                                ],
                              ],
                            ),
                          ],
                        ),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: Icon(Icons.play_arrow),
                              onPressed: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text('Playing example pronunciation for ${vocabulary.japanese}...'),
                                    duration: Duration(seconds: 2),
                                  ),
                                );
                              },
                              tooltip: 'Listen to example',
                            ),
                            if (!vocabulary.isLearned)
                              IconButton(
                                icon: Icon(Icons.check_circle_outline),
                                onPressed: () {
                                  provider.markVocabularyLearned(vocabulary.id!);
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text('Marked ${vocabulary.japanese} as learned!'),
                                      backgroundColor: Colors.green,
                                    ),
                                  );
                                },
                                tooltip: 'Mark as learned',
                              ),
                          ],
                        ),
                        isThreeLine: true,
                        onTap: () => _practiceVocabulary(context, vocabulary, provider),
                      ),
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          setState(() {
            _isRecording = !_isRecording;
          });

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(_isRecording ? 'Started recording' : 'Stopped recording'),
              duration: Duration(seconds: 1),
            ),
          );

          // Simulate recording duration
          if (_isRecording) {
            Future.delayed(Duration(seconds: 3), () {
              if (mounted && _isRecording) {
                setState(() {
                  _isRecording = false;
                });
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Recording completed! Analyzing pronunciation...'),
                    backgroundColor: Colors.blue,
                  ),
                );
              }
            });
          }
        },
        tooltip: 'Record pronunciation',
        child: Icon(_isRecording ? Icons.stop : Icons.mic),
        backgroundColor: _isRecording ? Colors.red : null,
      ),
    );
  }

  Color _getLevelColor(String level) {
    switch (level.toLowerCase()) {
      case 'beginner':
        return Colors.green;
      case 'intermediate':
        return Colors.orange;
      case 'advanced':
        return Colors.red;
      default:
        return Colors.blue;
    }
  }

  void _practiceVocabulary(BuildContext context, Vocabulary vocabulary, LessonProvider provider) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Practice: ${vocabulary.japanese}'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                vocabulary.japanese,
                style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              Text(
                'Romaji: ${vocabulary.romaji}',
                style: TextStyle(fontSize: 18),
              ),
              SizedBox(height: 8),
              Text(
                'English: ${vocabulary.english}',
                style: TextStyle(fontSize: 18),
              ),
              SizedBox(height: 16),
              Text(
                'Category: ${vocabulary.category}',
                style: TextStyle(color: Colors.grey[600]),
              ),
              Text(
                'Level: ${vocabulary.level}',
                style: TextStyle(color: Colors.grey[600]),
              ),
              if (vocabulary.reviewCount > 0) ...[
                SizedBox(height: 8),
                Text(
                  'Reviewed ${vocabulary.reviewCount} times',
                  style: TextStyle(color: Colors.grey[600]),
                ),
              ],
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('Close'),
            ),
            ElevatedButton.icon(
              onPressed: () {
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Playing pronunciation for ${vocabulary.japanese}'),
                    duration: Duration(seconds: 2),
                  ),
                );
              },
              icon: Icon(Icons.play_arrow),
              label: Text('Play Audio'),
            ),
            if (!vocabulary.isLearned)
              ElevatedButton.icon(
                onPressed: () {
                  provider.markVocabularyLearned(vocabulary.id!);
                  Navigator.of(context).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Great! Marked ${vocabulary.japanese} as learned!'),
                      backgroundColor: Colors.green,
                    ),
                  );
                },
                icon: Icon(Icons.check),
                label: Text('Mark Learned'),
                style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
              ),
          ],
        );
      },
    );
  }
}