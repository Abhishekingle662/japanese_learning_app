class UserAchievement {
  final int? id;
  final int userId;
  final String achievementId;
  final String title;
  final String description;
  final String iconName;
  final int points;
  final AchievementType type;
  final bool isUnlocked;
  final DateTime? unlockedAt;
  final DateTime createdAt;

  UserAchievement({
    this.id,
    required this.userId,
    required this.achievementId,
    required this.title,
    required this.description,
    required this.iconName,
    required this.points,
    required this.type,
    this.isUnlocked = false,
    this.unlockedAt,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'user_id': userId,
      'achievement_id': achievementId,
      'title': title,
      'description': description,
      'icon_name': iconName,
      'points': points,
      'type': type.toString(),
      'is_unlocked': isUnlocked ? 1 : 0,
      'unlocked_at': unlockedAt?.millisecondsSinceEpoch,
      'created_at': createdAt.millisecondsSinceEpoch,
    };
  }

  factory UserAchievement.fromMap(Map<String, dynamic> map) {
    return UserAchievement(
      id: map['id']?.toInt(),
      userId: map['user_id']?.toInt() ?? 0,
      achievementId: map['achievement_id'] ?? '',
      title: map['title'] ?? '',
      description: map['description'] ?? '',
      iconName: map['icon_name'] ?? '',
      points: map['points']?.toInt() ?? 0,
      type: AchievementType.values.firstWhere(
        (e) => e.toString() == map['type'],
        orElse: () => AchievementType.lesson,
      ),
      isUnlocked: (map['is_unlocked'] ?? 0) == 1,
      unlockedAt: map['unlocked_at'] != null
          ? DateTime.fromMillisecondsSinceEpoch(map['unlocked_at'])
          : null,
      createdAt: DateTime.fromMillisecondsSinceEpoch(map['created_at']),
    );
  }

  UserAchievement copyWith({
    int? id,
    int? userId,
    String? achievementId,
    String? title,
    String? description,
    String? iconName,
    int? points,
    AchievementType? type,
    bool? isUnlocked,
    DateTime? unlockedAt,
    DateTime? createdAt,
  }) {
    return UserAchievement(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      achievementId: achievementId ?? this.achievementId,
      title: title ?? this.title,
      description: description ?? this.description,
      iconName: iconName ?? this.iconName,
      points: points ?? this.points,
      type: type ?? this.type,
      isUnlocked: isUnlocked ?? this.isUnlocked,
      unlockedAt: unlockedAt ?? this.unlockedAt,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}

enum AchievementType {
  lesson,
  vocabulary,
  conversation,
  streak,
  time,
  accuracy,
  special,
}

class UserStats {
  final int? id;
  final int userId;
  final int totalPoints;
  final int currentStreak;
  final int longestStreak;
  final int totalStudyTimeMinutes;
  final int conversationsCompleted;
  final int vocabularyLearned;
  final int lessonsCompleted;
  final double averageAccuracy;
  final int level;
  final DateTime? lastStudyDate;
  final DateTime createdAt;
  final DateTime updatedAt;

  UserStats({
    this.id,
    required this.userId,
    this.totalPoints = 0,
    this.currentStreak = 0,
    this.longestStreak = 0,
    this.totalStudyTimeMinutes = 0,
    this.conversationsCompleted = 0,
    this.vocabularyLearned = 0,
    this.lessonsCompleted = 0,
    this.averageAccuracy = 0.0,
    this.level = 1,
    this.lastStudyDate,
    DateTime? createdAt,
    DateTime? updatedAt,
  })  : createdAt = createdAt ?? DateTime.now(),
        updatedAt = updatedAt ?? DateTime.now();

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'user_id': userId,
      'total_points': totalPoints,
      'current_streak': currentStreak,
      'longest_streak': longestStreak,
      'total_study_time_minutes': totalStudyTimeMinutes,
      'conversations_completed': conversationsCompleted,
      'vocabulary_learned': vocabularyLearned,
      'lessons_completed': lessonsCompleted,
      'average_accuracy': averageAccuracy,
      'level': level,
      'last_study_date': lastStudyDate?.millisecondsSinceEpoch,
      'created_at': createdAt.millisecondsSinceEpoch,
      'updated_at': updatedAt.millisecondsSinceEpoch,
    };
  }

  factory UserStats.fromMap(Map<String, dynamic> map) {
    return UserStats(
      id: map['id']?.toInt(),
      userId: map['user_id']?.toInt() ?? 0,
      totalPoints: map['total_points']?.toInt() ?? 0,
      currentStreak: map['current_streak']?.toInt() ?? 0,
      longestStreak: map['longest_streak']?.toInt() ?? 0,
      totalStudyTimeMinutes: map['total_study_time_minutes']?.toInt() ?? 0,
      conversationsCompleted: map['conversations_completed']?.toInt() ?? 0,
      vocabularyLearned: map['vocabulary_learned']?.toInt() ?? 0,
      lessonsCompleted: map['lessons_completed']?.toInt() ?? 0,
      averageAccuracy: map['average_accuracy']?.toDouble() ?? 0.0,
      level: map['level']?.toInt() ?? 1,
      lastStudyDate: map['last_study_date'] != null
          ? DateTime.fromMillisecondsSinceEpoch(map['last_study_date'])
          : null,
      createdAt: DateTime.fromMillisecondsSinceEpoch(map['created_at']),
      updatedAt: DateTime.fromMillisecondsSinceEpoch(map['updated_at']),
    );
  }

  UserStats copyWith({
    int? id,
    int? userId,
    int? totalPoints,
    int? currentStreak,
    int? longestStreak,
    int? totalStudyTimeMinutes,
    int? conversationsCompleted,
    int? vocabularyLearned,
    int? lessonsCompleted,
    double? averageAccuracy,
    int? level,
    DateTime? lastStudyDate,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return UserStats(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      totalPoints: totalPoints ?? this.totalPoints,
      currentStreak: currentStreak ?? this.currentStreak,
      longestStreak: longestStreak ?? this.longestStreak,
      totalStudyTimeMinutes: totalStudyTimeMinutes ?? this.totalStudyTimeMinutes,
      conversationsCompleted: conversationsCompleted ?? this.conversationsCompleted,
      vocabularyLearned: vocabularyLearned ?? this.vocabularyLearned,
      lessonsCompleted: lessonsCompleted ?? this.lessonsCompleted,
      averageAccuracy: averageAccuracy ?? this.averageAccuracy,
      level: level ?? this.level,
      lastStudyDate: lastStudyDate ?? this.lastStudyDate,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  int get pointsToNextLevel {
    return (level * 1000) - (totalPoints % 1000);
  }

  double get progressToNextLevel {
    final pointsInCurrentLevel = totalPoints % 1000;
    return pointsInCurrentLevel / 1000.0;
  }
}