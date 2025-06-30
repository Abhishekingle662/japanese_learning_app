import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../providers/conversation_provider.dart';
import '../providers/gamification_provider.dart';
import '../models/conversation.dart';
import '../widgets/conversation_bubble.dart';
import '../widgets/typing_indicator.dart';
import '../widgets/achievement_popup.dart';

class ConversationPage extends StatefulWidget {
  @override
  _ConversationPageState createState() => _ConversationPageState();
}

class _ConversationPageState extends State<ConversationPage>
    with TickerProviderStateMixin {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: Duration(milliseconds: 300),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('AI Conversation Partner'),
        actions: [
          Consumer<ConversationProvider>(
            builder: (context, provider, child) {
              return PopupMenuButton<String>(
                onSelected: (String scenario) {
                  provider.startNewConversation(scenario);
                },
                itemBuilder: (BuildContext context) {
                  return provider.availableScenarios.map((scenario) {
                    return PopupMenuItem<String>(
                      value: scenario,
                      child: Text(scenario),
                    );
                  }).toList();
                },
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Icon(Icons.refresh),
                ),
              );
            },
          ),
        ],
      ),
      body: Consumer<ConversationProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading && provider.currentConversation == null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 16),
                  Text('Initializing AI conversation partner...'),
                ],
              ),
            );
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
                    onPressed: () => provider.initialize(),
                    child: Text('Retry'),
                  ),
                ],
              ),
            );
          }

          return Column(
            children: [
              // Conversation scenario header
              if (provider.currentConversation != null)
                Container(
                  width: double.infinity,
                  padding: EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.blue[50],
                    border: Border(
                      bottom: BorderSide(color: Colors.grey[300]!),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        provider.currentConversation!.title,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue[800],
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        provider.currentConversation!.scenario,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[700],
                        ),
                      ),
                      SizedBox(height: 8),
                      Row(
                        children: [
                          Chip(
                            label: Text(provider.currentConversation!.level),
                            backgroundColor: _getLevelColor(provider.currentConversation!.level),
                          ),
                          SizedBox(width: 8),
                          if (provider.currentConversation!.score != null)
                            Chip(
                              label: Text('Score: ${provider.currentConversation!.score}'),
                              backgroundColor: Colors.green[100],
                            ),
                        ],
                      ),
                    ],
                  ),
                ).animate().fadeIn().slideY(begin: -0.3, end: 0),

              // Messages list
              Expanded(
                child: provider.currentConversation == null
                    ? _buildWelcomeScreen(provider)
                    : _buildConversationView(provider),
              ),

              // Typing indicator
              if (provider.isTyping)
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 16,
                        backgroundColor: Colors.blue[100],
                        child: Icon(Icons.smart_toy, size: 16, color: Colors.blue),
                      ),
                      SizedBox(width: 12),
                      TypingIndicator(),
                    ],
                  ),
                ),

              // Message input
              if (provider.currentConversation != null)
                _buildMessageInput(provider),
            ],
          );
        },
      ),
    );
  }

  Widget _buildWelcomeScreen(ConversationProvider provider) {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.chat_bubble_outline,
              size: 80,
              color: Colors.blue[300],
            ).animate().scale(delay: 200.ms),
            SizedBox(height: 24),
            Text(
              'Welcome to AI Conversation Practice!',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.blue[800],
              ),
              textAlign: TextAlign.center,
            ).animate().fadeIn(delay: 400.ms),
            SizedBox(height: 16),
            Text(
              'Choose a scenario below to start practicing Japanese conversation with your AI partner.',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
              textAlign: TextAlign.center,
            ).animate().fadeIn(delay: 600.ms),
            SizedBox(height: 32),
            ...provider.availableScenarios.asMap().entries.map((entry) {
              final index = entry.key;
              final scenario = entry.value;
              return Padding(
                padding: EdgeInsets.symmetric(vertical: 8),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => provider.startNewConversation(scenario),
                    style: ElevatedButton.styleFrom(
                      padding: EdgeInsets.all(16),
                      backgroundColor: Colors.blue[600],
                      foregroundColor: Colors.white,
                    ),
                    child: Text(
                      scenario,
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                ),
              ).animate(delay: (800 + index * 100).ms).slideX(begin: 1, end: 0).fadeIn();
            }).toList(),
          ],
        ),
      ),
    );
  }

  Widget _buildConversationView(ConversationProvider provider) {
    final messages = provider.currentConversation!.messages;
    
    return ListView.builder(
      controller: _scrollController,
      padding: EdgeInsets.all(16),
      itemCount: messages.length,
      itemBuilder: (context, index) {
        final message = messages[index];
        return ConversationBubble(
          message: message,
          onPlayAudio: () => _playAudio(message),
        ).animate(delay: (index * 100).ms).slideX(
          begin: message.isUser ? 1 : -1,
          end: 0,
        ).fadeIn();
      },
    );
  }

  Widget _buildMessageInput(ConversationProvider provider) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(
          top: BorderSide(color: Colors.grey[300]!),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _messageController,
              decoration: InputDecoration(
                hintText: 'Type your message in Japanese...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: BorderSide(color: Colors.grey[300]!),
                ),
                contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
              onSubmitted: (text) => _sendMessage(provider, text),
              enabled: !provider.isTyping,
            ),
          ),
          SizedBox(width: 12),
          FloatingActionButton(
            mini: true,
            onPressed: provider.isTyping
                ? null
                : () => _sendMessage(provider, _messageController.text),
            child: Icon(Icons.send),
            backgroundColor: Colors.blue[600],
          ),
        ],
      ),
    );
  }

  void _sendMessage(ConversationProvider provider, String text) async {
    if (text.trim().isEmpty) return;

    _messageController.clear();
    
    // Scroll to bottom after sending message
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });

    try {
      await provider.sendMessage(text);
      
      // Check for achievements after conversation
      final gamificationProvider = Provider.of<GamificationProvider>(context, listen: false);
      final newAchievements = await gamificationProvider.checkForNewAchievements();
      
      if (newAchievements.isNotEmpty) {
        _showAchievementPopup(newAchievements.first);
      }
      
      // Scroll to bottom after AI response
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (_scrollController.hasClients) {
          _scrollController.animateTo(
            _scrollController.position.maxScrollExtent,
            duration: Duration(milliseconds: 300),
            curve: Curves.easeOut,
          );
        }
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to send message: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _playAudio(ConversationMessage message) {
    // TODO: Implement text-to-speech for Japanese text
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Playing audio for: ${message.japanese ?? message.text}'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  void _showAchievementPopup(achievement) {
    showDialog(
      context: context,
      builder: (context) => AchievementPopup(achievement: achievement),
    );
  }

  Color _getLevelColor(String level) {
    switch (level.toLowerCase()) {
      case 'beginner':
        return Colors.green[100]!;
      case 'intermediate':
        return Colors.orange[100]!;
      case 'advanced':
        return Colors.red[100]!;
      default:
        return Colors.blue[100]!;
    }
  }
}