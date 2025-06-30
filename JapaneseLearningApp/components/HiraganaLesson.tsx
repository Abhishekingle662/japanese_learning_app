import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button } from 'react-native';

const HIRAGANA = [
  { char: 'あ', romaji: 'a', example: 'あさ (morning)' },
  { char: 'い', romaji: 'i', example: 'いえ (house)' },
  { char: 'う', romaji: 'u', example: 'うみ (sea)' },
  { char: 'え', romaji: 'e', example: 'えき (station)' },
  { char: 'お', romaji: 'o', example: 'おちゃ (tea)' },
];

export default function HiraganaLesson({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState<typeof HIRAGANA[0] | null>(null);

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Hiragana Lesson</Text>
        <FlatList
          data={HIRAGANA}
          keyExtractor={item => item.char}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => setSelected(item)}>
              <Text style={styles.char}>{item.char}</Text>
              <Text style={styles.romaji}>{item.romaji}</Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
        {selected && (
          <View style={styles.detail}>
            <Text style={styles.detailChar}>{selected.char}</Text>
            <Text style={styles.detailRomaji}>{selected.romaji}</Text>
            <Text style={styles.example}>{selected.example}</Text>
            <Button title="Practice Writing (Coming Soon)" onPress={() => {}} />
            <Button title="Close" onPress={() => setSelected(null)} />
          </View>
        )}
        <Button title="Back to Practice" onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
    elevation: 2,
  },
  char: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  romaji: {
    fontSize: 18,
    color: '#6B7280',
  },
  detail: {
    marginTop: 32,
    alignItems: 'center',
  },
  detailChar: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  detailRomaji: {
    fontSize: 24,
    color: '#6B7280',
    marginBottom: 8,
  },
  example: {
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
});
