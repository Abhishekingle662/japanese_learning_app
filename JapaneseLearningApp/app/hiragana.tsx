import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import InteractiveQuiz from '../components/InteractiveQuiz';

interface HiraganaChar {
  character: string;
  romanji: string;
  examples: string[];
  category: string;
}

const hiraganaData: HiraganaChar[] = [
  // Vowels
  { character: 'あ', romanji: 'a', examples: ['あさ (asa) - morning', 'あめ (ame) - rain', 'あき (aki) - autumn'], category: 'vowels' },
  { character: 'い', romanji: 'i', examples: ['いえ (ie) - house', 'いぬ (inu) - dog', 'いろ (iro) - color'], category: 'vowels' },
  { character: 'う', romanji: 'u', examples: ['うみ (umi) - sea', 'うま (uma) - horse', 'うた (uta) - song'], category: 'vowels' },
  { character: 'え', romanji: 'e', examples: ['えき (eki) - station', 'えが (ega) - picture', 'えん (en) - yen'], category: 'vowels' },
  { character: 'お', romanji: 'o', examples: ['おちゃ (ocha) - tea', 'おんがく (ongaku) - music', 'おかね (okane) - money'], category: 'vowels' },
  
  // K-sounds
  { character: 'か', romanji: 'ka', examples: ['かみ (kami) - paper', 'かぞく (kazoku) - family', 'かわ (kawa) - river'], category: 'k-sounds' },
  { character: 'き', romanji: 'ki', examples: ['き (ki) - tree', 'きいろ (kiiro) - yellow', 'きのう (kinou) - yesterday'], category: 'k-sounds' },
  { character: 'く', romanji: 'ku', examples: ['くるま (kuruma) - car', 'くも (kumo) - cloud', 'くつ (kutsu) - shoes'], category: 'k-sounds' },
  { character: 'け', romanji: 'ke', examples: ['けさ (kesa) - this morning', 'けいき (keiki) - cake', 'けん (ken) - prefecture'], category: 'k-sounds' },
  { character: 'こ', romanji: 'ko', examples: ['ここ (koko) - here', 'こども (kodomo) - child', 'こえ (koe) - voice'], category: 'k-sounds' },
  
  // S-sounds
  { character: 'さ', romanji: 'sa', examples: ['さかな (sakana) - fish', 'さくら (sakura) - cherry blossom', 'さとう (satou) - sugar'], category: 's-sounds' },
  { character: 'し', romanji: 'shi', examples: ['しお (shio) - salt', 'しごと (shigoto) - work', 'しんぶん (shinbun) - newspaper'], category: 's-sounds' },
  { character: 'す', romanji: 'su', examples: ['すし (sushi) - sushi', 'すいか (suika) - watermelon', 'すずき (suzuki) - sea bass'], category: 's-sounds' },
  { character: 'せ', romanji: 'se', examples: ['せんせい (sensei) - teacher', 'せかい (sekai) - world', 'せき (seki) - seat'], category: 's-sounds' },
  { character: 'そ', romanji: 'so', examples: ['そら (sora) - sky', 'そば (soba) - buckwheat noodles', 'そと (soto) - outside'], category: 's-sounds' },
  
  // T-sounds
  { character: 'た', romanji: 'ta', examples: ['たべもの (tabemono) - food', 'たまご (tamago) - egg', 'たかい (takai) - expensive/tall'], category: 't-sounds' },
  { character: 'ち', romanji: 'chi', examples: ['ちず (chizu) - map', 'ちいさい (chiisai) - small', 'ちち (chichi) - father'], category: 't-sounds' },
  { character: 'つ', romanji: 'tsu', examples: ['つき (tsuki) - moon', 'つくえ (tsukue) - desk', 'つめたい (tsumetai) - cold'], category: 't-sounds' },
  { character: 'て', romanji: 'te', examples: ['て (te) - hand', 'てんき (tenki) - weather', 'てがみ (tegami) - letter'], category: 't-sounds' },
  { character: 'と', romanji: 'to', examples: ['とけい (tokei) - clock', 'ともだち (tomodachi) - friend', 'とり (tori) - bird'], category: 't-sounds' },
  
  // N-sounds
  { character: 'な', romanji: 'na', examples: ['なまえ (namae) - name', 'なつ (natsu) - summer', 'なに (nani) - what'], category: 'n-sounds' },
  { character: 'に', romanji: 'ni', examples: ['にほん (nihon) - Japan', 'にく (niku) - meat', 'にわ (niwa) - garden'], category: 'n-sounds' },
  { character: 'ぬ', romanji: 'nu', examples: ['ぬの (nuno) - cloth', 'ぬるい (nurui) - lukewarm', 'ぬく (nuku) - to take off'], category: 'n-sounds' },
  { character: 'ね', romanji: 'ne', examples: ['ねこ (neko) - cat', 'ねる (neru) - to sleep', 'ねだん (nedan) - price'], category: 'n-sounds' },
  { character: 'の', romanji: 'no', examples: ['のむ (nomu) - to drink', 'のり (nori) - seaweed', 'のど (nodo) - throat'], category: 'n-sounds' },
  
  // H-sounds
  { character: 'は', romanji: 'ha', examples: ['はな (hana) - flower/nose', 'はし (hashi) - bridge/chopsticks', 'はる (haru) - spring'], category: 'h-sounds' },
  { character: 'ひ', romanji: 'hi', examples: ['ひ (hi) - fire/day', 'ひと (hito) - person', 'ひだり (hidari) - left'], category: 'h-sounds' },
  { character: 'ふ', romanji: 'fu', examples: ['ふゆ (fuyu) - winter', 'ふね (fune) - ship', 'ふるい (furui) - old'], category: 'h-sounds' },
  { character: 'へ', romanji: 'he', examples: ['へや (heya) - room', 'へび (hebi) - snake', 'へん (hen) - strange'], category: 'h-sounds' },
  { character: 'ほ', romanji: 'ho', examples: ['ほん (hon) - book', 'ほし (hoshi) - star', 'ほそい (hosoi) - thin'], category: 'h-sounds' },
  
  // M-sounds
  { character: 'ま', romanji: 'ma', examples: ['まち (machi) - town', 'まど (mado) - window', 'まいにち (mainichi) - every day'], category: 'm-sounds' },
  { character: 'み', romanji: 'mi', examples: ['みず (mizu) - water', 'みち (michi) - road', 'みぎ (migi) - right'], category: 'm-sounds' },
  { character: 'む', romanji: 'mu', examples: ['むし (mushi) - insect', 'むずかしい (muzukashii) - difficult', 'むらさき (murasaki) - purple'], category: 'm-sounds' },
  { character: 'め', romanji: 'me', examples: ['め (me) - eye', 'めがね (megane) - glasses', 'めし (meshi) - meal'], category: 'm-sounds' },
  { character: 'も', romanji: 'mo', examples: ['もの (mono) - thing', 'もり (mori) - forest', 'もう (mou) - already'], category: 'm-sounds' },
  
  // Y-sounds
  { character: 'や', romanji: 'ya', examples: ['やま (yama) - mountain', 'やすい (yasui) - cheap', 'やさい (yasai) - vegetables'], category: 'y-sounds' },
  { character: 'ゆ', romanji: 'yu', examples: ['ゆき (yuki) - snow', 'ゆめ (yume) - dream', 'ゆっくり (yukkuri) - slowly'], category: 'y-sounds' },
  { character: 'よ', romanji: 'yo', examples: ['よる (yoru) - night', 'よい (yoi) - good', 'よん (yon) - four'], category: 'y-sounds' },
  
  // R-sounds
  { character: 'ら', romanji: 'ra', examples: ['らいねん (rainen) - next year', 'らくだ (rakuda) - camel', 'らんち (ranchi) - lunch'], category: 'r-sounds' },
  { character: 'り', romanji: 'ri', examples: ['りんご (ringo) - apple', 'りょうり (ryouri) - cooking', 'りゆう (riyuu) - reason'], category: 'r-sounds' },
  { character: 'る', romanji: 'ru', examples: ['るす (rusu) - absence', 'るいじ (ruiji) - similar', 'るーる (ruuru) - rule'], category: 'r-sounds' },
  { character: 'れ', romanji: 're', examples: ['れいぞうこ (reizouko) - refrigerator', 'れんしゅう (renshuu) - practice', 'れきし (rekishi) - history'], category: 'r-sounds' },
  { character: 'ろ', romanji: 'ro', examples: ['ろく (roku) - six', 'ろうそく (rousoku) - candle', 'ろんぶん (ronbun) - thesis'], category: 'r-sounds' },
  
  // W-sounds & N
  { character: 'わ', romanji: 'wa', examples: ['わたし (watashi) - I', 'わかる (wakaru) - to understand', 'わるい (warui) - bad'], category: 'w-sounds' },
  { character: 'を', romanji: 'wo', examples: ['を (wo) - object particle', 'コーヒーを飲む (koohii wo nomu) - drink coffee'], category: 'w-sounds' },
  { character: 'ん', romanji: 'n', examples: ['ん (n) - n sound', 'ほん (hon) - book', 'せんせい (sensei) - teacher'], category: 'special' },
];

const categories = [
  { name: 'All', value: 'all' },
  { name: 'Vowels', value: 'vowels' },
  { name: 'K-sounds', value: 'k-sounds' },
  { name: 'S-sounds', value: 's-sounds' },
  { name: 'T-sounds', value: 't-sounds' },
  { name: 'N-sounds', value: 'n-sounds' },
  { name: 'H-sounds', value: 'h-sounds' },
  { name: 'M-sounds', value: 'm-sounds' },
  { name: 'Y-sounds', value: 'y-sounds' },
  { name: 'R-sounds', value: 'r-sounds' },
  { name: 'W-sounds', value: 'w-sounds' },
  { name: 'Special', value: 'special' },
];

export default function HiraganaPage() {
  const [selectedChar, setSelectedChar] = useState<HiraganaChar | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showQuiz, setShowQuiz] = useState(false);

  const filteredData = selectedCategory === 'all' 
    ? hiraganaData 
    : hiraganaData.filter(char => char.category === selectedCategory);

  const renderCharacterCard = ({ item }: { item: HiraganaChar }) => (
    <TouchableOpacity 
      style={[styles.card, selectedChar?.character === item.character && styles.selectedCard]} 
      onPress={() => setSelectedChar(item)}
    >
      <Text style={styles.character}>{item.character}</Text>
      <Text style={styles.romanji}>{item.romanji}</Text>
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
        <Text style={styles.title}>Hiragana Learning</Text>
        <Text style={styles.subtitle}>Master the Japanese syllabary</Text>
        <TouchableOpacity 
          style={styles.quizButton}
          onPress={() => setShowQuiz(true)}
        >
          <Text style={styles.quizButtonText}>Start Quiz</Text>
        </TouchableOpacity>
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
          numColumns={5}
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
              <Text style={styles.detailRomanji}>{selectedChar.romanji}</Text>
            </View>
            
            <View style={styles.examplesContainer}>
              <Text style={styles.examplesTitle}>Examples:</Text>
              {selectedChar.examples.map((example, index) => (
                <View key={index} style={styles.exampleItem}>
                  <Text style={styles.exampleText}>{example}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.practiceButton}
              onPress={() => {
                // Add practice functionality here
                console.log('Practice with:', selectedChar.character);
              }}
            >
              <Text style={styles.practiceButtonText}>Practice Writing</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      <InteractiveQuiz
        visible={showQuiz}
        onClose={() => setShowQuiz(false)}
        items={filteredData}
        title="Hiragana"
        type="hiragana"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  selectedCategory: {
    backgroundColor: '#3B82F6',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
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
    margin: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCard: {
    backgroundColor: '#3B82F6',
    elevation: 4,
    shadowOpacity: 0.2,
  },
  character: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  romanji: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
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
    maxHeight: '50%',
  },
  detailScroll: {
    padding: 20,
  },
  detailHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  detailCharacter: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  detailRomanji: {
    fontSize: 24,
    color: '#64748B',
    marginTop: 8,
  },
  examplesContainer: {
    marginBottom: 20,
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  exampleItem: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 16,
    color: '#334155',
  },
  practiceButton: {
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
  quizButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 8,
  },
  quizButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
