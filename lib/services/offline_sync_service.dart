import 'dart:convert';
import 'dart:io';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:http/http.dart' as http;
import '../models/lesson.dart';
import '../models/vocabulary.dart';
import '../models/conversation.dart';
import '../models/user_progress.dart';
import '../models/user_achievement.dart';

class OfflineSyncService {
  static const String _baseUrl = 'https://your-api-endpoint.com/api';
  static const String _lessonsKey = 'offline_lessons';
  static const String _vocabularyKey = 'offline_vocabulary';
  static const String _conversationsKey = 'offline_conversations';
  static const String _progressKey = 'offline_progress';
  static const String _achievementsKey = 'offline_achievements';
  static const String _lastSyncKey = 'last_sync_timestamp';
  static const String _pendingActionsKey = 'pending_actions';

  final Connectivity _connectivity = Connectivity();
  late SharedPreferences _prefs;

  Future<void> initialize() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // Check if device is online
  Future<bool> isOnline() async {
    final connectivityResult = await _connectivity.checkConnectivity();
    return connectivityResult != ConnectivityResult.none;
  }

  // Download content for offline use
  Future<Map<String, dynamic>> downloadOfflineContent({
    required int userId,
    String? level,
  }) async {
    if (!await isOnline()) {
      throw Exception('No internet connection available');
    }

    try {
      final results = await Future.wait([
        _downloadLessons(level: level),
        _downloadVocabulary(level: level),
        _downloadConversations(level: level),
        _downloadUserProgress(userId),
        _downloadAchievements(userId),
      ]);

      // Store downloaded content locally
      await _storeOfflineData(_lessonsKey, results[0]);
      await _storeOfflineData(_vocabularyKey, results[1]);
      await _storeOfflineData(_conversationsKey, results[2]);
      await _storeOfflineData(_progressKey, results[3]);
      await _storeOfflineData(_achievementsKey, results[4]);

      // Update last sync timestamp
      await _prefs.setInt(_lastSyncKey, DateTime.now().millisecondsSinceEpoch);

      return {
        'lessons': results[0],
        'vocabulary': results[1],
        'conversations': results[2],
        'progress': results[3],
        'achievements': results[4],
        'syncTimestamp': DateTime.now().millisecondsSinceEpoch,
      };
    } catch (e) {
      throw Exception('Failed to download offline content: $e');
    }
  }

  // Load offline content
  Future<Map<String, dynamic>> loadOfflineContent() async {
    try {
      final lessons = await _loadOfflineData(_lessonsKey);
      final vocabulary = await _loadOfflineData(_vocabularyKey);
      final conversations = await _loadOfflineData(_conversationsKey);
      final progress = await _loadOfflineData(_progressKey);
      final achievements = await _loadOfflineData(_achievementsKey);
      final lastSync = _prefs.getInt(_lastSyncKey);

      return {
        'lessons': lessons ?? [],
        'vocabulary': vocabulary ?? [],
        'conversations': conversations ?? [],
        'progress': progress ?? [],
        'achievements': achievements ?? [],
        'lastSync': lastSync != null 
            ? DateTime.fromMillisecondsSinceEpoch(lastSync)
            : null,
      };
    } catch (e) {
      throw Exception('Failed to load offline content: $e');
    }
  }

  // Queue action for later sync when online
  Future<void> queueOfflineAction({
    required String actionType,
    required Map<String, dynamic> data,
  }) async {
    try {
      final pendingActions = await _loadPendingActions();
      
      final action = {
        'id': DateTime.now().millisecondsSinceEpoch.toString(),
        'type': actionType,
        'data': data,
        'timestamp': DateTime.now().millisecondsSinceEpoch,
      };

      pendingActions.add(action);
      await _storePendingActions(pendingActions);
    } catch (e) {
      print('Failed to queue offline action: $e');
    }
  }

  // Sync pending actions when online
  Future<bool> syncPendingActions() async {
    if (!await isOnline()) {
      return false;
    }

    try {
      final pendingActions = await _loadPendingActions();
      
      if (pendingActions.isEmpty) {
        return true;
      }

      final successfulActions = <Map<String, dynamic>>[];

      for (final action in pendingActions) {
        try {
          final success = await _executeAction(action);
          if (success) {
            successfulActions.add(action);
          }
        } catch (e) {
          print('Failed to sync action ${action['id']}: $e');
        }
      }

      // Remove successfully synced actions
      pendingActions.removeWhere((action) => 
          successfulActions.any((successful) => successful['id'] == action['id']));
      
      await _storePendingActions(pendingActions);

      return pendingActions.isEmpty;
    } catch (e) {
      print('Failed to sync pending actions: $e');
      return false;
    }
  }

  // Check if content needs update
  Future<bool> needsContentUpdate() async {
    final lastSync = _prefs.getInt(_lastSyncKey);
    if (lastSync == null) return true;

    final lastSyncDate = DateTime.fromMillisecondsSinceEpoch(lastSync);
    final daysSinceSync = DateTime.now().difference(lastSyncDate).inDays;

    return daysSinceSync >= 1; // Update daily
  }

  // Get offline storage size
  Future<Map<String, dynamic>> getStorageInfo() async {
    try {
      final lessons = await _loadOfflineData(_lessonsKey);
      final vocabulary = await _loadOfflineData(_vocabularyKey);
      final conversations = await _loadOfflineData(_conversationsKey);
      final progress = await _loadOfflineData(_progressKey);
      final achievements = await _loadOfflineData(_achievementsKey);
      final pendingActions = await _loadPendingActions();

      return {
        'lessonsCount': lessons?.length ?? 0,
        'vocabularyCount': vocabulary?.length ?? 0,
        'conversationsCount': conversations?.length ?? 0,
        'progressCount': progress?.length ?? 0,
        'achievementsCount': achievements?.length ?? 0,
        'pendingActionsCount': pendingActions.length,
        'lastSync': _prefs.getInt(_lastSyncKey),
      };
    } catch (e) {
      return {
        'error': 'Failed to get storage info: $e',
      };
    }
  }

  // Clear offline data
  Future<void> clearOfflineData() async {
    try {
      await Future.wait([
        _prefs.remove(_lessonsKey),
        _prefs.remove(_vocabularyKey),
        _prefs.remove(_conversationsKey),
        _prefs.remove(_progressKey),
        _prefs.remove(_achievementsKey),
        _prefs.remove(_lastSyncKey),
        _prefs.remove(_pendingActionsKey),
      ]);
    } catch (e) {
      throw Exception('Failed to clear offline data: $e');
    }
  }

  // Private helper methods
  Future<List<dynamic>> _downloadLessons({String? level}) async {
    final url = level != null 
        ? '$_baseUrl/lessons?level=$level'
        : '$_baseUrl/lessons';
    
    final response = await http.get(Uri.parse(url));
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to download lessons');
    }
  }

  Future<List<dynamic>> _downloadVocabulary({String? level}) async {
    final url = level != null 
        ? '$_baseUrl/vocabulary?level=$level'
        : '$_baseUrl/vocabulary';
    
    final response = await http.get(Uri.parse(url));
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to download vocabulary');
    }
  }

  Future<List<dynamic>> _downloadConversations({String? level}) async {
    final url = level != null 
        ? '$_baseUrl/conversations?level=$level'
        : '$_baseUrl/conversations';
    
    final response = await http.get(Uri.parse(url));
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to download conversations');
    }
  }

  Future<List<dynamic>> _downloadUserProgress(int userId) async {
    final response = await http.get(
      Uri.parse('$_baseUrl/users/$userId/progress'),
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to download user progress');
    }
  }

  Future<List<dynamic>> _downloadAchievements(int userId) async {
    final response = await http.get(
      Uri.parse('$_baseUrl/users/$userId/achievements'),
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to download achievements');
    }
  }

  Future<void> _storeOfflineData(String key, List<dynamic> data) async {
    final jsonString = json.encode(data);
    await _prefs.setString(key, jsonString);
  }

  Future<List<dynamic>?> _loadOfflineData(String key) async {
    final jsonString = _prefs.getString(key);
    if (jsonString != null) {
      return json.decode(jsonString);
    }
    return null;
  }

  Future<List<Map<String, dynamic>>> _loadPendingActions() async {
    final jsonString = _prefs.getString(_pendingActionsKey);
    if (jsonString != null) {
      final List<dynamic> decoded = json.decode(jsonString);
      return decoded.cast<Map<String, dynamic>>();
    }
    return [];
  }

  Future<void> _storePendingActions(List<Map<String, dynamic>> actions) async {
    final jsonString = json.encode(actions);
    await _prefs.setString(_pendingActionsKey, jsonString);
  }

  Future<bool> _executeAction(Map<String, dynamic> action) async {
    try {
      final actionType = action['type'];
      final data = action['data'];

      switch (actionType) {
        case 'lesson_completed':
          return await _syncLessonCompletion(data);
        case 'vocabulary_learned':
          return await _syncVocabularyLearned(data);
        case 'conversation_completed':
          return await _syncConversationCompletion(data);
        case 'progress_updated':
          return await _syncProgressUpdate(data);
        case 'achievement_unlocked':
          return await _syncAchievementUnlock(data);
        default:
          print('Unknown action type: $actionType');
          return false;
      }
    } catch (e) {
      print('Failed to execute action: $e');
      return false;
    }
  }

  Future<bool> _syncLessonCompletion(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/lessons/${data['lessonId']}/complete'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(data),
    );
    return response.statusCode == 200;
  }

  Future<bool> _syncVocabularyLearned(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/vocabulary/${data['vocabularyId']}/learned'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(data),
    );
    return response.statusCode == 200;
  }

  Future<bool> _syncConversationCompletion(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/conversations/complete'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(data),
    );
    return response.statusCode == 200;
  }

  Future<bool> _syncProgressUpdate(Map<String, dynamic> data) async {
    final response = await http.put(
      Uri.parse('$_baseUrl/users/${data['userId']}/progress'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(data),
    );
    return response.statusCode == 200;
  }

  Future<bool> _syncAchievementUnlock(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/users/${data['userId']}/achievements'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(data),
    );
    return response.statusCode == 200;
  }
}