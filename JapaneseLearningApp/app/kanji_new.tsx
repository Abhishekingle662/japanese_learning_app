import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

interface KanjiChar {
  character: string;
  readings: {
    onyomi: string[];
    kunyomi: string[];
  };
  meaning: string;
  examples: string[];
  category: string;
  strokeCount: number;
}

const kanjiData: KanjiChar[] = [
  // Numbers
  { 
    character: '一', 
    readings: { onyomi: ['いち', 'いつ'], kunyomi: ['ひと'] }, 
    meaning: 'one', 
    examples: ['一つ (ひとつ) - one thing', '一人 (ひとり) - one person', '一日 (いちにち) - one day'], 
    category: 'numbers',
    strokeCount: 1
  },
  { 
    character: '二', 
    readings: { onyomi: ['に'], kunyomi: ['ふた'] }, 
    meaning: 'two', 
    examples: ['二つ (ふたつ) - two things', '二人 (ふたり) - two people', '二階 (にかい) - second floor'], 
    category: 'numbers',
    strokeCount: 2
  },
  { 
    character: '三', 
    readings: { onyomi: ['さん'], kunyomi: ['みっつ'] }, 
    meaning: 'three', 
    examples: ['三つ (みっつ) - three things', '三人 (さんにん) - three people', '三月 (さんがつ) - March'], 
    category: 'numbers',
    strokeCount: 3
  },
  { 
    character: '四', 
    readings: { onyomi: ['し'], kunyomi: ['よん', 'よっつ'] }, 
    meaning: 'four', 
    examples: ['四つ (よっつ) - four things', '四人 (よにん) - four people', '四月 (しがつ) - April'], 
    category: 'numbers',
    strokeCount: 5
  },
  { 
    character: '五', 
    readings: { onyomi: ['ご'], kunyomi: ['いつ'] }, 
    meaning: 'five', 
    examples: ['五つ (いつつ) - five things', '五人 (ごにん) - five people', '五月 (ごがつ) - May'], 
    category: 'numbers',
    strokeCount: 4
  },
  { 
    character: '六', 
    readings: { onyomi: ['ろく'], kunyomi: ['むっつ'] }, 
    meaning: 'six', 
    examples: ['六つ (むっつ) - six things', '六人 (ろくにん) - six people', '六月 (ろくがつ) - June'], 
    category: 'numbers',
    strokeCount: 4
  },
  { 
    character: '七', 
    readings: { onyomi: ['しち'], kunyomi: ['なな'] }, 
    meaning: 'seven', 
    examples: ['七つ (ななつ) - seven things', '七人 (しちにん) - seven people', '七月 (しちがつ) - July'], 
    category: 'numbers',
    strokeCount: 2
  },
  { 
    character: '八', 
    readings: { onyomi: ['はち'], kunyomi: ['やっつ'] }, 
    meaning: 'eight', 
    examples: ['八つ (やっつ) - eight things', '八人 (はちにん) - eight people', '八月 (はちがつ) - August'], 
    category: 'numbers',
    strokeCount: 2
  },
  { 
    character: '九', 
    readings: { onyomi: ['きゅう', 'く'], kunyomi: ['ここの'] }, 
    meaning: 'nine', 
    examples: ['九つ (ここのつ) - nine things', '九人 (きゅうにん) - nine people', '九月 (くがつ) - September'], 
    category: 'numbers',
    strokeCount: 2
  },
  { 
    character: '十', 
    readings: { onyomi: ['じゅう'], kunyomi: ['とお'] }, 
    meaning: 'ten', 
    examples: ['十 (じゅう) - ten', '十人 (じゅうにん) - ten people', '十月 (じゅうがつ) - October'], 
    category: 'numbers',
    strokeCount: 2
  },

  // Basic Elements
  { 
    character: '人', 
    readings: { onyomi: ['じん', 'にん'], kunyomi: ['ひと'] }, 
    meaning: 'person', 
    examples: ['人 (ひと) - person', '日本人 (にほんじん) - Japanese person', '外国人 (がいこくじん) - foreigner'], 
    category: 'people',
    strokeCount: 2
  },
  { 
    character: '水', 
    readings: { onyomi: ['すい'], kunyomi: ['みず'] }, 
    meaning: 'water', 
    examples: ['水 (みず) - water', '水曜日 (すいようび) - Wednesday', '水族館 (すいぞくかん) - aquarium'], 
    category: 'nature',
    strokeCount: 4
  },
  { 
    character: '火', 
    readings: { onyomi: ['か'], kunyomi: ['ひ'] }, 
    meaning: 'fire', 
    examples: ['火 (ひ) - fire', '火曜日 (かようび) - Tuesday', '花火 (はなび) - fireworks'], 
    category: 'nature',
    strokeCount: 4
  },
  { 
    character: '土', 
    readings: { onyomi: ['ど'], kunyomi: ['つち'] }, 
    meaning: 'earth/soil', 
    examples: ['土 (つち) - soil', '土曜日 (どようび) - Saturday', '土地 (とち) - land'], 
    category: 'nature',
    strokeCount: 3
  },
  { 
    character: '木', 
    readings: { onyomi: ['もく', 'ぼく'], kunyomi: ['き'] }, 
    meaning: 'tree/wood', 
    examples: ['木 (き) - tree', '木曜日 (もくようび) - Thursday', '大木 (たいぼく) - big tree'], 
    category: 'nature',
    strokeCount: 4
  },
  { 
    character: '金', 
    readings: { onyomi: ['きん', 'こん'], kunyomi: ['かね'] }, 
    meaning: 'gold/money/metal', 
    examples: ['金 (きん) - gold', '金曜日 (きんようび) - Friday', 'お金 (おかね) - money'], 
    category: 'nature',
    strokeCount: 8
  },

  // Time & Nature
  { 
    character: '日', 
    readings: { onyomi: ['にち', 'じつ'], kunyomi: ['ひ', 'か'] }, 
    meaning: 'day/sun', 
    examples: ['日 (ひ) - day/sun', '今日 (きょう) - today', '日本 (にほん) - Japan'], 
    category: 'time',
    strokeCount: 4
  },
  { 
    character: '月', 
    readings: { onyomi: ['げつ', 'がつ'], kunyomi: ['つき'] }, 
    meaning: 'month/moon', 
    examples: ['月 (つき) - moon', '今月 (こんげつ) - this month', '月曜日 (げつようび) - Monday'], 
    category: 'time',
    strokeCount: 4
  },
  { 
    character: '年', 
    readings: { onyomi: ['ねん'], kunyomi: ['とし'] }, 
    meaning: 'year', 
    examples: ['年 (とし) - year', '今年 (ことし) - this year', '来年 (らいねん) - next year'], 
    category: 'time',
    strokeCount: 6
  },
  { 
    character: '時', 
    readings: { onyomi: ['じ'], kunyomi: ['とき'] }, 
    meaning: 'time/hour', 
    examples: ['時 (とき) - time', '時間 (じかん) - time/hours', '何時 (なんじ) - what time'], 
    category: 'time',
    strokeCount: 10
  },

  // Mountain & Nature
  { 
    character: '山', 
    readings: { onyomi: ['さん'], kunyomi: ['やま'] }, 
    meaning: 'mountain', 
    examples: ['山 (やま) - mountain', '富士山 (ふじさん) - Mt. Fuji', '山田 (やまだ) - Yamada (surname)'], 
    category: 'nature',
    strokeCount: 3
  },
  { 
    character: '川', 
    readings: { onyomi: ['せん'], kunyomi: ['かわ', 'がわ'] }, 
    meaning: 'river', 
    examples: ['川 (かわ) - river', '小川 (おがわ) - small river', '川田 (かわだ) - Kawada (surname)'], 
    category: 'nature',
    strokeCount: 3
  },
  { 
    character: '海', 
    readings: { onyomi: ['かい'], kunyomi: ['うみ'] }, 
    meaning: 'sea/ocean', 
    examples: ['海 (うみ) - sea', '海外 (かいがい) - overseas', '日本海 (にほんかい) - Sea of Japan'], 
    category: 'nature',
    strokeCount: 9
  },

  // Body Parts
  { 
    character: '手', 
    readings: { onyomi: ['しゅ'], kunyomi: ['て'] }, 
    meaning: 'hand', 
    examples: ['手 (て) - hand', '手紙 (てがみ) - letter', '運転手 (うんてんしゅ) - driver'], 
    category: 'body',
    strokeCount: 4
  },
  { 
    character: '目', 
    readings: { onyomi: ['もく'], kunyomi: ['め'] }, 
    meaning: 'eye', 
    examples: ['目 (め) - eye', '目標 (もくひょう) - goal', '一番目 (いちばんめ) - first'], 
    category: 'body',
    strokeCount: 5
  },
  { 
    character: '口', 
    readings: { onyomi: ['こう'], kunyomi: ['くち', 'ぐち'] }, 
    meaning: 'mouth/entrance', 
    examples: ['口 (くち) - mouth', '入口 (いりぐち) - entrance', '人口 (じんこう) - population'], 
    category: 'body',
    strokeCount: 3
  },

  // Family
  { 
    character: '父', 
    readings: { onyomi: ['ふ'], kunyomi: ['ちち'] }, 
    meaning: 'father', 
    examples: ['父 (ちち) - father', '父親 (ちちおや) - father', 'お父さん (おとうさん) - father (polite)'], 
    category: 'family',
    strokeCount: 4
  },
  { 
    character: '母', 
    readings: { onyomi: ['ぼ'], kunyomi: ['はは'] }, 
    meaning: 'mother', 
    examples: ['母 (はは) - mother', '母親 (ははおや) - mother', 'お母さん (おかあさん) - mother (polite)'], 
    category: 'family',
    strokeCount: 5
  },
  { 
    character: '子', 
    readings: { onyomi: ['し'], kunyomi: ['こ'] }, 
    meaning: 'child', 
    examples: ['子 (こ) - child', '子供 (こども) - children', '男の子 (おとこのこ) - boy'], 
    category: 'family',
    strokeCount: 3
  },

  // Basic Actions
  { 
    character: '行', 
    readings: { onyomi: ['こう', 'ぎょう'], kunyomi: ['い', 'ゆ'] }, 
    meaning: 'go', 
    examples: ['行く (いく) - to go', '旅行 (りょこう) - travel', '銀行 (ぎんこう) - bank'], 
    category: 'actions',
    strokeCount: 6
  },
  { 
    character: '来', 
    readings: { onyomi: ['らい'], kunyomi: ['く', 'き'] }, 
    meaning: 'come', 
    examples: ['来る (くる) - to come', '来年 (らいねん) - next year', '未来 (みらい) - future'], 
    category: 'actions',
    strokeCount: 7
  },
  { 
    character: '見', 
    readings: { onyomi: ['けん'], kunyomi: ['み'] }, 
    meaning: 'see/look', 
    examples: ['見る (みる) - to see', '見学 (けんがく) - field trip', '意見 (いけん) - opinion'], 
    category: 'actions',
    strokeCount: 7
  },
];

const categories = [
  { name: 'All', value: 'all' },
  { name: 'Numbers', value: 'numbers' },
  { name: 'Nature', value: 'nature' },
  { name: 'Time', value: 'time' },
  { name: 'People', value: 'people' },
  { name: 'Body', value: 'body' },
  { name: 'Family', value: 'family' },
  { name: 'Actions', value: 'actions' },
];

export default function KanjiPage() {
  const [selectedChar, setSelectedChar] = useState<KanjiChar | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showReadings, setShowReadings] = useState(false);

  const filteredData = selectedCategory === 'all' 
    ? kanjiData 
    : kanjiData.filter(char => char.category === selectedCategory);

  const renderCharacterCard = ({ item }: { item: KanjiChar }) => (
    <TouchableOpacity 
      style={[styles.card, selectedChar?.character === item.character && styles.selectedCard]} 
      onPress={() => setSelectedChar(item)}
    >
      <Text style={styles.character}>{item.character}</Text>
      <Text style={styles.meaning}>{item.meaning}</Text>
      <Text style={styles.strokeCount}>{item.strokeCount} strokes</Text>
    </TouchableOpacity>
  );

  const renderCategoryButton = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={[styles.categoryButton, selectedCategory === item.value && styles.selectedCategory]}
      onPress={() => setSelectedCategory(item.value)}
    >
      <Text style={[styles.categoryText, selectedCategory === item.value && styles.selectedCategoryText]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kanji Learning</Text>
        <Text style={styles.subtitle}>Master Chinese characters</Text>
      </View>

      {/* Category Filter */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderCategoryButton}
          keyExtractor={(item) => item.value}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Character Grid */}
      <View style={styles.gridContainer}>
        <FlatList
          data={filteredData}
          numColumns={3}
          renderItem={renderCharacterCard}
          keyExtractor={(item) => item.character}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Character Detail */}
      {selectedChar && (
        <View style={styles.detailContainer}>
          <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailCharacter}>{selectedChar.character}</Text>
              <Text style={styles.detailMeaning}>{selectedChar.meaning}</Text>
              <Text style={styles.detailStrokeCount}>{selectedChar.strokeCount} strokes</Text>
            </View>
            
            {/* Readings */}
            <View style={styles.readingsContainer}>
              <TouchableOpacity 
                style={styles.readingsToggle}
                onPress={() => setShowReadings(!showReadings)}
              >
                <Text style={styles.readingsToggleText}>
                  {showReadings ? 'Hide' : 'Show'} Readings
                </Text>
              </TouchableOpacity>
              
              {showReadings && (
                <View style={styles.readingsContent}>
                  <View style={styles.readingType}>
                    <Text style={styles.readingLabel}>On'yomi (音読み):</Text>
                    <Text style={styles.readingText}>{selectedChar.readings.onyomi.join(', ')}</Text>
                  </View>
                  <View style={styles.readingType}>
                    <Text style={styles.readingLabel}>Kun'yomi (訓読み):</Text>
                    <Text style={styles.readingText}>{selectedChar.readings.kunyomi.join(', ')}</Text>
                  </View>
                </View>
              )}
            </View>
            
            {/* Examples */}
            <View style={styles.examplesContainer}>
              <Text style={styles.examplesTitle}>Examples:</Text>
              {selectedChar.examples.map((example, index) => (
                <View key={index} style={styles.exampleItem}>
                  <Text style={styles.exampleText}>{example}</Text>
                </View>
              ))}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.practiceButton}
                onPress={() => {
                  console.log('Practice writing:', selectedChar.character);
                }}
              >
                <Text style={styles.practiceButtonText}>Practice Writing</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.strokeOrderButton}
                onPress={() => {
                  console.log('Show stroke order:', selectedChar.character);
                }}
              >
                <Text style={styles.strokeOrderButtonText}>Stroke Order</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DC2626',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7F1D1D',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 4,
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DC2626',
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
  },
  selectedCategory: {
    backgroundColor: '#DC2626',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#DC2626',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  gridContainer: {
    flex: 1,
    paddingTop: 16,
  },
  grid: {
    paddingHorizontal: 16,
  },
  card: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    margin: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 8,
  },
  selectedCard: {
    backgroundColor: '#DC2626',
    elevation: 4,
    shadowOpacity: 0.2,
  },
  character: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7F1D1D',
    marginBottom: 4,
  },
  meaning: {
    fontSize: 11,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 2,
  },
  strokeCount: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'center',
  },
  detailContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    maxHeight: '60%',
  },
  detailScroll: {
    padding: 20,
  },
  detailHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  detailCharacter: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  detailMeaning: {
    fontSize: 24,
    color: '#7F1D1D',
    marginTop: 8,
    fontWeight: '600',
  },
  detailStrokeCount: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  readingsContainer: {
    marginBottom: 20,
  },
  readingsToggle: {
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'center',
    marginBottom: 12,
  },
  readingsToggleText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  readingsContent: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
  },
  readingType: {
    marginBottom: 8,
  },
  readingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F1D1D',
    marginBottom: 2,
  },
  readingText: {
    fontSize: 16,
    color: '#DC2626',
  },
  examplesContainer: {
    marginBottom: 20,
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7F1D1D',
    marginBottom: 12,
  },
  exampleItem: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
  },
  exampleText: {
    fontSize: 16,
    color: '#374151',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  practiceButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  practiceButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  strokeOrderButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  strokeOrderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
