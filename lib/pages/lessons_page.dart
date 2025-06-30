import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/lesson_provider.dart';
import '../models/lesson.dart';

class LessonsPage extends StatefulWidget {
  @override
  _LessonsPageState createState() => _LessonsPageState();
}

class _LessonsPageState extends State<LessonsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Japanese Lessons'),
        actions: [
          Consumer<LessonProvider>(
            builder: (context, provider, child) {
              final stats = provider.getStatistics();
              return Padding(
                padding: EdgeInsets.all(16.0),
                child: Center(
                  child: Text(
                    '${stats['completedLessons']}/${stats['totalLessons']}',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
              );
            },
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
                    onPressed: () => provider.initializeData(),
                    child: Text('Retry'),
                  ),
                ],
              ),
            );
          }

          if (provider.lessons.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.school, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text(
                    'No lessons available',
                    style: TextStyle(fontSize: 18, color: Colors.grey),
                  ),
                  SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => provider.loadLessons(),
                    child: Text('Refresh'),
                  ),
                ],
              ),
            );
          }

          return Column(
            children: [
              // Progress indicator
              Container(
                padding: EdgeInsets.all(16),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Overall Progress',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          '${provider.overallProgress.toStringAsFixed(1)}%',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.blue,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 8),
                    LinearProgressIndicator(
                      value: provider.overallProgress / 100,
                      backgroundColor: Colors.grey[300],
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
                    ),
                  ],
                ),
              ),
              
              // Lessons list
              Expanded(
                child: ListView.builder(
                  itemCount: provider.lessons.length,
                  itemBuilder: (context, index) {
                    final lesson = provider.lessons[index];
                    final progress = provider.getProgressForLesson(lesson.id!);
                    
                    return Card(
                      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: lesson.isCompleted 
                              ? Colors.green 
                              : _getLevelColor(lesson.level),
                          child: lesson.isCompleted
                              ? Icon(Icons.check, color: Colors.white)
                              : Icon(_getCategoryIcon(lesson.category), color: Colors.white),
                        ),
                        title: Text(lesson.title),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(lesson.description),
                            SizedBox(height: 4),
                            Row(
                              children: [
                                Chip(
                                  label: Text(lesson.level),
                                  backgroundColor: _getLevelColor(lesson.level).withOpacity(0.2),
                                ),
                                SizedBox(width: 8),
                                if (progress != null)
                                  Chip(
                                    label: Text('${progress.completionPercentage.toInt()}%'),
                                    backgroundColor: Colors.blue.withOpacity(0.2),
                                  ),
                              ],
                            ),
                            if (progress != null && progress.completionPercentage > 0)
                              Padding(
                                padding: EdgeInsets.only(top: 8),
                                child: LinearProgressIndicator(
                                  value: progress.completionPercentage / 100,
                                  backgroundColor: Colors.grey[300],
                                  valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
                                ),
                              ),
                          ],
                        ),
                        isThreeLine: true,
                        trailing: lesson.isCompleted
                            ? Icon(Icons.check_circle, color: Colors.green)
                            : Icon(Icons.play_arrow),
                        onTap: () => _openLesson(context, lesson, provider),
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
        child: Icon(Icons.refresh),
        onPressed: () {
          Provider.of<LessonProvider>(context, listen: false).initializeData();
        },
        tooltip: 'Refresh lessons',
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

  IconData _getCategoryIcon(String category) {
    switch (category.toLowerCase()) {
      case 'writing system':
        return Icons.edit;
      case 'conversation':
        return Icons.chat;
      case 'vocabulary':
        return Icons.book;
      case 'grammar':
        return Icons.school;
      default:
        return Icons.article;
    }
  }

  void _openLesson(BuildContext context, Lesson lesson, LessonProvider provider) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(lesson.title),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(lesson.description),
              SizedBox(height: 16),
              Text('Level: ${lesson.level}'),
              Text('Category: ${lesson.category}'),
              SizedBox(height: 16),
              if (!lesson.isCompleted)
                Text(
                  'This lesson is not yet completed.',
                  style: TextStyle(color: Colors.orange),
                ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('Close'),
            ),
            if (!lesson.isCompleted)
              ElevatedButton(
                onPressed: () {
                  provider.markLessonCompleted(lesson.id!);
                  provider.updateProgress(
                    lessonId: lesson.id!,
                    completionPercentage: 100.0,
                    timeSpentMinutes: 15, // Simulated study time
                    correctAnswers: 8,
                    totalAnswers: 10,
                  );
                  Navigator.of(context).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Lesson completed! Great job!'),
                      backgroundColor: Colors.green,
                    ),
                  );
                },
                child: Text('Complete Lesson'),
              ),
          ],
        );
      },
    );
  }
}