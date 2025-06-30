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
              { id: 'a', character: 'あ', romanji: 'a', examples: ['あさ (asa) - morning', 'あめ (ame) - rain', 'あき (aki) - autumn'] },
              { id: 'i', character: 'い', romanji: 'i', examples: ['いえ (ie) - house', 'いぬ (inu) - dog', 'いろ (iro) - color'] },
              { id: 'u', character: 'う', romanji: 'u', examples: ['うみ (umi) - sea', 'うま (uma) - horse', 'うた (uta) - song'] },
              { id: 'e', character: 'え', romanji: 'e', examples: ['えき (eki) - station', 'えが (ega) - picture', 'えん (en) - yen'] },
              { id: 'o', character: 'お', romanji: 'o', examples: ['おちゃ (ocha) - tea', 'おんがく (ongaku) - music', 'おかね (okane) - money'] },
            ],
            estimatedTime: 15,
            isUnlocked: true,
            isCompleted: false,
          },
          {
            id: 'hiragana-2',
            title: 'K-sounds (か, き, く, け, こ)',
            type: 'hiragana',
            difficulty: 1,
            items: [
              { id: 'ka', character: 'か', romanji: 'ka', examples: ['かみ (kami) - paper', 'かぞく (kazoku) - family', 'かわ (kawa) - river'] },
              { id: 'ki', character: 'き', romanji: 'ki', examples: ['き (ki) - tree', 'きいろ (kiiro) - yellow', 'きのう (kinou) - yesterday'] },
              { id: 'ku', character: 'く', romanji: 'ku', examples: ['くるま (kuruma) - car', 'くも (kumo) - cloud', 'くつ (kutsu) - shoes'] },
              { id: 'ke', character: 'け', romanji: 'ke', examples: ['けさ (kesa) - this morning', 'けいき (keiki) - cake', 'けん (ken) - prefecture'] },
              { id: 'ko', character: 'こ', romanji: 'ko', examples: ['ここ (koko) - here', 'こども (kodomo) - child', 'こえ (koe) - voice'] },
            ],
            estimatedTime: 18,
            isUnlocked: true,
            isCompleted: false,
          },
          {
            id: 'hiragana-3',
            title: 'S-sounds (さ, し, す, せ, そ)',
            type: 'hiragana',
            difficulty: 1,
            items: [
              { id: 'sa', character: 'さ', romanji: 'sa', examples: ['さかな (sakana) - fish', 'さくら (sakura) - cherry blossom', 'さとう (satou) - sugar'] },
              { id: 'shi', character: 'し', romanji: 'shi', examples: ['しお (shio) - salt', 'しごと (shigoto) - work', 'しんぶん (shinbun) - newspaper'] },
              { id: 'su', character: 'す', romanji: 'su', examples: ['すし (sushi) - sushi', 'すいか (suika) - watermelon', 'すずき (suzuki) - sea bass'] },
              { id: 'se', character: 'せ', romanji: 'se', examples: ['せんせい (sensei) - teacher', 'せかい (sekai) - world', 'せき (seki) - seat'] },
              { id: 'so', character: 'そ', romanji: 'so', examples: ['そら (sora) - sky', 'そば (soba) - buckwheat noodles', 'そと (soto) - outside'] },
            ],
            estimatedTime: 18,
            isUnlocked: false,
            isCompleted: false,
          },
        ],
        progress: 15,
        totalLessons: 12,
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
            title: 'Vowels (ア, イ, ウ, エ, オ)',
            type: 'katakana',
            difficulty: 1,
            items: [
              { id: 'a', character: 'ア', romanji: 'a', examples: ['アメリカ (Amerika) - America', 'アイス (aisu) - ice cream', 'アニメ (anime) - animation'] },
              { id: 'i', character: 'イ', romanji: 'i', examples: ['イタリア (Itaria) - Italy', 'インド (Indo) - India', 'イヤホン (iyahon) - earphones'] },
              { id: 'u', character: 'ウ', romanji: 'u', examples: ['ウイスキー (uisukii) - whiskey', 'ウール (uuru) - wool', 'ウェブ (uebu) - web'] },
              { id: 'e', character: 'エ', romanji: 'e', examples: ['エアコン (eakon) - air conditioner', 'エンジン (enjin) - engine', 'エレベーター (erebeetaa) - elevator'] },
              { id: 'o', character: 'オ', romanji: 'o', examples: ['オレンジ (orenji) - orange', 'オフィス (ofisu) - office', 'オーストラリア (Oosutoraria) - Australia'] },
            ],
            estimatedTime: 15,
            isUnlocked: true,
            isCompleted: false,
          },
          {
            id: 'katakana-2',
            title: 'K-sounds (カ, キ, ク, ケ, コ)',
            type: 'katakana',
            difficulty: 1,
            items: [
              { id: 'ka', character: 'カ', romanji: 'ka', examples: ['カメラ (kamera) - camera', 'カフェ (kafe) - cafe', 'カレー (karee) - curry'] },
              { id: 'ki', character: 'キ', romanji: 'ki', examples: ['キッチン (kicchin) - kitchen', 'キス (kisu) - kiss', 'キャンプ (kyanpu) - camp'] },
              { id: 'ku', character: 'ク', romanji: 'ku', examples: ['クラス (kurasu) - class', 'クリーム (kuriimu) - cream', 'クッキー (kukkii) - cookie'] },
              { id: 'ke', character: 'ケ', romanji: 'ke', examples: ['ケーキ (keeki) - cake', 'ケース (keesu) - case', 'ケチャップ (kechappu) - ketchup'] },
              { id: 'ko', character: 'コ', romanji: 'ko', examples: ['コーヒー (koohii) - coffee', 'コンピュータ (konpyuuta) - computer', 'コピー (kopii) - copy'] },
            ],
            estimatedTime: 18,
            isUnlocked: false,
            isCompleted: false,
          },
        ],
        progress: 5,
        totalLessons: 10,
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
            title: 'Numbers (一〜十)',
            type: 'kanji',
            difficulty: 2,
            items: [
              { id: 'ichi', character: '一', romanji: 'ichi', examples: ['一つ (hitotsu) - one', '一人 (hitori) - one person', '一日 (ichinichi) - one day'] },
              { id: 'ni', character: '二', romanji: 'ni', examples: ['二つ (futatsu) - two', '二人 (futari) - two people', '二階 (nikai) - second floor'] },
              { id: 'san', character: '三', romanji: 'san', examples: ['三つ (mittsu) - three', '三人 (sannin) - three people', '三月 (sangatsu) - March'] },
              { id: 'yon', character: '四', romanji: 'yon/shi', examples: ['四つ (yottsu) - four', '四人 (yonin) - four people', '四月 (shigatsu) - April'] },
              { id: 'go', character: '五', romanji: 'go', examples: ['五つ (itsutsu) - five', '五人 (gonin) - five people', '五月 (gogatsu) - May'] },
            ],
            estimatedTime: 20,
            isUnlocked: true,
            isCompleted: false,
          },
          {
            id: 'kanji-2',
            title: 'Basic Elements (人, 水, 火, 土)',
            type: 'kanji',
            difficulty: 2,
            items: [
              { id: 'hito', character: '人', romanji: 'hito/jin/nin', examples: ['人 (hito) - person', '日本人 (nihonjin) - Japanese person', '外国人 (gaikokujin) - foreigner'] },
              { id: 'mizu', character: '水', romanji: 'mizu/sui', examples: ['水 (mizu) - water', '水曜日 (suiyoubi) - Wednesday', '水族館 (suizokukan) - aquarium'] },
              { id: 'hi', character: '火', romanji: 'hi/ka', examples: ['火 (hi) - fire', '火曜日 (kayoubi) - Tuesday', '花火 (hanabi) - fireworks'] },
              { id: 'tsuchi', character: '土', romanji: 'tsuchi/do', examples: ['土 (tsuchi) - soil/earth', '土曜日 (doyoubi) - Saturday', '土地 (tochi) - land'] },
            ],
            estimatedTime: 25,
            isUnlocked: false,
            isCompleted: false,
          },
          {
            id: 'kanji-3',
            title: 'Time & Nature (日, 月, 木, 山)',
            type: 'kanji',
            difficulty: 2,
            items: [
              { id: 'hi', character: '日', romanji: 'hi/nichi/ka', examples: ['日 (hi) - day/sun', '今日 (kyou) - today', '日本 (nihon) - Japan'] },
              { id: 'tsuki', character: '月', romanji: 'tsuki/getsu', examples: ['月 (tsuki) - moon/month', '今月 (kongetsu) - this month', '月曜日 (getsuyoubi) - Monday'] },
              { id: 'ki', character: '木', romanji: 'ki/moku', examples: ['木 (ki) - tree/wood', '木曜日 (mokuyoubi) - Thursday', '大木 (taiboku) - big tree'] },
              { id: 'yama', character: '山', romanji: 'yama/san', examples: ['山 (yama) - mountain', '富士山 (fujisan) - Mt. Fuji', '山田 (yamada) - Yamada (surname)'] },
            ],
            estimatedTime: 25,
            isUnlocked: false,
            isCompleted: false,
          },
        ],
        progress: 0,
        totalLessons: 15,
        completedLessons: 0,
      },
      {
        id: 'pronunciation',
        name: 'Pronunciation',
        icon: '🎵',
        description: 'Master Japanese pronunciation',
        lessons: [
          {
            id: 'pronunciation-1',
            title: 'Basic Sounds & Pitch',
            type: 'pronunciation',
            difficulty: 1,
            items: [
              { id: 'vowels', character: 'あいうえお', romanji: 'a-i-u-e-o', examples: ['Long vs short vowels', 'Pitch accent basics'] },
              { id: 'consonants', character: 'かきくけこ', romanji: 'k-sounds', examples: ['Clear consonant pronunciation', 'Avoiding English sounds'] },
            ],
            estimatedTime: 20,
            isUnlocked: true,
            isCompleted: false,
          },
        ],
        progress: 0,
        totalLessons: 8,
        completedLessons: 0,
      },
      {
        id: 'vocabulary',
        name: 'Vocabulary',
        icon: '📚',
        description: 'Build your Japanese vocabulary',
        lessons: [
          {
            id: 'vocabulary-1',
            title: 'Greetings & Basic Phrases',
            type: 'vocabulary',
            difficulty: 1,
            items: [
              { id: 'ohayou', character: 'おはよう', romanji: 'ohayou', examples: ['Morning greeting (casual)'] },
              { id: 'konnichiwa', character: 'こんにちは', romanji: 'konnichiwa', examples: ['Hello/Good afternoon'] },
              { id: 'arigatou', character: 'ありがとう', romanji: 'arigatou', examples: ['Thank you (casual)'] },
              { id: 'sumimasen', character: 'すみません', romanji: 'sumimasen', examples: ['Excuse me/Sorry'] },
            ],
            estimatedTime: 15,
            isUnlocked: true,
            isCompleted: false,
          },
          {
            id: 'vocabulary-2',
            title: 'Family & People',
            type: 'vocabulary',
            difficulty: 1,
            items: [
              { id: 'kazoku', character: '家族', romanji: 'kazoku', examples: ['Family'] },
              { id: 'chichi', character: '父', romanji: 'chichi', examples: ['Father (own)'] },
              { id: 'haha', character: '母', romanji: 'haha', examples: ['Mother (own)'] },
              { id: 'tomodachi', character: '友達', romanji: 'tomodachi', examples: ['Friend'] },
            ],
            estimatedTime: 18,
            isUnlocked: false,
            isCompleted: false,
          },
        ],
        progress: 0,
        totalLessons: 12,
        completedLessons: 0,
      },
      {
        id: 'grammar',
        name: 'Grammar',
        icon: '⚡',
        description: 'Learn Japanese sentence structure',
        lessons: [
          {
            id: 'grammar-1',
            title: 'です/である - To Be',
            type: 'grammar',
            difficulty: 2,
            items: [
              { id: 'desu', character: 'です', romanji: 'desu', examples: ['Polite form of "to be"', '学生です (gakusei desu) - I am a student'] },
              { id: 'da', character: 'だ', romanji: 'da', examples: ['Casual form of "to be"', '学生だ (gakusei da) - I am a student'] },
            ],
            estimatedTime: 25,
            isUnlocked: false,
            isCompleted: false,
          },
        ],
        progress: 0,
        totalLessons: 20,
        completedLessons: 0,
      },
    ];
    dispatch(setModules(initialModules));
  }, [dispatch]);

  const handleModulePress = (moduleId: string) => {
    router.push(`/${moduleId}` as any);
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
