import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '@/store';
import { setModules, LearningModule } from '@/store/slices/learningSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function LearnScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const modules = useAppSelector((state: any) => state.learning.modules as LearningModule[]);
  const profile = useAppSelector((state: any) => state.user.profile);
  const streakCount = useAppSelector((state: any) => state.user.streakCount);
  const recommendations = useAppSelector((state: any) => state.ai.recommendations);

  useEffect(() => {
    // Initialize learning modules
    const initialModules: LearningModule[] = [
      {
        id: 'hiragana',
        name: 'Hiragana',
        icon: 'あ',
        description: 'Learn the basic Japanese syllabary',
        lessons: [
          {
            id: 'hiragana-1',
            title: 'Vowels (あ, い, う, え, お)',
            type: 'hiragana',
            difficulty: 1,
            items: [
              { id: 'a', character: 'あ', romanji: 'a', examples: ['あさ (morning)'] },
              { id: 'i', character: 'い', romanji: 'i', examples: ['いえ (house)'] },
              { id: 'u', character: 'う', romanji: 'u', examples: ['うみ (sea)'] },
              { id: 'e', character: 'え', romanji: 'e', examples: ['えき (station)'] },
              { id: 'o', character: 'お', romanji: 'o', examples: ['おちゃ (tea)'] },
            ],
            estimatedTime: 15,
            isUnlocked: true,
            isCompleted: false,
          },
        ],
        progress: 0,
        totalLessons: 5,
        completedLessons: 0,
      },
      {
        id: 'katakana',
        name: 'Katakana',
        icon: 'ア',
        description: 'Learn katakana for foreign words',
        lessons: [
          {
            id: 'katakana-1',
            title: 'Basic Katakana',
            type: 'katakana',
            difficulty: 1,
            items: [],
            estimatedTime: 15,
            isUnlocked: false,
            isCompleted: false,
          },
        ],
        progress: 0,
        totalLessons: 5,
        completedLessons: 0,
      },
      {
        id: 'kanji',
        name: 'Kanji',
        icon: '漢',
        description: 'Basic kanji characters',
        lessons: [
          {
            id: 'kanji-1',
            title: 'Numbers',
            type: 'kanji',
            difficulty: 2,
            items: [],
            estimatedTime: 20,
            isUnlocked: false,
            isCompleted: false,
          },
        ],
        progress: 0,
        totalLessons: 10,
        completedLessons: 0,
      },
    ];
    dispatch(setModules(initialModules));
  }, [dispatch]);

  const handleModulePress = (moduleId: string) => {
    router.push({ pathname: `/lesson/[id]`, params: { id: moduleId } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            こんにちは, {profile?.name || 'Student'}!
          </Text>
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={20} color="#FF6B35" />
            <Text style={styles.streakText}>{streakCount} day streak</Text>
          </View>
        </View>

        {/* Daily Goal Progress */}
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          style={styles.progressCard}
        >
          <Text style={styles.progressTitle}>Today's Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '30%' }]} />
          </View>
          <Text style={styles.progressText}>5 / 15 minutes studied</Text>
        </LinearGradient>

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📱 AI Recommendations</Text>
            <TouchableOpacity style={styles.recommendationCard}>
              <Text style={styles.recommendationTitle}>
                {recommendations[0].title}
              </Text>
              <Text style={styles.recommendationDescription}>
                {recommendations[0].description}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Learning Modules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Learning Modules</Text>
          {modules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={styles.moduleCard}
              onPress={() => handleModulePress(module.id)}
            >
              <View style={styles.moduleIcon}>
                <Text style={styles.moduleIconText}>{module.icon}</Text>
              </View>
              <View style={styles.moduleContent}>
                <Text style={styles.moduleName}>{module.name}</Text>
                <Text style={styles.moduleDescription}>
                  {module.description}
                </Text>
                <View style={styles.moduleProgress}>
                  <View style={styles.moduleProgressBar}>
                    <View
                      style={[
                        styles.moduleProgressFill,
                        { width: `${module.progress}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.moduleProgressText}>
                    {module.completedLessons}/{module.totalLessons} lessons
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Practice */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Quick Practice</Text>
          <View style={styles.quickPracticeContainer}>
            <TouchableOpacity style={styles.quickPracticeButton}>
              <Ionicons name="refresh" size={24} color="#6366F1" />
              <Text style={styles.quickPracticeText}>Review</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickPracticeButton}>
              <Ionicons name="mic" size={24} color="#EC4899" />
              <Text style={styles.quickPracticeText}>Speaking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickPracticeButton}>
              <Ionicons name="pencil" size={24} color="#10B981" />
              <Text style={styles.quickPracticeText}>Writing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  progressCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  recommendationCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  moduleIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#F3F4F6',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moduleIconText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  moduleContent: {
    flex: 1,
  },
  moduleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  moduleProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginRight: 8,
  },
  moduleProgressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  moduleProgressText: {
    fontSize: 12,
    color: '#6B7280',
    minWidth: 80,
  },
  quickPracticeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickPracticeButton: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickPracticeText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
});
