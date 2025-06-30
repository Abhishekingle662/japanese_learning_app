import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

interface KatakanaChar {
  character: string;
  romanji: string;
  examples: string[];
  category: string;
}

const katakanaData: KatakanaChar[] = [
  // Vowels
  { character: 'ア', romanji: 'a', examples: ['アメリカ (Amerika) - America', 'アイス (aisu) - ice cream', 'アニメ (anime) - animation'], category: 'vowels' },
  { character: 'イ', romanji: 'i', examples: ['イタリア (Itaria) - Italy', 'インド (Indo) - India', 'イヤホン (iyahon) - earphones'], category: 'vowels' },
  { character: 'ウ', romanji: 'u', examples: ['ウイスキー (uisukii) - whiskey', 'ウール (uuru) - wool', 'ウェブ (uebu) - web'], category: 'vowels' },
  { character: 'エ', romanji: 'e', examples: ['エアコン (eakon) - air conditioner', 'エンジン (enjin) - engine', 'エレベーター (erebeetaa) - elevator'], category: 'vowels' },
  { character: 'オ', romanji: 'o', examples: ['オレンジ (orenji) - orange', 'オフィス (ofisu) - office', 'オーストラリア (Oosutoraria) - Australia'], category: 'vowels' },
  
  // K-sounds
  { character: 'カ', romanji: 'ka', examples: ['カメラ (kamera) - camera', 'カフェ (kafe) - cafe', 'カレー (karee) - curry'], category: 'k-sounds' },
  { character: 'キ', romanji: 'ki', examples: ['キッチン (kicchin) - kitchen', 'キス (kisu) - kiss', 'キャンプ (kyanpu) - camp'], category: 'k-sounds' },
  { character: 'ク', romanji: 'ku', examples: ['クラス (kurasu) - class', 'クリーム (kuriimu) - cream', 'クッキー (kukkii) - cookie'], category: 'k-sounds' },
  { character: 'ケ', romanji: 'ke', examples: ['ケーキ (keeki) - cake', 'ケース (keesu) - case', 'ケチャップ (kechappu) - ketchup'], category: 'k-sounds' },
  { character: 'コ', romanji: 'ko', examples: ['コーヒー (koohii) - coffee', 'コンピュータ (konpyuuta) - computer', 'コピー (kopii) - copy'], category: 'k-sounds' },
  
  // S-sounds
  { character: 'サ', romanji: 'sa', examples: ['サラダ (sarada) - salad', 'サッカー (sakkaa) - soccer', 'サンドイッチ (sandoicchi) - sandwich'], category: 's-sounds' },
  { character: 'シ', romanji: 'shi', examples: ['シャツ (shatsu) - shirt', 'システム (shisutemu) - system', 'ショッピング (shoppingu) - shopping'], category: 's-sounds' },
  { character: 'ス', romanji: 'su', examples: ['スープ (suupu) - soup', 'スポーツ (supootsu) - sports', 'ストレス (sutoresu) - stress'], category: 's-sounds' },
  { character: 'セ', romanji: 'se', examples: ['セーター (seetaa) - sweater', 'センター (sentaa) - center', 'セット (setto) - set'], category: 's-sounds' },
  { character: 'ソ', romanji: 'so', examples: ['ソース (soosu) - sauce', 'ソファ (sofa) - sofa', 'ソフト (sofuto) - soft'], category: 's-sounds' },
  
  // T-sounds
  { character: 'タ', romanji: 'ta', examples: ['タクシー (takushii) - taxi', 'タイヤ (taiya) - tire', 'タオル (taoru) - towel'], category: 't-sounds' },
  { character: 'チ', romanji: 'chi', examples: ['チーズ (chiizu) - cheese', 'チーム (chiimu) - team', 'チケット (chiketto) - ticket'], category: 't-sounds' },
  { character: 'ツ', romanji: 'tsu', examples: ['ツアー (tsuaa) - tour', 'ツール (tsuuru) - tool', 'ツイッター (tsuittaa) - Twitter'], category: 't-sounds' },
  { character: 'テ', romanji: 'te', examples: ['テスト (tesuto) - test', 'テレビ (terebi) - television', 'テーブル (teeburu) - table'], category: 't-sounds' },
  { character: 'ト', romanji: 'to', examples: ['トマト (tomato) - tomato', 'トイレ (toire) - toilet', 'トンネル (tonneru) - tunnel'], category: 't-sounds' },
  
  // N-sounds
  { character: 'ナ', romanji: 'na', examples: ['ナイフ (naifu) - knife', 'ナプキン (napukin) - napkin', 'ナビゲーション (nabigeshon) - navigation'], category: 'n-sounds' },
  { character: 'ニ', romanji: 'ni', examples: ['ニュース (nyuusu) - news', 'ニット (nitto) - knit', 'ニューヨーク (nyuuyooku) - New York'], category: 'n-sounds' },
  { character: 'ヌ', romanji: 'nu', examples: ['ヌードル (nuudoru) - noodle', 'ヌーディスト (nuudisuto) - nudist'], category: 'n-sounds' },
  { character: 'ネ', romanji: 'ne', examples: ['ネット (netto) - net/internet', 'ネクタイ (nekutai) - necktie', 'ネコ (neko) - cat (loan)'], category: 'n-sounds' },
  { character: 'ノ', romanji: 'no', examples: ['ノート (nooto) - notebook', 'ノーマル (noomaru) - normal', 'ノック (nokku) - knock'], category: 'n-sounds' },
  
  // H-sounds
  { character: 'ハ', romanji: 'ha', examples: ['ハンバーガー (hanbaagaa) - hamburger', 'ハロウィン (harowin) - Halloween', 'ハート (haato) - heart'], category: 'h-sounds' },
  { character: 'ヒ', romanji: 'hi', examples: ['ヒーター (hiitaa) - heater', 'ヒント (hinto) - hint', 'ヒーロー (hiiroo) - hero'], category: 'h-sounds' },
  { character: 'フ', romanji: 'fu', examples: ['フォーク (fooku) - fork', 'フライ (furai) - fry', 'フルーツ (furuutsu) - fruit'], category: 'h-sounds' },
  { character: 'ヘ', romanji: 'he', examples: ['ヘルメット (herumetto) - helmet', 'ヘッドホン (heddohon) - headphones', 'ヘリコプター (herikoputaa) - helicopter'], category: 'h-sounds' },
  { character: 'ホ', romanji: 'ho', examples: ['ホテル (hoteru) - hotel', 'ホット (hotto) - hot', 'ホーム (hoomu) - home/platform'], category: 'h-sounds' },
  
  // M-sounds
  { character: 'マ', romanji: 'ma', examples: ['マーケット (maaketto) - market', 'マウス (mausu) - mouse', 'マンション (manshon) - apartment'], category: 'm-sounds' },
  { character: 'ミ', romanji: 'mi', examples: ['ミルク (miruku) - milk', 'ミーティング (miitingu) - meeting', 'ミュージック (myuujikku) - music'], category: 'm-sounds' },
  { character: 'ム', romanji: 'mu', examples: ['ムービー (muubii) - movie', 'ムード (muudo) - mood'], category: 'm-sounds' },
  { character: 'メ', romanji: 'me', examples: ['メール (meeru) - email', 'メニュー (menyuu) - menu', 'メガネ (megane) - glasses'], category: 'm-sounds' },
  { character: 'モ', romanji: 'mo', examples: ['モデル (moderu) - model', 'モーター (mootaa) - motor', 'モンスター (monsutaa) - monster'], category: 'm-sounds' },
  
  // Y-sounds
  { character: 'ヤ', romanji: 'ya', examples: ['ヤード (yaado) - yard', 'ヨガ (yoga) - yoga'], category: 'y-sounds' },
  { character: 'ユ', romanji: 'yu', examples: ['ユニフォーム (yunifoumu) - uniform', 'ユーザー (yuuzaa) - user', 'ユーモア (yuumoa) - humor'], category: 'y-sounds' },
  { character: 'ヨ', romanji: 'yo', examples: ['ヨーロッパ (yooroppa) - Europe', 'ヨット (yotto) - yacht', 'ヨーグルト (yooguruto) - yogurt'], category: 'y-sounds' },
  
  // R-sounds
  { character: 'ラ', romanji: 'ra', examples: ['ラジオ (rajio) - radio', 'ランプ (ranpu) - lamp', 'ライス (raisu) - rice'], category: 'r-sounds' },
  { character: 'リ', romanji: 'ri', examples: ['リスト (risuto) - list', 'リモコン (rimokon) - remote control', 'リンク (rinku) - link'], category: 'r-sounds' },
  { character: 'ル', romanji: 'ru', examples: ['ルール (ruuru) - rule', 'ルーム (ruumu) - room'], category: 'r-sounds' },
  { character: 'レ', romanji: 're', examples: ['レストラン (resutoran) - restaurant', 'レモン (remon) - lemon', 'レベル (reberu) - level'], category: 'r-sounds' },
  { character: 'ロ', romanji: 'ro', examples: ['ロボット (robotto) - robot', 'ロック (rokku) - rock', 'ロビー (robii) - lobby'], category: 'r-sounds' },
  
  // W-sounds
  { character: 'ワ', romanji: 'wa', examples: ['ワイン (wain) - wine', 'ワード (waado) - word', 'ワンピース (wanpiisu) - dress'], category: 'w-sounds' },
  { character: 'ヲ', romanji: 'wo', examples: ['ヲ (wo) - object particle (rarely used in katakana)'], category: 'w-sounds' },
  { character: 'ン', romanji: 'n', examples: ['ン (n) - n sound', 'パン (pan) - bread', 'アンテナ (antena) - antenna'], category: 'special' },
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

export default function KatakanaPage() {
  const [selectedChar, setSelectedChar] = useState<KatakanaChar | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredData = selectedCategory === 'all' 
    ? katakanaData 
    : katakanaData.filter(char => char.category === selectedCategory);

  const renderCharacterCard = ({ item }: { item: KatakanaChar }) => (
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
        <Text style={styles.title}>Katakana Learning</Text>
        <Text style={styles.subtitle}>Master foreign words in Japanese</Text>
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
              <Text style={styles.examplesTitle}>Foreign Words:</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF3E2',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F59E0B',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#92400E',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#D97706',
    textAlign: 'center',
    marginTop: 4,
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F59E0B',
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#FEF3E2',
  },
  selectedCategory: {
    backgroundColor: '#F59E0B',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#D97706',
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
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  selectedCard: {
    backgroundColor: '#F59E0B',
    elevation: 4,
    shadowOpacity: 0.2,
  },
  character: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#92400E',
  },
  romanji: {
    fontSize: 12,
    color: '#D97706',
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
    color: '#F59E0B',
  },
  detailRomanji: {
    fontSize: 24,
    color: '#D97706',
    marginTop: 8,
  },
  examplesContainer: {
    marginBottom: 20,
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 12,
  },
  exampleItem: {
    backgroundColor: '#FEF3E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  exampleText: {
    fontSize: 16,
    color: '#92400E',
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
});
