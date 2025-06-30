import 'dart:async';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/lesson.dart';
import '../models/vocabulary.dart';
import '../models/user_progress.dart';

class DatabaseService {
  static final DatabaseService _instance = DatabaseService._internal();
  factory DatabaseService() => _instance;
  DatabaseService._internal();

  static Database? _database;

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    String path = join(await getDatabasesPath(), 'japanese_learning.db');
    
    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDatabase,
    );
  }

  Future<void> _createDatabase(Database db, int version) async {
    // Create lessons table
    await db.execute('''
      CREATE TABLE lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        level TEXT NOT NULL,
        category TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        is_completed INTEGER DEFAULT 0,
        completed_at INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    ''');

    // Create vocabulary table
    await db.execute('''
      CREATE TABLE vocabulary (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        japanese TEXT NOT NULL,
        romaji TEXT NOT NULL,
        english TEXT NOT NULL,
        category TEXT NOT NULL,
        level TEXT NOT NULL,
        lesson_id INTEGER,
        is_learned INTEGER DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        last_reviewed INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (lesson_id) REFERENCES lessons (id)
      )
    ''');

    // Create user_progress table
    await db.execute('''
      CREATE TABLE user_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        lesson_id INTEGER NOT NULL,
        completion_percentage REAL DEFAULT 0.0,
        time_spent_minutes INTEGER DEFAULT 0,
        correct_answers INTEGER DEFAULT 0,
        total_answers INTEGER DEFAULT 0,
        last_accessed INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (lesson_id) REFERENCES lessons (id),
        UNIQUE(user_id, lesson_id)
      )
    ''');

    // Insert initial data
    await _insertInitialData(db);
  }

  Future<void> _insertInitialData(Database db) async {
    // Insert initial lessons
    final lessons = [
      {
        'title': 'Hiragana Basics',
        'description': 'Learn the basic Japanese Hiragana characters',
        'level': 'Beginner',
        'category': 'Writing System',
        'order_index': 1,
        'created_at': DateTime.now().millisecondsSinceEpoch,
        'updated_at': DateTime.now().millisecondsSinceEpoch,
      },
      {
        'title': 'Katakana Introduction',
        'description': 'Master the Katakana writing system',
        'level': 'Beginner',
        'category': 'Writing System',
        'order_index': 2,
        'created_at': DateTime.now().millisecondsSinceEpoch,
        'updated_at': DateTime.now().millisecondsSinceEpoch,
      },
      {
        'title': 'Basic Greetings',
        'description': 'Common Japanese greetings and phrases',
        'level': 'Beginner',
        'category': 'Conversation',
        'order_index': 3,
        'created_at': DateTime.now().millisecondsSinceEpoch,
        'updated_at': DateTime.now().millisecondsSinceEpoch,
      },
      {
        'title': 'Numbers & Counting',
        'description': 'Learn how to count in Japanese',
        'level': 'Beginner',
        'category': 'Vocabulary',
        'order_index': 4,
        'created_at': DateTime.now().millisecondsSinceEpoch,
        'updated_at': DateTime.now().millisecondsSinceEpoch,
      },
      {
        'title': 'Basic Kanji',
        'description': 'Introduction to your first Kanji characters',
        'level': 'Intermediate',
        'category': 'Writing System',
        'order_index': 5,
        'created_at': DateTime.now().millisecondsSinceEpoch,
        'updated_at': DateTime.now().millisecondsSinceEpoch,
      },
    ];

    for (var lesson in lessons) {
      await db.insert('lessons', lesson);
    }

    // Insert initial vocabulary
    final vocabulary = [
      {
        'japanese': 'こんにちは',
        'romaji': 'Konnichiwa',
        'english': 'Hello',
        'category': 'Greetings',
        'level': 'Beginner',
        'lesson_id': 3,
        'created_at': DateTime.now().millisecondsSinceEpoch,
        'updated_at': DateTime.now().millisecondsSinceEpoch,
      },
      {
        'japanese': 'ありがとう',
        'romaji': 'Arigatou',
        'english': 'Thank you',
        'category': 'Greetings',
        'level': 'Beginner',
        'lesson_id': 3,
        'created_at': DateTime.now().millisecondsSinceEpoch,
        'updated_at': DateTime.now().millisecondsSinceEpoch,
      },
      {
        'japanese': 'さようなら',
        'romaji': 'Sayounara',
        'english': 'Goodbye',
        'category': 'Greetings',
        'level': 'Beginner',
        'lesson_id': 3,
        'created_at': DateTime.now().millisecondsSinceEpoch,
        'updated_at': DateTime.now().millisecondsSinceEpoch,
      },
      {
        'japanese': 'おはようございます',
        'romaji': 'Ohayou gozaimasu',
        'english': 'Good morning',
        'category': 'Greetings',
        'level': 'Beginner',
        'lesson_id': 3,
        'created_at': DateTime.now().millisecondsSinceEpoch,
        'updated_at': DateTime.now().millisecondsSinceEpoch,
      },
      {
        'japanese': 'お元気ですか',
        'romaji': 'O-genki desu ka',
        'english': 'How are you?',
        'category': 'Phrases',
        'level': 'Beginner',
        'lesson_id': 3,
        'created_at': DateTime.now().millisecondsSinceEpoch,
        'updated_at': DateTime.now().millisecondsSinceEpoch,
      },
    ];

    for (var vocab in vocabulary) {
      await db.insert('vocabulary', vocab);
    }
  }

  // Lesson CRUD operations
  Future<int> insertLesson(Lesson lesson) async {
    final db = await database;
    return await db.insert('lessons', lesson.toMap());
  }

  Future<List<Lesson>> getAllLessons() async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      'lessons',
      orderBy: 'order_index ASC',
    );
    return List.generate(maps.length, (i) => Lesson.fromMap(maps[i]));
  }

  Future<Lesson?> getLessonById(int id) async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      'lessons',
      where: 'id = ?',
      whereArgs: [id],
    );
    if (maps.isNotEmpty) {
      return Lesson.fromMap(maps.first);
    }
    return null;
  }

  Future<List<Lesson>> getLessonsByLevel(String level) async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      'lessons',
      where: 'level = ?',
      whereArgs: [level],
      orderBy: 'order_index ASC',
    );
    return List.generate(maps.length, (i) => Lesson.fromMap(maps[i]));
  }

  Future<int> updateLesson(Lesson lesson) async {
    final db = await database;
    return await db.update(
      'lessons',
      lesson.copyWith(updatedAt: DateTime.now()).toMap(),
      where: 'id = ?',
      whereArgs: [lesson.id],
    );
  }

  Future<int> deleteLesson(int id) async {
    final db = await database;
    return await db.delete(
      'lessons',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  // Vocabulary CRUD operations
  Future<int> insertVocabulary(Vocabulary vocabulary) async {
    final db = await database;
    return await db.insert('vocabulary', vocabulary.toMap());
  }

  Future<List<Vocabulary>> getAllVocabulary() async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query('vocabulary');
    return List.generate(maps.length, (i) => Vocabulary.fromMap(maps[i]));
  }

  Future<List<Vocabulary>> getVocabularyByLesson(int lessonId) async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      'vocabulary',
      where: 'lesson_id = ?',
      whereArgs: [lessonId],
    );
    return List.generate(maps.length, (i) => Vocabulary.fromMap(maps[i]));
  }

  Future<List<Vocabulary>> getVocabularyByCategory(String category) async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      'vocabulary',
      where: 'category = ?',
      whereArgs: [category],
    );
    return List.generate(maps.length, (i) => Vocabulary.fromMap(maps[i]));
  }

  Future<int> updateVocabulary(Vocabulary vocabulary) async {
    final db = await database;
    return await db.update(
      'vocabulary',
      vocabulary.copyWith(updatedAt: DateTime.now()).toMap(),
      where: 'id = ?',
      whereArgs: [vocabulary.id],
    );
  }

  Future<int> deleteVocabulary(int id) async {
    final db = await database;
    return await db.delete(
      'vocabulary',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  // User Progress CRUD operations
  Future<int> insertOrUpdateProgress(UserProgress progress) async {
    final db = await database;
    
    // Check if progress already exists
    final existing = await db.query(
      'user_progress',
      where: 'user_id = ? AND lesson_id = ?',
      whereArgs: [progress.userId, progress.lessonId],
    );

    if (existing.isNotEmpty) {
      // Update existing progress
      return await db.update(
        'user_progress',
        progress.copyWith(
          id: existing.first['id'] as int,
          updatedAt: DateTime.now(),
        ).toMap(),
        where: 'id = ?',
        whereArgs: [existing.first['id']],
      );
    } else {
      // Insert new progress
      return await db.insert('user_progress', progress.toMap());
    }
  }

  Future<UserProgress?> getUserProgress(int userId, int lessonId) async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      'user_progress',
      where: 'user_id = ? AND lesson_id = ?',
      whereArgs: [userId, lessonId],
    );
    if (maps.isNotEmpty) {
      return UserProgress.fromMap(maps.first);
    }
    return null;
  }

  Future<List<UserProgress>> getAllUserProgress(int userId) async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      'user_progress',
      where: 'user_id = ?',
      whereArgs: [userId],
    );
    return List.generate(maps.length, (i) => UserProgress.fromMap(maps[i]));
  }

  // Utility methods
  Future<void> clearAllData() async {
    final db = await database;
    await db.delete('user_progress');
    await db.delete('vocabulary');
    await db.delete('lessons');
  }

  Future<void> close() async {
    final db = await database;
    await db.close();
  }
}