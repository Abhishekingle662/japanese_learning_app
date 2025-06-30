import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../providers/gamification_provider.dart';
import '../providers/offline_provider.dart';
import '../widgets/achievement_card.dart';
import '../widgets/stats_card.dart';
import '../widgets/level_progress_card.dart';

class ProfilePage extends StatefulWidget {
  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> with TickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Profile'),
        actions: [
          IconButton(
            icon: Icon(Icons.settings),
            onPressed: () => _showSettingsDialog(),
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: [
            Tab(text: 'Stats', icon: Icon(Icons.analytics)),
            Tab(text: 'Achievements', icon: Icon(Icons.emoji_events)),
            Tab(text: 'Settings', icon: Icon(Icons.settings)),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildStatsTab(),
          _buildAchievementsTab(),
          _buildSettingsTab(),
        ],
      ),
    );
  }

  Widget _buildStatsTab() {
    return Consumer<GamificationProvider>(
      builder: (context, provider, child) {
        if (provider.isLoading) {
          return Center(child: CircularProgressIndicator());
        }

        if (provider.userStats == null) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.analytics, size: 64, color: Colors.grey),
                SizedBox(height: 16),
                Text('No stats available'),
                SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => provider.initialize(),
                  child: Text('Refresh'),
                ),
              ],
            ),
          );
        }

        final stats = provider.userStats!;

        return SingleChildScrollView(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Level and progress
              LevelProgressCard(
                level: stats.level,
                currentPoints: stats.totalPoints,
                pointsToNextLevel: stats.pointsToNextLevel,
                progressToNextLevel: stats.progressToNextLevel,
              ).animate().fadeIn().slideY(begin: 0.3, end: 0),

              SizedBox(height: 16),

              // Current streak
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Icon(
                        Icons.local_fire_department,
                        size: 32,
                        color: stats.currentStreak > 0 ? Colors.orange : Colors.grey,
                      ),
                      SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Current Streak',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              '${stats.currentStreak} days',
                              style: TextStyle(
                                fontSize: 24,
                                color: stats.currentStreak > 0 ? Colors.orange : Colors.grey,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (stats.longestStreak > stats.currentStreak)
                        Column(
                          children: [
                            Text('Best: ${stats.longestStreak}'),
                            Icon(Icons.star, color: Colors.amber),
                          ],
                        ),
                    ],
                  ),
                ),
              ).animate(delay: 200.ms).fadeIn().slideY(begin: 0.3, end: 0),

              SizedBox(height: 16),

              // Stats grid
              GridView.count(
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 1.2,
                children: [
                  StatsCard(
                    title: 'Lessons Completed',
                    value: stats.lessonsCompleted.toString(),
                    icon: Icons.school,
                    color: Colors.blue,
                  ).animate(delay: 300.ms).fadeIn().scale(),
                  
                  StatsCard(
                    title: 'Vocabulary Learned',
                    value: stats.vocabularyLearned.toString(),
                    icon: Icons.book,
                    color: Colors.green,
                  ).animate(delay: 400.ms).fadeIn().scale(),
                  
                  StatsCard(
                    title: 'Conversations',
                    value: stats.conversationsCompleted.toString(),
                    icon: Icons.chat,
                    color: Colors.purple,
                  ).animate(delay: 500.ms).fadeIn().scale(),
                  
                  StatsCard(
                    title: 'Study Time',
                    value: '${(stats.totalStudyTimeMinutes / 60).toStringAsFixed(1)}h',
                    icon: Icons.schedule,
                    color: Colors.orange,
                  ).animate(delay: 600.ms).fadeIn().scale(),
                ],
              ),

              SizedBox(height: 16),

              // Accuracy card
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.target, color: Colors.red),
                          SizedBox(width: 8),
                          Text(
                            'Average Accuracy',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 12),
                      LinearProgressIndicator(
                        value: stats.averageAccuracy / 100,
                        backgroundColor: Colors.grey[300],
                        valueColor: AlwaysStoppedAnimation<Color>(
                          stats.averageAccuracy >= 80 ? Colors.green : 
                          stats.averageAccuracy >= 60 ? Colors.orange : Colors.red,
                        ),
                      ),
                      SizedBox(height: 8),
                      Text(
                        '${stats.averageAccuracy.toStringAsFixed(1)}%',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: stats.averageAccuracy >= 80 ? Colors.green : 
                                 stats.averageAccuracy >= 60 ? Colors.orange : Colors.red,
                        ),
                      ),
                    ],
                  ),
                ),
              ).animate(delay: 700.ms).fadeIn().slideY(begin: 0.3, end: 0),
            ],
          ),
        );
      },
    );
  }

  Widget _buildAchievementsTab() {
    return Consumer<GamificationProvider>(
      builder: (context, provider, child) {
        if (provider.isLoading) {
          return Center(child: CircularProgressIndicator());
        }

        final achievements = provider.achievements;
        final unlockedAchievements = achievements.where((a) => a.isUnlocked).toList();
        final lockedAchievements = achievements.where((a) => !a.isUnlocked).toList();

        return SingleChildScrollView(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Achievement summary
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Icon(Icons.emoji_events, size: 32, color: Colors.amber),
                      SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Achievements Unlocked',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              '${unlockedAchievements.length} / ${achievements.length}',
                              style: TextStyle(
                                fontSize: 24,
                                color: Colors.amber,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                      CircularProgressIndicator(
                        value: achievements.isNotEmpty 
                            ? unlockedAchievements.length / achievements.length 
                            : 0,
                        backgroundColor: Colors.grey[300],
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.amber),
                      ),
                    ],
                  ),
                ),
              ).animate().fadeIn().slideY(begin: 0.3, end: 0),

              SizedBox(height: 24),

              // Unlocked achievements
              if (unlockedAchievements.isNotEmpty) ...[
                Text(
                  'Unlocked Achievements',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.green[700],
                  ),
                ).animate(delay: 200.ms).fadeIn(),
                SizedBox(height: 12),
                ...unlockedAchievements.asMap().entries.map((entry) {
                  final index = entry.key;
                  final achievement = entry.value;
                  return AchievementCard(
                    achievement: achievement,
                    isUnlocked: true,
                  ).animate(delay: (300 + index * 100).ms).fadeIn().slideX(begin: -0.3, end: 0);
                }).toList(),
                SizedBox(height: 24),
              ],

              // Locked achievements
              if (lockedAchievements.isNotEmpty) ...[
                Text(
                  'Locked Achievements',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey[600],
                  ),
                ).animate(delay: 400.ms).fadeIn(),
                SizedBox(height: 12),
                ...lockedAchievements.asMap().entries.map((entry) {
                  final index = entry.key;
                  final achievement = entry.value;
                  return AchievementCard(
                    achievement: achievement,
                    isUnlocked: false,
                  ).animate(delay: (500 + index * 100).ms).fadeIn().slideX(begin: 0.3, end: 0);
                }).toList(),
              ],
            ],
          ),
        );
      },
    );
  }

  Widget _buildSettingsTab() {
    return Consumer2<GamificationProvider, OfflineProvider>(
      builder: (context, gamificationProvider, offlineProvider, child) {
        return SingleChildScrollView(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Offline content section
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.cloud_download, color: Colors.blue),
                          SizedBox(width: 8),
                          Text(
                            'Offline Content',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 16),
                      FutureBuilder<Map<String, dynamic>>(
                        future: offlineProvider.getStorageInfo(),
                        builder: (context, snapshot) {
                          if (snapshot.hasData) {
                            final info = snapshot.data!;
                            return Column(
                              children: [
                                _buildStorageInfoRow('Lessons', info['lessonsCount']),
                                _buildStorageInfoRow('Vocabulary', info['vocabularyCount']),
                                _buildStorageInfoRow('Conversations', info['conversationsCount']),
                                _buildStorageInfoRow('Pending Actions', info['pendingActionsCount']),
                                if (info['lastSync'] != null)
                                  Padding(
                                    padding: EdgeInsets.only(top: 8),
                                    child: Text(
                                      'Last sync: ${DateTime.fromMillisecondsSinceEpoch(info['lastSync']).toString().split('.')[0]}',
                                      style: TextStyle(color: Colors.grey[600]),
                                    ),
                                  ),
                              ],
                            );
                          }
                          return CircularProgressIndicator();
                        },
                      ),
                      SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: () => _downloadOfflineContent(offlineProvider),
                              icon: Icon(Icons.download),
                              label: Text('Download Content'),
                            ),
                          ),
                          SizedBox(width: 8),
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: () => _syncPendingActions(offlineProvider),
                              icon: Icon(Icons.sync),
                              label: Text('Sync'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ).animate().fadeIn().slideY(begin: 0.3, end: 0),

              SizedBox(height: 16),

              // Data management section
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.storage, color: Colors.orange),
                          SizedBox(width: 8),
                          Text(
                            'Data Management',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 16),
                      ListTile(
                        leading: Icon(Icons.refresh),
                        title: Text('Reset Progress'),
                        subtitle: Text('Clear all learning progress'),
                        onTap: () => _showResetProgressDialog(gamificationProvider),
                      ),
                      ListTile(
                        leading: Icon(Icons.delete),
                        title: Text('Clear Offline Data'),
                        subtitle: Text('Remove all downloaded content'),
                        onTap: () => _showClearDataDialog(offlineProvider),
                      ),
                    ],
                  ),
                ),
              ).animate(delay: 200.ms).fadeIn().slideY(begin: 0.3, end: 0),

              SizedBox(height: 16),

              // App info section
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.info, color: Colors.green),
                          SizedBox(width: 8),
                          Text(
                            'App Information',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 16),
                      ListTile(
                        leading: Icon(Icons.apps),
                        title: Text('Version'),
                        subtitle: Text('1.0.0'),
                      ),
                      ListTile(
                        leading: Icon(Icons.help),
                        title: Text('Help & Support'),
                        subtitle: Text('Get help with the app'),
                        onTap: () => _showHelpDialog(),
                      ),
                      ListTile(
                        leading: Icon(Icons.privacy_tip),
                        title: Text('Privacy Policy'),
                        subtitle: Text('View privacy policy'),
                        onTap: () => _showPrivacyDialog(),
                      ),
                    ],
                  ),
                ),
              ).animate(delay: 400.ms).fadeIn().slideY(begin: 0.3, end: 0),
            ],
          ),
        );
      },
    );
  }

  Widget _buildStorageInfoRow(String label, int count) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label),
          Text(
            count.toString(),
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  void _showSettingsDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Settings'),
        content: Text('Settings functionality coming soon!'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }

  void _downloadOfflineContent(OfflineProvider provider) async {
    try {
      await provider.downloadOfflineContent();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Offline content downloaded successfully!'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to download content: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _syncPendingActions(OfflineProvider provider) async {
    try {
      final success = await provider.syncPendingActions();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(success 
              ? 'All actions synced successfully!' 
              : 'Some actions failed to sync'),
          backgroundColor: success ? Colors.green : Colors.orange,
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to sync: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _showResetProgressDialog(GamificationProvider provider) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Reset Progress'),
        content: Text('Are you sure you want to reset all your learning progress? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.of(context).pop();
              await provider.resetProgress();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Progress reset successfully'),
                  backgroundColor: Colors.green,
                ),
              );
            },
            child: Text('Reset', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  void _showClearDataDialog(OfflineProvider provider) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Clear Offline Data'),
        content: Text('Are you sure you want to clear all offline data? You will need to download content again.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.of(context).pop();
              await provider.clearOfflineData();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Offline data cleared successfully'),
                  backgroundColor: Colors.green,
                ),
              );
            },
            child: Text('Clear', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  void _showHelpDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Help & Support'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Welcome to Japanese Learning App!'),
            SizedBox(height: 16),
            Text('Features:'),
            Text('• Interactive lessons'),
            Text('• AI conversation partner'),
            Text('• Voice pronunciation practice'),
            Text('• Offline learning support'),
            Text('• Achievement system'),
            SizedBox(height: 16),
            Text('For support, contact: support@japaneseapp.com'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }

  void _showPrivacyDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Privacy Policy'),
        content: SingleChildScrollView(
          child: Text(
            'This app collects minimal data necessary for functionality. '
            'Your learning progress is stored locally and optionally synced '
            'to our servers for backup purposes. We do not share your personal '
            'information with third parties.',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }
}