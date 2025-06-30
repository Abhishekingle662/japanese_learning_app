import 'dart:math';
import '../models/user_achievement.dart';
import '../models/user_progress.dart';
import '../models/vocabulary.dart';
import '../models/lesson.dart';

class GamificationService {
  static const Map<String, UserAchievement> _achievements = {
    'first_lesson': UserAchievement(
      userId: 1,
      achievementId: 'first_lesson',
      title: 'First Steps',
      description: 'Complete your first lesson',
      iconName: 'school',
      points: 50,
      type: AchievementType.lesson,
    ),
    'vocabulary_master_10': UserAchievement(
      userId: 1,
      achievementId: 'vocabulary_master_10',
      title: 'Word Collector',
      description: 'Learn 10 vocabulary words',
      iconName: 'book',
      points: 100,
      type: AchievementType.vocabulary,
    ),
    'conversation_starter': UserAchievement(
      userId: 1,
      achievementId: 'conversation_starter',
      title: 'Conversation Starter',
      description: 'Complete your first AI conversation',
      iconName: 'chat',
      points: 75,
      type: AchievementType.conversation,
    ),
    'streak_3': UserAchievement(
      userId: 1,
      achievementId: 'streak_3',
      title: 'Consistent Learner',
      description: 'Study for 3 days in a row',
      iconName: 'local_fire_department',
      points: 150,
      type: AchievementType.streak,
    ),
    'streak_7': UserAchievement(
      userId: 1,
      achievementId: 'streak_7',
      title: 'Week Warrior',
      description: 'Study for 7 days in a row',
      iconName: 'whatshot',
      points: 300,
      type: AchievementType.streak,
    ),
    'accuracy_master': UserAchievement(
      userId: 1,
      achievementId: 'accuracy_master',
      title: 'Accuracy Master',
      description: 'Achieve 90% accuracy in lessons',
      iconName: 'target',
      points: 200,
      type: AchievementType.accuracy,
    ),
    'time_scholar': UserAchievement(
      userId: 1,
      achievementId: 'time_scholar',
      title: 'Time Scholar',
      description: 'Study for 10 hours total',
      iconName: 'schedule',
      points: 250,
      type: AchievementType.time,
    ),
    'hiragana_master': UserAchievement(
      userId: 1,
      achievementId: 'hiragana_master',
      title: 'Hiragana Master',
      description: 'Complete all Hiragana lessons',
      iconName: 'translate',
      points: 400,
      type: AchievementType.special,
    ),
  };

  // Calculate points for different activities
  static int calculatePoints({
    required String activityType,
    Map<String, dynamic>? metadata,
  }) {
    switch (activityType) {
      case 'lesson_completed':
        return 50;
      case 'vocabulary_learned':
        return 10;
      case 'conversation_completed':
        final score = metadata?['score'] ?? 0;
        return (score * 0.5).round(); // 0-50 points based on conversation score
      case 'quiz_completed':
        final accuracy = metadata?['accuracy'] ?? 0.0;
        return (accuracy * 0.3).round(); // 0-30 points based on accuracy
      case 'daily_goal_met':
        return 25;
      case 'perfect_lesson':
        return 100; // Bonus for 100% accuracy
      case 'streak_bonus':
        final streakDays = metadata?['streakDays'] ?? 0;
        return streakDays * 5; // 5 points per day in streak
      default:
        return 5; // Default small reward
    }
  }

  // Check for new achievements
  static List<UserAchievement> checkAchievements({
    required UserStats userStats,
    required List<UserProgress> userProgress,
    required List<Vocabulary> learnedVocabulary,
    required List<Lesson> completedLessons,
    required List<UserAchievement> currentAchievements,
  }) {
    final newAchievements = <UserAchievement>[];
    final unlockedIds = currentAchievements
        .where((a) => a.isUnlocked)
        .map((a) => a.achievementId)
        .toSet();

    // Check lesson achievements
    if (completedLessons.isNotEmpty && !unlockedIds.contains('first_lesson')) {
      newAchievements.add(_achievements['first_lesson']!.copyWith(
        isUnlocked: true,
        unlockedAt: DateTime.now(),
      ));
    }

    // Check vocabulary achievements
    if (learnedVocabulary.length >= 10 && !unlockedIds.contains('vocabulary_master_10')) {
      newAchievements.add(_achievements['vocabulary_master_10']!.copyWith(
        isUnlocked: true,
        unlockedAt: DateTime.now(),
      ));
    }

    // Check conversation achievements
    if (userStats.conversationsCompleted >= 1 && !unlockedIds.contains('conversation_starter')) {
      newAchievements.add(_achievements['conversation_starter']!.copyWith(
        isUnlocked: true,
        unlockedAt: DateTime.now(),
      ));
    }

    // Check streak achievements
    if (userStats.currentStreak >= 3 && !unlockedIds.contains('streak_3')) {
      newAchievements.add(_achievements['streak_3']!.copyWith(
        isUnlocked: true,
        unlockedAt: DateTime.now(),
      ));
    }

    if (userStats.currentStreak >= 7 && !unlockedIds.contains('streak_7')) {
      newAchievements.add(_achievements['streak_7']!.copyWith(
        isUnlocked: true,
        unlockedAt: DateTime.now(),
      ));
    }

    // Check accuracy achievements
    if (userStats.averageAccuracy >= 90.0 && !unlockedIds.contains('accuracy_master')) {
      newAchievements.add(_achievements['accuracy_master']!.copyWith(
        isUnlocked: true,
        unlockedAt: DateTime.now(),
      ));
    }

    // Check time achievements
    if (userStats.totalStudyTimeMinutes >= 600 && !unlockedIds.contains('time_scholar')) {
      newAchievements.add(_achievements['time_scholar']!.copyWith(
        isUnlocked: true,
        unlockedAt: DateTime.now(),
      ));
    }

    // Check special achievements
    final hiraganaLessons = completedLessons
        .where((l) => l.category.toLowerCase().contains('hiragana'))
        .length;
    if (hiraganaLessons >= 2 && !unlockedIds.contains('hiragana_master')) {
      newAchievements.add(_achievements['hiragana_master']!.copyWith(
        isUnlocked: true,
        unlockedAt: DateTime.now(),
      ));
    }

    return newAchievements;
  }

  // Calculate user level based on total points
  static int calculateLevel(int totalPoints) {
    return (totalPoints / 1000).floor() + 1;
  }

  // Calculate streak
  static int calculateStreak(DateTime? lastStudyDate) {
    if (lastStudyDate == null) return 0;
    
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final lastStudy = DateTime(lastStudyDate.year, lastStudyDate.month, lastStudyDate.day);
    
    final daysDifference = today.difference(lastStudy).inDays;
    
    if (daysDifference == 0) {
      // Studied today, maintain streak
      return 1; // This should be calculated based on previous streak
    } else if (daysDifference == 1) {
      // Studied yesterday, continue streak
      return 1; // This should be calculated based on previous streak + 1
    } else {
      // Streak broken
      return 0;
    }
  }

  // Generate motivational messages
  static String getMotivationalMessage({
    required UserStats userStats,
    required String context,
  }) {
    final messages = _getMotivationalMessages(context);
    final random = Random();
    
    // Personalize message based on user stats
    String message = messages[random.nextInt(messages.length)];
    
    if (userStats.currentStreak > 0) {
      message += ' You\'re on a ${userStats.currentStreak}-day streak! 🔥';
    }
    
    if (userStats.level > 1) {
      message += ' Level ${userStats.level} learner! 🌟';
    }
    
    return message;
  }

  static List<String> _getMotivationalMessages(String context) {
    switch (context) {
      case 'lesson_completed':
        return [
          'Great job completing that lesson! 🎉',
          'You\'re making excellent progress! 📚',
          'Another step closer to fluency! ✨',
          'Keep up the fantastic work! 💪',
          'Your dedication is paying off! 🌟',
        ];
      case 'vocabulary_learned':
        return [
          'New word mastered! 📖',
          'Your vocabulary is growing! 🌱',
          'One more word closer to fluency! 💫',
          'Excellent vocabulary work! 👏',
          'Building your Japanese foundation! 🏗️',
        ];
      case 'conversation_completed':
        return [
          'Amazing conversation practice! 💬',
          'Your speaking skills are improving! 🗣️',
          'Great job with that conversation! 🎭',
          'You\'re becoming more confident! 💪',
          'Excellent communication practice! 🌟',
        ];
      case 'achievement_unlocked':
        return [
          'Achievement unlocked! 🏆',
          'You\'ve earned a new badge! 🎖️',
          'Incredible milestone reached! 🎯',
          'Your hard work paid off! 💎',
          'New achievement earned! ⭐',
        ];
      default:
        return [
          'Keep learning! 📚',
          'You\'re doing great! 👍',
          'Stay motivated! 💪',
          'Progress is progress! 📈',
          'Every step counts! 👣',
        ];
    }
  }

  // Get daily learning goals
  static Map<String, int> getDailyGoals(String level) {
    switch (level.toLowerCase()) {
      case 'beginner':
        return {
          'lessons': 1,
          'vocabulary': 5,
          'conversations': 1,
          'studyTimeMinutes': 15,
        };
      case 'intermediate':
        return {
          'lessons': 2,
          'vocabulary': 8,
          'conversations': 2,
          'studyTimeMinutes': 25,
        };
      case 'advanced':
        return {
          'lessons': 3,
          'vocabulary': 12,
          'conversations': 3,
          'studyTimeMinutes': 35,
        };
      default:
        return {
          'lessons': 1,
          'vocabulary': 5,
          'conversations': 1,
          'studyTimeMinutes': 15,
        };
    }
  }

  // Check if daily goals are met
  static Map<String, bool> checkDailyGoals({
    required UserStats userStats,
    required String level,
    required DateTime date,
  }) {
    final goals = getDailyGoals(level);
    
    // This is simplified - in a real app, you'd track daily progress
    return {
      'lessons': userStats.lessonsCompleted >= goals['lessons']!,
      'vocabulary': userStats.vocabularyLearned >= goals['vocabulary']!,
      'conversations': userStats.conversationsCompleted >= goals['conversations']!,
      'studyTime': userStats.totalStudyTimeMinutes >= goals['studyTimeMinutes']!,
    };
  }

  // Get all available achievements
  static List<UserAchievement> getAllAchievements({int userId = 1}) {
    return _achievements.values
        .map((achievement) => achievement.copyWith(userId: userId))
        .toList();
  }
}