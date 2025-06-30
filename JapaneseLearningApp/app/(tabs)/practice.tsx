import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HiraganaLesson from '../../components/HiraganaLesson';

export default function PracticeScreen() {
  const [showHiragana, setShowHiragana] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Practice</Text>
      <Text style={styles.subtitle}>Choose a practice mode:</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.practiceButton} onPress={() => setShowHiragana(true)}>
          <Ionicons name="pencil" size={32} color="#6366F1" />
          <Text style={styles.buttonText}>Writing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.practiceButton}>
          <Ionicons name="mic" size={32} color="#EC4899" />
          <Text style={styles.buttonText}>Speaking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.practiceButton}>
          <Ionicons name="help-circle" size={32} color="#10B981" />
          <Text style={styles.buttonText}>Quiz</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.info}>More interactive practice coming soon!</Text>
      <HiraganaLesson visible={showHiragana} onClose={() => setShowHiragana(false)} />
    </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  practiceButton: {
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  info: {
    marginTop: 32,
    color: '#9CA3AF',
    fontSize: 14,
  },
});
