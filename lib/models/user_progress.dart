class UserProgress {
  final int? id;
  final int userId;
  final int lessonId;
  final double completionPercentage;
  final int timeSpentMinutes;
  final int correctAnswers;
  final int totalAnswers;
  final DateTime? lastAccessed;
  final DateTime createdAt;
  final DateTime updatedAt;

  UserProgress({
    this.id,
    required this.userId,
    required this.lessonId,
    this.completionPercentage = 0.0,
    this.timeSpentMinutes = 0,
    this.correctAnswers = 0,
    this.totalAnswers = 0,
    this.lastAccessed,
    DateTime? createdAt,
    DateTime? updatedAt,
  })  : createdAt = createdAt ?? DateTime.now(),
        updatedAt = updatedAt ?? DateTime.now();

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'user_id': userId,
      'lesson_id': lessonId,
      'completion_percentage': completionPercentage,
      'time_spent_minutes': timeSpentMinutes,
      'correct_answers': correctAnswers,
      'total_answers': totalAnswers,
      'last_accessed': lastAccessed?.millisecondsSinceEpoch,
      'created_at': createdAt.millisecondsSinceEpoch,
      'updated_at': updatedAt.millisecondsSinceEpoch,
    };
  }

  factory UserProgress.fromMap(Map<String, dynamic> map) {
    return UserProgress(
      id: map['id']?.toInt(),
      userId: map['user_id']?.toInt() ?? 0,
      lessonId: map['lesson_id']?.toInt() ?? 0,
      completionPercentage: map['completion_percentage']?.toDouble() ?? 0.0,
      timeSpentMinutes: map['time_spent_minutes']?.toInt() ?? 0,
      correctAnswers: map['correct_answers']?.toInt() ?? 0,
      totalAnswers: map['total_answers']?.toInt() ?? 0,
      lastAccessed: map['last_accessed'] != null
          ? DateTime.fromMillisecondsSinceEpoch(map['last_accessed'])
          : null,
      createdAt: DateTime.fromMillisecondsSinceEpoch(map['created_at']),
      updatedAt: DateTime.fromMillisecondsSinceEpoch(map['updated_at']),
    );
  }

  UserProgress copyWith({
    int? id,
    int? userId,
    int? lessonId,
    double? completionPercentage,
    int? timeSpentMinutes,
    int? correctAnswers,
    int? totalAnswers,
    DateTime? lastAccessed,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return UserProgress(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      lessonId: lessonId ?? this.lessonId,
      completionPercentage: completionPercentage ?? this.completionPercentage,
      timeSpentMinutes: timeSpentMinutes ?? this.timeSpentMinutes,
      correctAnswers: correctAnswers ?? this.correctAnswers,
      totalAnswers: totalAnswers ?? this.totalAnswers,
      lastAccessed: lastAccessed ?? this.lastAccessed,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  double get accuracyPercentage {
    if (totalAnswers == 0) return 0.0;
    return (correctAnswers / totalAnswers) * 100;
  }
}