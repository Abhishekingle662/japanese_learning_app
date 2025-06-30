class Conversation {
  final int? id;
  final String title;
  final String scenario;
  final String level;
  final List<ConversationMessage> messages;
  final bool isCompleted;
  final int? score;
  final DateTime? completedAt;
  final DateTime createdAt;
  final DateTime updatedAt;

  Conversation({
    this.id,
    required this.title,
    required this.scenario,
    required this.level,
    this.messages = const [],
    this.isCompleted = false,
    this.score,
    this.completedAt,
    DateTime? createdAt,
    DateTime? updatedAt,
  })  : createdAt = createdAt ?? DateTime.now(),
        updatedAt = updatedAt ?? DateTime.now();

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'scenario': scenario,
      'level': level,
      'messages': messages.map((m) => m.toMap()).toList(),
      'is_completed': isCompleted ? 1 : 0,
      'score': score,
      'completed_at': completedAt?.millisecondsSinceEpoch,
      'created_at': createdAt.millisecondsSinceEpoch,
      'updated_at': updatedAt.millisecondsSinceEpoch,
    };
  }

  factory Conversation.fromMap(Map<String, dynamic> map) {
    return Conversation(
      id: map['id']?.toInt(),
      title: map['title'] ?? '',
      scenario: map['scenario'] ?? '',
      level: map['level'] ?? '',
      messages: map['messages'] != null
          ? (map['messages'] as List).map((m) => ConversationMessage.fromMap(m)).toList()
          : [],
      isCompleted: (map['is_completed'] ?? 0) == 1,
      score: map['score']?.toInt(),
      completedAt: map['completed_at'] != null
          ? DateTime.fromMillisecondsSinceEpoch(map['completed_at'])
          : null,
      createdAt: DateTime.fromMillisecondsSinceEpoch(map['created_at']),
      updatedAt: DateTime.fromMillisecondsSinceEpoch(map['updated_at']),
    );
  }

  Conversation copyWith({
    int? id,
    String? title,
    String? scenario,
    String? level,
    List<ConversationMessage>? messages,
    bool? isCompleted,
    int? score,
    DateTime? completedAt,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Conversation(
      id: id ?? this.id,
      title: title ?? this.title,
      scenario: scenario ?? this.scenario,
      level: level ?? this.level,
      messages: messages ?? this.messages,
      isCompleted: isCompleted ?? this.isCompleted,
      score: score ?? this.score,
      completedAt: completedAt ?? this.completedAt,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

class ConversationMessage {
  final String id;
  final String text;
  final String? japanese;
  final String? romaji;
  final bool isUser;
  final DateTime timestamp;
  final MessageType type;
  final Map<String, dynamic>? metadata;

  ConversationMessage({
    required this.id,
    required this.text,
    this.japanese,
    this.romaji,
    required this.isUser,
    DateTime? timestamp,
    this.type = MessageType.text,
    this.metadata,
  }) : timestamp = timestamp ?? DateTime.now();

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'text': text,
      'japanese': japanese,
      'romaji': romaji,
      'is_user': isUser,
      'timestamp': timestamp.millisecondsSinceEpoch,
      'type': type.toString(),
      'metadata': metadata,
    };
  }

  factory ConversationMessage.fromMap(Map<String, dynamic> map) {
    return ConversationMessage(
      id: map['id'] ?? '',
      text: map['text'] ?? '',
      japanese: map['japanese'],
      romaji: map['romaji'],
      isUser: map['is_user'] ?? false,
      timestamp: DateTime.fromMillisecondsSinceEpoch(map['timestamp']),
      type: MessageType.values.firstWhere(
        (e) => e.toString() == map['type'],
        orElse: () => MessageType.text,
      ),
      metadata: map['metadata'],
    );
  }
}

enum MessageType {
  text,
  audio,
  image,
  quiz,
  feedback,
  suggestion,
}