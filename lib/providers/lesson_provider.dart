import 'package:flutter/foundation.dart';
import '../models/lesson.dart';
import '../models/vocabulary.dart';
import '../models/user_progress.dart';
import '../services/database_service.dart';

class LessonProvider with ChangeNotifier {
  final DatabaseService _databaseService = DatabaseService();
  
  List<Lesson> _lessons = [];
  List<Vocabulary> _vocabulary = [];
  Map<int, UserProgress> _userProgress = {};
  bool _isLoading = false;
  String? _error;

  // Getters
  List<Lesson> get lessons => _lessons;
  List<Vocabulary> get vocabulary => _vocabulary;
  Map<int, UserProgress> get userProgress => _userProgress;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Get lessons by level
  List<Lesson> getLessonsByLevel(String level) {
    return _lessons.where((lesson) => lesson.level == level).toList();
  }

  // Get vocabulary by lesson
  List<Vocabulary> getVocabularyByLesson(int lessonId) {
    return _vocabulary.where((vocab) => vocab.lessonId == lessonId).toList();
  }

  // Get user progress for a specific lesson
  UserProgress? getProgressForLesson(int lessonId, {int userId = 1}) {
    return _userProgress[lessonId];
  }

  // Get completion percentage for all lessons
  double get overallProgress {
    if (_lessons.isEmpty) return 0.0;
    
    int completedLessons = _lessons.where((lesson) => lesson.isCompleted).length;
    return (completedLessons / _lessons.length) * 100;
  }

  // Initialize data
  Future<void> initializeData() async {
    await loadLessons();
    await loadVocabulary();
    await loadUserProgress();
  }

  // Load all lessons
  Future<void> loadLessons() async {
    _setLoading(true);
    try {
      _lessons = await _databaseService.getAllLessons();
      _clearError();
    } catch (e) {
      _setError('Failed to load lessons: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Load all vocabulary
  Future<void> loadVocabulary() async {
    _setLoading(true);
    try {
      _vocabulary = await _databaseService.getAllVocabulary();
      _clearError();
    } catch (e) {
      _setError('Failed to load vocabulary: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Load user progress
  Future<void> loadUserProgress({int userId = 1}) async {
    _setLoading(true);
    try {
      final progressList = await _databaseService.getAllUserProgress(userId);
      _userProgress = {
        for (var progress in progressList) progress.lessonId: progress
      };
      _clearError();
    } catch (e) {
      _setError('Failed to load user progress: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Add a new lesson
  Future<void> addLesson(Lesson lesson) async {
    _setLoading(true);
    try {
      final id = await _databaseService.insertLesson(lesson);
      final newLesson = lesson.copyWith(id: id);
      _lessons.add(newLesson);
      _lessons.sort((a, b) => a.order.compareTo(b.order));
      _clearError();
      notifyListeners();
    } catch (e) {
      _setError('Failed to add lesson: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Update lesson completion status
  Future<void> markLessonCompleted(int lessonId, {int userId = 1}) async {
    try {
      final lessonIndex = _lessons.indexWhere((lesson) => lesson.id == lessonId);
      if (lessonIndex != -1) {
        final updatedLesson = _lessons[lessonIndex].copyWith(
          isCompleted: true,
          completedAt: DateTime.now(),
        );
        
        await _databaseService.updateLesson(updatedLesson);
        _lessons[lessonIndex] = updatedLesson;

        // Update user progress
        final existingProgress = _userProgress[lessonId];
        final updatedProgress = (existingProgress ?? UserProgress(
          userId: userId,
          lessonId: lessonId,
        )).copyWith(
          completionPercentage: 100.0,
          lastAccessed: DateTime.now(),
        );

        await _databaseService.insertOrUpdateProgress(updatedProgress);
        _userProgress[lessonId] = updatedProgress;

        _clearError();
        notifyListeners();
      }
    } catch (e) {
      _setError('Failed to mark lesson as completed: $e');
    }
  }

  // Update user progress
  Future<void> updateProgress({
    required int lessonId,
    int userId = 1,
    double? completionPercentage,
    int? timeSpentMinutes,
    int? correctAnswers,
    int? totalAnswers,
  }) async {
    try {
      final existingProgress = _userProgress[lessonId];
      final updatedProgress = (existingProgress ?? UserProgress(
        userId: userId,
        lessonId: lessonId,
      )).copyWith(
        completionPercentage: completionPercentage ?? existingProgress?.completionPercentage,
        timeSpentMinutes: (existingProgress?.timeSpentMinutes ?? 0) + (timeSpentMinutes ?? 0),
        correctAnswers: (existingProgress?.correctAnswers ?? 0) + (correctAnswers ?? 0),
        totalAnswers: (existingProgress?.totalAnswers ?? 0) + (totalAnswers ?? 0),
        lastAccessed: DateTime.now(),
      );

      await _databaseService.insertOrUpdateProgress(updatedProgress);
      _userProgress[lessonId] = updatedProgress;

      _clearError();
      notifyListeners();
    } catch (e) {
      _setError('Failed to update progress: $e');
    }
  }

  // Mark vocabulary as learned
  Future<void> markVocabularyLearned(int vocabularyId) async {
    try {
      final vocabIndex = _vocabulary.indexWhere((vocab) => vocab.id == vocabularyId);
      if (vocabIndex != -1) {
        final updatedVocab = _vocabulary[vocabIndex].copyWith(
          isLearned: true,
          reviewCount: _vocabulary[vocabIndex].reviewCount + 1,
          lastReviewed: DateTime.now(),
        );
        
        await _databaseService.updateVocabulary(updatedVocab);
        _vocabulary[vocabIndex] = updatedVocab;

        _clearError();
        notifyListeners();
      }
    } catch (e) {
      _setError('Failed to mark vocabulary as learned: $e');
    }
  }

  // Add vocabulary
  Future<void> addVocabulary(Vocabulary vocabulary) async {
    _setLoading(true);
    try {
      final id = await _databaseService.insertVocabulary(vocabulary);
      final newVocabulary = vocabulary.copyWith(id: id);
      _vocabulary.add(newVocabulary);
      _clearError();
      notifyListeners();
    } catch (e) {
      _setError('Failed to add vocabulary: $e');
    } finally {
      _setLoading(false);
    }
  }

  // Get statistics
  Map<String, dynamic> getStatistics({int userId = 1}) {
    final completedLessons = _lessons.where((lesson) => lesson.isCompleted).length;
    final learnedVocabulary = _vocabulary.where((vocab) => vocab.isLearned).length;
    
    int totalTimeSpent = 0;
    int totalCorrectAnswers = 0;
    int totalAnswers = 0;
    
    for (var progress in _userProgress.values) {
      if (progress.userId == userId) {
        totalTimeSpent += progress.timeSpentMinutes;
        totalCorrectAnswers += progress.correctAnswers;
        totalAnswers += progress.totalAnswers;
      }
    }

    return {
      'completedLessons': completedLessons,
      'totalLessons': _lessons.length,
      'learnedVocabulary': learnedVocabulary,
      'totalVocabulary': _vocabulary.length,
      'totalTimeSpent': totalTimeSpent,
      'overallAccuracy': totalAnswers > 0 ? (totalCorrectAnswers / totalAnswers) * 100 : 0.0,
      'overallProgress': overallProgress,
    };
  }

  // Private helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _error = error;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
  }

  // Clear all data (for testing or reset)
  Future<void> clearAllData() async {
    _setLoading(true);
    try {
      await _databaseService.clearAllData();
      _lessons.clear();
      _vocabulary.clear();
      _userProgress.clear();
      _clearError();
      notifyListeners();
    } catch (e) {
      _setError('Failed to clear data: $e');
    } finally {
      _setLoading(false);
    }
  }
}