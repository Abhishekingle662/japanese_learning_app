class Vocabulary {
  final int? id;
  final String japanese;
  final String romaji;
  final String english;
  final String category;
  final String level;
  final int? lessonId;
  final bool isLearned;
  final int reviewCount;
  final DateTime? lastReviewed;
  final DateTime createdAt;
  final DateTime updatedAt;

  Vocabulary({
    this.id,
    required this.japanese,
    required this.romaji,
    required this.english,
    required this.category,
    required this.level,
    this.lessonId,
    this.isLearned = false,
    this.reviewCount = 0,
    this.lastReviewed,
    DateTime? createdAt,
    DateTime? updatedAt,
  })  : createdAt = createdAt ?? DateTime.now(),
        updatedAt = updatedAt ?? DateTime.now();

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'japanese': japanese,
      'romaji': romaji,
      'english': english,
      'category': category,
      'level': level,
      'lesson_id': lessonId,
      'is_learned': isLearned ? 1 : 0,
      'review_count': reviewCount,
      'last_reviewed': lastReviewed?.millisecondsSinceEpoch,
      'created_at': createdAt.millisecondsSinceEpoch,
      'updated_at': updatedAt.millisecondsSinceEpoch,
    };
  }

  factory Vocabulary.fromMap(Map<String, dynamic> map) {
    return Vocabulary(
      id: map['id']?.toInt(),
      japanese: map['japanese'] ?? '',
      romaji: map['romaji'] ?? '',
      english: map['english'] ?? '',
      category: map['category'] ?? '',
      level: map['level'] ?? '',
      lessonId: map['lesson_id']?.toInt(),
      isLearned: (map['is_learned'] ?? 0) == 1,
      reviewCount: map['review_count']?.toInt() ?? 0,
      lastReviewed: map['last_reviewed'] != null
          ? DateTime.fromMillisecondsSinceEpoch(map['last_reviewed'])
          : null,
      createdAt: DateTime.fromMillisecondsSinceEpoch(map['created_at']),
      updatedAt: DateTime.fromMillisecondsSinceEpoch(map['updated_at']),
    );
  }

  Vocabulary copyWith({
    int? id,
    String? japanese,
    String? romaji,
    String? english,
    String? category,
    String? level,
    int? lessonId,
    bool? isLearned,
    int? reviewCount,
    DateTime? lastReviewed,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Vocabulary(
      id: id ?? this.id,
      japanese: japanese ?? this.japanese,
      romaji: romaji ?? this.romaji,
      english: english ?? this.english,
      category: category ?? this.category,
      level: level ?? this.level,
      lessonId: lessonId ?? this.lessonId,
      isLearned: isLearned ?? this.isLearned,
      reviewCount: reviewCount ?? this.reviewCount,
      lastReviewed: lastReviewed ?? this.lastReviewed,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}