import 'dart:convert';
import 'dart:math';
import 'package:google_generative_ai/google_generative_ai.dart';
import '../models/conversation.dart';
import '../models/vocabulary.dart';

class AIConversationService {
  static const String _apiKey = 'YOUR_GEMINI_API_KEY'; // Replace with actual API key
  late final GenerativeModel _model;
  final Random _random = Random();

  AIConversationService() {
    _model = GenerativeModel(
      model: 'gemini-pro',
      apiKey: _apiKey,
      generationConfig: GenerationConfig(
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      ),
    );
  }

  // Generate AI response for conversation
  Future<ConversationMessage> generateResponse({
    required String userMessage,
    required String scenario,
    required String level,
    required List<ConversationMessage> conversationHistory,
    List<Vocabulary>? knownVocabulary,
  }) async {
    try {
      final prompt = _buildConversationPrompt(
        userMessage: userMessage,
        scenario: scenario,
        level: level,
        conversationHistory: conversationHistory,
        knownVocabulary: knownVocabulary,
      );

      final content = [Content.text(prompt)];
      final response = await _model.generateContent(content);

      if (response.text != null) {
        return _parseAIResponse(response.text!);
      } else {
        return _getFallbackResponse(scenario, level);
      }
    } catch (e) {
      print('AI Service Error: $e');
      return _getFallbackResponse(scenario, level);
    }
  }

  // Generate conversation scenarios based on user level
  Future<List<Conversation>> generateConversationScenarios({
    required String level,
    List<Vocabulary>? knownVocabulary,
    int count = 5,
  }) async {
    try {
      final prompt = _buildScenarioPrompt(level, knownVocabulary, count);
      final content = [Content.text(prompt)];
      final response = await _model.generateContent(content);

      if (response.text != null) {
        return _parseScenarios(response.text!, level);
      } else {
        return _getDefaultScenarios(level);
      }
    } catch (e) {
      print('Scenario Generation Error: $e');
      return _getDefaultScenarios(level);
    }
  }

  // Analyze user's Japanese input and provide feedback
  Future<Map<String, dynamic>> analyzeUserInput({
    required String userInput,
    required String expectedContext,
    required String level,
  }) async {
    try {
      final prompt = _buildAnalysisPrompt(userInput, expectedContext, level);
      final content = [Content.text(prompt)];
      final response = await _model.generateContent(content);

      if (response.text != null) {
        return _parseAnalysisResponse(response.text!);
      } else {
        return _getDefaultAnalysis();
      }
    } catch (e) {
      print('Analysis Error: $e');
      return _getDefaultAnalysis();
    }
  }

  // Generate adaptive learning suggestions
  Future<List<String>> generateLearningTips({
    required String level,
    required List<String> weakAreas,
    required Map<String, dynamic> userStats,
  }) async {
    try {
      final prompt = _buildLearningTipsPrompt(level, weakAreas, userStats);
      final content = [Content.text(prompt)];
      final response = await _model.generateContent(content);

      if (response.text != null) {
        return _parseLearningTips(response.text!);
      } else {
        return _getDefaultTips(level);
      }
    } catch (e) {
      print('Learning Tips Error: $e');
      return _getDefaultTips(level);
    }
  }

  // Private helper methods
  String _buildConversationPrompt({
    required String userMessage,
    required String scenario,
    required String level,
    required List<ConversationMessage> conversationHistory,
    List<Vocabulary>? knownVocabulary,
  }) {
    final historyText = conversationHistory
        .map((msg) => '${msg.isUser ? "User" : "AI"}: ${msg.text}')
        .join('\n');

    final vocabularyText = knownVocabulary != null
        ? knownVocabulary.map((v) => '${v.japanese} (${v.romaji}) - ${v.english}').join(', ')
        : '';

    return '''
You are a friendly Japanese conversation partner helping a $level level student practice Japanese.

Scenario: $scenario
User's known vocabulary: $vocabularyText

Conversation history:
$historyText

User just said: "$userMessage"

Please respond in a natural, encouraging way that:
1. Continues the conversation appropriately for the scenario
2. Uses vocabulary appropriate for $level level
3. Provides both Japanese and romaji for your response
4. Keeps the conversation engaging and educational

Format your response as JSON:
{
  "japanese": "Your Japanese response",
  "romaji": "Romaji version",
  "english": "English translation",
  "encouragement": "Brief encouraging comment about user's progress"
}
''';
  }

  String _buildScenarioPrompt(String level, List<Vocabulary>? knownVocabulary, int count) {
    final vocabularyText = knownVocabulary != null
        ? knownVocabulary.map((v) => '${v.japanese} (${v.romaji}) - ${v.english}').join(', ')
        : '';

    return '''
Generate $count conversation scenarios for a $level level Japanese learner.

Known vocabulary: $vocabularyText

Each scenario should be:
1. Appropriate for $level level
2. Practical and useful for real-life situations
3. Engaging and interesting
4. Use vocabulary the student knows when possible

Format as JSON array:
[
  {
    "title": "Scenario title",
    "scenario": "Detailed scenario description",
    "level": "$level"
  }
]
''';
  }

  String _buildAnalysisPrompt(String userInput, String expectedContext, String level) {
    return '''
Analyze this Japanese input from a $level level student:

User input: "$userInput"
Context: $expectedContext

Please provide:
1. Grammar accuracy (0-100)
2. Vocabulary appropriateness (0-100)
3. Overall naturalness (0-100)
4. Specific feedback and suggestions
5. Corrected version if needed

Format as JSON:
{
  "grammarScore": 85,
  "vocabularyScore": 90,
  "naturalnessScore": 80,
  "overallScore": 85,
  "feedback": "Detailed feedback",
  "correction": "Corrected version if needed",
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}
''';
  }

  String _buildLearningTipsPrompt(String level, List<String> weakAreas, Map<String, dynamic> userStats) {
    return '''
Generate personalized learning tips for a $level level Japanese student.

Weak areas: ${weakAreas.join(', ')}
User stats: ${userStats.toString()}

Provide 3-5 specific, actionable tips to help improve their Japanese learning.
Focus on their weak areas and current level.

Format as JSON array:
["Tip 1", "Tip 2", "Tip 3"]
''';
  }

  ConversationMessage _parseAIResponse(String responseText) {
    try {
      final jsonResponse = json.decode(responseText);
      return ConversationMessage(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        text: jsonResponse['english'] ?? responseText,
        japanese: jsonResponse['japanese'],
        romaji: jsonResponse['romaji'],
        isUser: false,
        type: MessageType.text,
        metadata: {
          'encouragement': jsonResponse['encouragement'],
        },
      );
    } catch (e) {
      return ConversationMessage(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        text: responseText,
        isUser: false,
        type: MessageType.text,
      );
    }
  }

  List<Conversation> _parseScenarios(String responseText, String level) {
    try {
      final jsonResponse = json.decode(responseText) as List;
      return jsonResponse.map((scenario) => Conversation(
        title: scenario['title'] ?? 'Conversation Practice',
        scenario: scenario['scenario'] ?? 'Practice Japanese conversation',
        level: level,
      )).toList();
    } catch (e) {
      return _getDefaultScenarios(level);
    }
  }

  Map<String, dynamic> _parseAnalysisResponse(String responseText) {
    try {
      return json.decode(responseText);
    } catch (e) {
      return _getDefaultAnalysis();
    }
  }

  List<String> _parseLearningTips(String responseText) {
    try {
      final jsonResponse = json.decode(responseText) as List;
      return jsonResponse.cast<String>();
    } catch (e) {
      return _getDefaultTips('Beginner');
    }
  }

  ConversationMessage _getFallbackResponse(String scenario, String level) {
    final responses = _getFallbackResponses(scenario, level);
    final response = responses[_random.nextInt(responses.length)];
    
    return ConversationMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      text: response['english']!,
      japanese: response['japanese'],
      romaji: response['romaji'],
      isUser: false,
      type: MessageType.text,
    );
  }

  List<Map<String, String>> _getFallbackResponses(String scenario, String level) {
    return [
      {
        'japanese': 'そうですね。',
        'romaji': 'Sou desu ne.',
        'english': 'I see.',
      },
      {
        'japanese': 'いいですね！',
        'romaji': 'Ii desu ne!',
        'english': 'That\'s good!',
      },
      {
        'japanese': 'もう一度言ってください。',
        'romaji': 'Mou ichido itte kudasai.',
        'english': 'Please say that again.',
      },
    ];
  }

  List<Conversation> _getDefaultScenarios(String level) {
    return [
      Conversation(
        title: 'At a Restaurant',
        scenario: 'You are ordering food at a Japanese restaurant. Practice ordering dishes and asking questions about the menu.',
        level: level,
      ),
      Conversation(
        title: 'Meeting New People',
        scenario: 'You are at a social gathering and meeting new Japanese friends. Practice introductions and small talk.',
        level: level,
      ),
      Conversation(
        title: 'Shopping',
        scenario: 'You are shopping for clothes in Japan. Practice asking about sizes, prices, and making purchases.',
        level: level,
      ),
    ];
  }

  Map<String, dynamic> _getDefaultAnalysis() {
    return {
      'grammarScore': 75,
      'vocabularyScore': 80,
      'naturalnessScore': 70,
      'overallScore': 75,
      'feedback': 'Good effort! Keep practicing to improve your Japanese.',
      'correction': null,
      'suggestions': ['Practice more vocabulary', 'Focus on grammar patterns'],
    };
  }

  List<String> _getDefaultTips(String level) {
    return [
      'Practice speaking Japanese every day, even if just for 5 minutes',
      'Use flashcards to memorize new vocabulary',
      'Watch Japanese content with subtitles to improve listening skills',
      'Join online Japanese conversation groups',
      'Keep a Japanese learning journal',
    ];
  }
}