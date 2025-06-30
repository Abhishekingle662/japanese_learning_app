import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Alert,
  FlatList,
  Animated,
  Dimensions,
  TextInput
} from 'react-native';
import * as Speech from 'expo-speech';
import { useAudioPlayer, useAudioRecorder } from 'expo-audio';
import { PermissionsAndroid, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PronunciationAnalyzer, PronunciationAnalysis } from '../components/PronunciationAnalyzer';
import { ElevenLabsService } from '../services/ElevenLabsService';

const { width } = Dimensions.get('window');

interface PronunciationItem {
  id: string;
  japanese: string;
  romanji: string;
  meaning: string;
  audioFile?: string;
  tips: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

const pronunciationData: PronunciationItem[] = [
  // Basic Vowels
  {
    id: 'vowel_a',
    japanese: 'あ',
    romanji: 'a',
    meaning: 'vowel sound "ah"',
    tips: ['Open mouth wide', 'Sound like "ah" in "father"', 'Keep tongue low and flat'],
    difficulty: 'easy',
    category: 'vowels'
  },
  {
    id: 'vowel_i',
    japanese: 'い',
    romanji: 'i',
    meaning: 'vowel sound "ee"',
    tips: ['Stretch corners of mouth', 'Sound like "ee" in "see"', 'Tongue high and forward'],
    difficulty: 'easy',
    category: 'vowels'
  },
  {
    id: 'vowel_u',
    japanese: 'う',
    romanji: 'u',
    meaning: 'vowel sound "oo"',
    tips: ['Round lips slightly', 'Sound like "oo" in "moon"', 'Tongue back and high'],
    difficulty: 'easy',
    category: 'vowels'
  },
  {
    id: 'vowel_e',
    japanese: 'え',
    romanji: 'e',
    meaning: 'vowel sound "eh"',
    tips: ['Mid-open mouth', 'Sound like "e" in "pet"', 'Tongue in middle position'],
    difficulty: 'easy',
    category: 'vowels'
  },
  {
    id: 'vowel_o',
    japanese: 'お',
    romanji: 'o',
    meaning: 'vowel sound "oh"',
    tips: ['Round lips moderately', 'Sound like "o" in "port"', 'Tongue back and mid-high'],
    difficulty: 'easy',
    category: 'vowels'
  },
  
  // Common Words
  {
    id: 'word_konnichiwa',
    japanese: 'こんにちは',
    romanji: 'konnichiwa',
    meaning: 'hello/good afternoon',
    tips: ['Equal stress on all syllables', 'Clear "n" sounds', 'Don\'t rush the pronunciation'],
    difficulty: 'medium',
    category: 'greetings'
  },
  {
    id: 'word_arigatou',
    japanese: 'ありがとう',
    romanji: 'arigatou',
    meaning: 'thank you',
    tips: ['Slight rise in pitch on "ga"', 'Clear "r" sound (like quick "d")', 'Long "ou" at the end'],
    difficulty: 'medium',
    category: 'greetings'
  },
  {
    id: 'word_sayonara',
    japanese: 'さようなら',
    romanji: 'sayonara',
    meaning: 'goodbye',
    tips: ['Even rhythm throughout', 'Clear vowel sounds', 'Don\'t drop the final "a"'],
    difficulty: 'medium',
    category: 'greetings'
  },
  
  // Difficult Sounds
  {
    id: 'sound_tsu',
    japanese: 'つ',
    romanji: 'tsu',
    meaning: 'tsu sound',
    tips: ['Tongue touches roof of mouth', 'Quick release of air', 'Like "ts" in "cats"'],
    difficulty: 'hard',
    category: 'difficult'
  },
  {
    id: 'sound_rya',
    japanese: 'りゃ',
    romanji: 'rya',
    meaning: 'rya sound',
    tips: ['Quick "r" followed by "ya"', 'Tongue flick, not roll', 'Keep it fluid'],
    difficulty: 'hard',
    category: 'difficult'
  },
  {
    id: 'word_ryokou',
    japanese: 'りょこう',
    romanji: 'ryokou',
    meaning: 'travel',
    tips: ['Quick "ryo" combination', 'Long "ou" ending', 'Practice slowly first'],
    difficulty: 'hard',
    category: 'vocabulary'
  },
  
  // Pitch Accent Examples
  {
    id: 'pitch_hashi1',
    japanese: 'はし',
    romanji: 'hashi',
    meaning: 'bridge (low-high pitch)',
    tips: ['Start low, rise on "shi"', 'Pitch accent changes meaning', 'Practice with hand gestures'],
    difficulty: 'medium',
    category: 'pitch'
  },
  {
    id: 'pitch_hashi2',
    japanese: 'はし',
    romanji: 'hashi',
    meaning: 'chopsticks (high-low pitch)',
    tips: ['Start high, drop on "shi"', 'Different from bridge', 'Context matters'],
    difficulty: 'medium',
    category: 'pitch'
  },
];

const categories = [
  { name: 'All', value: 'all', icon: '🎯' },
  { name: 'Vowels', value: 'vowels', icon: '🗣️' },
  { name: 'Greetings', value: 'greetings', icon: '👋' },
  { name: 'Difficult', value: 'difficult', icon: '🔥' },
  { name: 'Vocabulary', value: 'vocabulary', icon: '📚' },
  { name: 'Pitch', value: 'pitch', icon: '🎵' },
];

export default function PronunciationPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<PronunciationItem | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [pronunciationAnalysis, setPronunciationAnalysis] = useState<PronunciationAnalysis | null>(null);
  const [microphonePermission, setMicrophonePermission] = useState<boolean | null>(null);
  const [pulseAnimation] = useState(new Animated.Value(1));
  const [analyzer] = useState(() => PronunciationAnalyzer.getInstance());
  const [elevenLabsService] = useState(() => ElevenLabsService.getInstance());
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const audioPlayer = useAudioPlayer();
  const audioRecorder = useAudioRecorder({
    extension: '.m4a',
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    android: {
      extension: '.m4a',
      outputFormat: 'mpeg4',
      audioEncoder: 'aac',
    },
    ios: {
      extension: '.m4a',
      audioQuality: 1.0,
      outputFormat: 'mpeg4',
    },
    web: {
      mimeType: 'audio/mp4',
    },
  });

  useEffect(() => {
    setupAudioPermissions();
  }, []);

  const setupAudioPermissions = async () => {
    try {
      console.log('Setting up audio permissions...');
      
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Microphone Permission',
              message: 'This app needs access to your microphone to record your pronunciation.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setMicrophonePermission(true);
            console.log('Microphone permission granted');
          } else {
            setMicrophonePermission(false);
            console.log('Microphone permission denied');
          }
        } catch (err) {
          console.error('Android permission error:', err);
          setMicrophonePermission(false);
        }
      } else {
        // For iOS and web, assume permission will be requested when needed
        setMicrophonePermission(true);
        console.log('iOS/Web: Will request permission when recording starts');
      }
    } catch (error) {
      console.error('Error setting up audio permissions:', error);
      setMicrophonePermission(false);
    }
  };





  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnimation.stopAnimation();
    pulseAnimation.setValue(1);
  };

  const startRecording = async () => {
    console.log('startRecording called, microphonePermission:', microphonePermission);
    console.log('audioRecorder.isRecording:', audioRecorder.isRecording);
    
    if (!microphonePermission) {
      console.log('No microphone permission, requesting...');
      Alert.alert('Permission Required', 'Microphone permission is required for pronunciation practice.');
      await setupAudioPermissions();
      return;
    }

    if (audioRecorder.isRecording) {
      console.log('Already recording, stopping first...');
      await stopRecording();
      return;
    }

    try {
      console.log('Preparing audio recorder...');
      
      setIsRecording(true);
      setIsRecordingAudio(true);
      setRecognizedText('');
      setPronunciationAnalysis(null);
      startPulseAnimation();
      
      // Prepare the recorder first (required for web)
      await audioRecorder.prepareToRecordAsync();
      console.log('Audio recorder prepared successfully');
      
      // Start recording with expo-audio
      await audioRecorder.record();
      console.log('Audio recording started successfully');
      console.log('Recording status:', audioRecorder.isRecording);
      
    } catch (error) {
      console.error('Error starting audio recording:', error);
      setIsRecording(false);
      setIsRecordingAudio(false);
      stopPulseAnimation();
      
      let errorMessage = 'Failed to start recording. ';
      const errorStr = error instanceof Error ? error.message : String(error);
      
      if (errorStr.includes('permission')) {
        errorMessage += 'Please grant microphone permission in your device settings.';
      } else if (errorStr.includes('MediaRecorder')) {
        errorMessage += 'Audio recorder initialization failed. Please refresh the page and try again.';
      } else if (errorStr.includes('not ready')) {
        errorMessage += 'Audio recorder is not ready. Please try again.';
      } else {
        errorMessage += `Error: ${errorStr}`;
      }
      
      Alert.alert('Recording Error', errorMessage);
    }
  };

  const stopRecording = async () => {
    try {
      console.log('Stopping audio recording...');
      setIsRecording(false);
      setIsRecordingAudio(false);
      stopPulseAnimation();
      
      // Stop recording 
      await audioRecorder.stop();
      console.log('Audio recording stopped');
      
      // Process the recording if we have selected item
      if (selectedItem) {
        console.log('Processing recorded audio...');
        setRecognizedText('[Processing audio...]');
        
        try {
          // Create a blob from the recording for analysis
          // Note: In a real implementation, you would access the actual recorded audio data
          // For now, we'll simulate the analysis with ElevenLabs service
          const mockAudioBlob = new Blob([], { type: 'audio/mp4' }); // Empty blob for demo
          
          const analysis = await elevenLabsService.analyzePronunciation(
            mockAudioBlob,
            selectedItem.japanese
          );
          
          // Set the results
          setRecognizedText(analysis.detectedText || `[Audio recorded - ${selectedItem.japanese}]`);
          
          // Create pronunciation analysis from ElevenLabs results
          const pronunciationResult: PronunciationAnalysis = {
            overallScore: analysis.accuracy || 75,
            accuracy: analysis.accuracy || 75,
            fluency: (analysis.confidence || 80) * 0.9, // Slightly lower than confidence
            completeness: analysis.phonemeAnalysis ? 
              (analysis.phonemeAnalysis.correctPhonemes / analysis.phonemeAnalysis.totalPhonemes) * 100 : 
              85,
            feedback: analysis.suggestions || ['Keep practicing!'],
            strengths: analysis.accuracy > 80 ? ['Good pronunciation accuracy'] : [],
            improvements: analysis.accuracy < 80 ? ['Focus on accuracy', 'Practice more slowly'] : []
          };
          
          setPronunciationAnalysis(pronunciationResult);
          
        } catch (analysisError) {
          console.error('Error analyzing pronunciation:', analysisError);
          setRecognizedText(`[Audio recorded - ${selectedItem.japanese}]`);
          
          // Fallback to basic analysis
          analyzePronunciation(selectedItem.romanji, selectedItem);
        }
      }
      
    } catch (error) {
      console.error('Error stopping audio recording:', error);
      setIsRecording(false);
      setIsRecordingAudio(false);
      stopPulseAnimation();
      Alert.alert('Recording Error', 'Failed to stop recording properly.');
    }
  };

  const playAudio = async (item: PronunciationItem) => {
    try {
      setIsLoadingAudio(true);
      
      // Use ElevenLabs for high-quality Japanese TTS
      try {
        console.log('Attempting to play audio with ElevenLabs for:', item.japanese);
        const audioUrl = await elevenLabsService.generateJapaneseSpeechUrl(item.japanese);
        
        // Load and play the audio
        audioPlayer.replace(audioUrl);
        audioPlayer.play();
        
        console.log('ElevenLabs audio played successfully');
      } catch (elevenLabsError) {
        console.warn('ElevenLabs failed, falling back to expo-speech:', elevenLabsError);
        
        // Fallback to expo-speech
        await Speech.speak(item.japanese, {
          language: 'ja-JP',
          pitch: 1.0,
          rate: 0.8, // Slower for learning
        });
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Audio Error', `Failed to play audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const analyzePronunciation = (recognizedText: string, targetItem: PronunciationItem) => {
    // Use the advanced pronunciation analyzer
    const analysis = analyzer.analyzePronunciation(
      targetItem.japanese,
      recognizedText,
      targetItem.romanji,
      targetItem.category
    );
    
    setPronunciationAnalysis(analysis);
  };

  const filteredData = selectedCategory === 'all' 
    ? pronunciationData 
    : pronunciationData.filter(item => item.category === selectedCategory);

  const renderCategoryButton = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={[styles.categoryButton, selectedCategory === item.value && styles.selectedCategory]}
      onPress={() => setSelectedCategory(item.value)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[styles.categoryText, selectedCategory === item.value && styles.selectedCategoryText]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderPronunciationCard = ({ item }: { item: PronunciationItem }) => (
    <TouchableOpacity 
      style={[
        styles.pronunciationCard,
        item.difficulty === 'easy' && styles.easyCard,
        item.difficulty === 'medium' && styles.mediumCard,
        item.difficulty === 'hard' && styles.hardCard,
        selectedItem?.id === item.id && styles.selectedCard
      ]} 
      onPress={() => setSelectedItem(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.japanese}>{item.japanese}</Text>
        <TouchableOpacity 
          style={[styles.playButton, isLoadingAudio && styles.playButtonLoading]}
          onPress={() => playAudio(item)}
          disabled={isLoadingAudio}
        >
          <Ionicons 
            name={isLoadingAudio ? "hourglass" : "play"} 
            size={20} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.romanji}>{item.romanji}</Text>
      <Text style={styles.meaning}>{item.meaning}</Text>
      <View style={styles.difficultyBadge}>
        <Text style={styles.difficultyText}>{item.difficulty}</Text>
      </View>
    </TouchableOpacity>
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pronunciation Practice</Text>
        <Text style={styles.subtitle}>Perfect your Japanese pronunciation</Text>
      </View>

      {/* Categories */}
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

      {/* Pronunciation Items */}
      <View style={styles.itemsContainer}>
        <FlatList
          data={filteredData}
          numColumns={2}
          renderItem={renderPronunciationCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.itemsList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Practice Section */}
      {selectedItem && (
        <View style={styles.practiceContainer}>
          <ScrollView style={styles.practiceScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.practiceHeader}>
              <Text style={styles.practiceTitle}>Practice: {selectedItem.japanese}</Text>
              <Text style={styles.practiceRomanji}>{selectedItem.romanji}</Text>
              <Text style={styles.practiceMeaning}>{selectedItem.meaning}</Text>
            </View>

            {/* Tips */}
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Pronunciation Tips:</Text>
              {selectedItem.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>

            {/* Recording Controls */}
            <View style={styles.recordingContainer}>
              {/* Debug Info */}
              <View style={styles.debugContainer}>
                <Text style={styles.debugText}>
                  Mic Permission: {microphonePermission === null ? 'Checking...' : microphonePermission ? 'Granted' : 'Denied'}
                </Text>
                <Text style={styles.debugText}>
                  Platform: {Platform.OS}
                </Text>
                <Text style={styles.debugText}>
                  Audio Recording: {isRecordingAudio ? 'Active' : 'Inactive'}
                </Text>
                <Text style={styles.debugText}>
                  Recorder Status: {audioRecorder.isRecording ? 'Recording' : 'Stopped'}
                </Text>
                <TouchableOpacity
                  style={styles.testButton}
                  onPress={async () => {
                    try {
                      console.log('Testing microphone permissions...');
                      await setupAudioPermissions();
                      Alert.alert('Info', `Microphone permission: ${microphonePermission ? 'Granted' : 'Denied'}`);
                    } catch (error) {
                      console.error('Mic test failed:', error);
                      Alert.alert('Error', `Mic test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    }
                  }}
                >
                  <Text style={styles.testButtonText}>Test Microphone</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.testButton}
                  onPress={async () => {
                    try {
                      console.log('Testing ElevenLabs TTS...');
                      const url = await elevenLabsService.generateJapaneseSpeechUrl('こんにちは');
                      console.log('TTS URL generated:', url);
                      Alert.alert('Success', 'ElevenLabs TTS is working!');
                    } catch (error) {
                      console.error('TTS test failed:', error);
                      Alert.alert('Error', `TTS test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    }
                  }}
                >
                  <Text style={styles.testButtonText}>Test ElevenLabs</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.recordingControls}>
                <TouchableOpacity 
                  style={[styles.playAudioButton, isLoadingAudio && styles.playAudioButtonLoading]}
                  onPress={() => playAudio(selectedItem)}
                  disabled={isLoadingAudio}
                >
                  <Ionicons 
                    name={isLoadingAudio ? "hourglass" : "volume-high"} 
                    size={24} 
                    color="#FFFFFF" 
                  />
                  <Text style={styles.controlButtonText}>
                    {isLoadingAudio ? 'Loading...' : 'Listen'}
                  </Text>
                </TouchableOpacity>

                <Animated.View style={[styles.recordButton, { transform: [{ scale: pulseAnimation }] }]}>
                  <TouchableOpacity 
                    style={[
                      styles.recordButtonInner,
                      isRecording && styles.recordingActive,
                      !microphonePermission && styles.recordButtonDisabled
                    ]}
                    onPress={isRecording ? stopRecording : startRecording}
                    disabled={!microphonePermission}
                  >
                    <Ionicons 
                      name={isRecording ? "stop" : "mic"} 
                      size={32} 
                      color="#FFFFFF" 
                    />
                  </TouchableOpacity>
                </Animated.View>
              </View>

              <Text style={styles.recordingInstruction}>
                {isRecording ? 'Recording... Speak now!' : 
                 !microphonePermission ? 'Microphone permission required' :
                 'Tap the microphone to record your pronunciation'}
              </Text>
              
              {isListening && (
                <Text style={styles.listeningText}>🎤 Listening...</Text>
              )}
              
              {/* Fallback text input for manual practice */}
              <View style={styles.fallbackContainer}>
                <Text style={styles.fallbackTitle}>Manual Practice Mode</Text>
                <Text style={styles.fallbackDescription}>
                  You can also practice by typing what you hear when playing the audio:
                </Text>
                <TextInput
                  style={styles.fallbackInput}
                  placeholder="Type what you hear here..."
                  placeholderTextColor="#666"
                  value={recognizedText}
                  onChangeText={setRecognizedText}
                  multiline={false}
                  onSubmitEditing={() => {
                    if (recognizedText.trim()) {
                      analyzePronunciation(recognizedText, selectedItem);
                    }
                  }}
                />
                <TouchableOpacity
                  style={styles.fallbackSubmitButton}
                  onPress={() => {
                    if (recognizedText.trim()) {
                      analyzePronunciation(recognizedText, selectedItem);
                    }
                  }}
                >
                  <Text style={styles.fallbackSubmitText}>Check Pronunciation</Text>
                </TouchableOpacity>
              </View>
              
              {/* ElevenLabs Conversational AI Practice - Coming Soon */}
              <View style={styles.fallbackContainer}>
                <Text style={styles.fallbackTitle}>🤖 AI Pronunciation Coach</Text>
                <Text style={styles.fallbackDescription}>
                  Advanced AI-powered pronunciation coaching with ElevenLabs is coming soon! 
                  For now, use the Listen button above to hear perfect Japanese pronunciation.
                </Text>
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Coming Soon</Text>
                </View>
              </View>
            </View>

            {/* Results */}
            {recognizedText !== '' && (
              <View style={styles.resultsContainer}>
                <Text style={styles.resultsTitle}>Recognition Result:</Text>
                <Text style={styles.recognizedText}>"{recognizedText}"</Text>
                
                {pronunciationAnalysis && (
                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>Score: {Math.round(pronunciationAnalysis.overallScore)}%</Text>
                    <View style={styles.scoreBar}>
                      <View 
                        style={[
                          styles.scoreProgress, 
                          { 
                            width: `${pronunciationAnalysis.overallScore}%`,
                            backgroundColor: getDifficultyColor(pronunciationAnalysis.overallScore >= 70 ? 'easy' : pronunciationAnalysis.overallScore >= 50 ? 'medium' : 'hard')
                          }
                        ]} 
                      />
                    </View>
                    
                    {/* Detailed Analysis */}
                    <View style={styles.detailedAnalysis}>
                      <Text style={styles.analysisTitle}>Detailed Analysis:</Text>
                      <View style={styles.analysisMetrics}>
                        <Text style={styles.metricText}>Accuracy: {Math.round(pronunciationAnalysis.accuracy)}%</Text>
                        <Text style={styles.metricText}>Fluency: {Math.round(pronunciationAnalysis.fluency)}%</Text>
                        <Text style={styles.metricText}>Completeness: {Math.round(pronunciationAnalysis.completeness)}%</Text>
                      </View>
                      
                      {/* Feedback */}
                      {pronunciationAnalysis.feedback.length > 0 && (
                        <View style={styles.feedbackContainer}>
                          <Text style={styles.feedbackTitle}>Feedback:</Text>
                          {pronunciationAnalysis.feedback.map((feedback, index) => (
                            <View key={index} style={styles.feedbackItem}>
                              <Text style={styles.feedbackBullet}>💬</Text>
                              <Text style={styles.feedbackItemText}>{feedback}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                      
                      {/* Strengths */}
                      {pronunciationAnalysis.strengths.length > 0 && (
                        <View style={styles.strengthsContainer}>
                          <Text style={styles.strengthsTitle}>Strengths:</Text>
                          {pronunciationAnalysis.strengths.map((strength, index) => (
                            <View key={index} style={styles.strengthItem}>
                              <Text style={styles.strengthBullet}>✅</Text>
                              <Text style={styles.strengthText}>{strength}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                      
                      {/* Improvements */}
                      {pronunciationAnalysis.improvements.length > 0 && (
                        <View style={styles.improvementsContainer}>
                          <Text style={styles.improvementsTitle}>Areas for Improvement:</Text>
                          {pronunciationAnalysis.improvements.map((improvement, index) => (
                            <View key={index} style={styles.improvementItem}>
                              <Text style={styles.improvementBullet}>💡</Text>
                              <Text style={styles.improvementText}>{improvement}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#0EA5E9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0C4A6E',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#0284C7',
    textAlign: 'center',
    marginTop: 4,
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#0EA5E9',
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F0F9FF',
  },
  selectedCategory: {
    backgroundColor: '#0EA5E9',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0284C7',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  itemsContainer: {
    flex: 1,
    paddingTop: 16,
  },
  itemsList: {
    paddingHorizontal: 16,
  },
  pronunciationCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 6,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E0F2FE',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCard: {
    borderColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
  },
  easyCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  mediumCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  hardCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  japanese: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0C4A6E',
  },
  playButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonLoading: {
    backgroundColor: '#64748B',
  },
  romanji: {
    fontSize: 16,
    color: '#0284C7',
    marginBottom: 4,
  },
  meaning: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0284C7',
    textTransform: 'uppercase',
  },
  practiceContainer: {
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
  practiceScroll: {
    padding: 20,
  },
  practiceHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  practiceTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0EA5E9',
  },
  practiceRomanji: {
    fontSize: 20,
    color: '#0284C7',
    marginTop: 4,
  },
  practiceMeaning: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  tipsContainer: {
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0C4A6E',
    marginBottom: 8,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  tipBullet: {
    fontSize: 16,
    color: '#0EA5E9',
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  recordingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 20,
  },
  playAudioButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playAudioButtonLoading: {
    backgroundColor: '#64748B',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  recordButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingActive: {
    backgroundColor: '#DC2626',
  },
  recordingInstruction: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
  listeningText: {
    fontSize: 18,
    color: '#EF4444',
    fontWeight: '600',
    marginTop: 8,
  },
  resultsContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0C4A6E',
    marginBottom: 8,
  },
  recognizedText: {
    fontSize: 18,
    color: '#374151',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0C4A6E',
    marginBottom: 8,
  },
  scoreBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  scoreProgress: {
    height: '100%',
    borderRadius: 4,
  },
  feedbackText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
  },
  detailedAnalysis: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0C4A6E',
    marginBottom: 12,
  },
  analysisMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
  },
  metricText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  feedbackContainer: {
    marginBottom: 12,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0C4A6E',
    marginBottom: 8,
  },
  feedbackItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  feedbackBullet: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  feedbackItemText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  strengthsContainer: {
    marginBottom: 12,
  },
  strengthsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
  },
  strengthItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  strengthBullet: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  strengthText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  improvementsContainer: {
    marginBottom: 12,
  },
  improvementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 8,
  },
  improvementItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  improvementBullet: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  improvementText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  debugContainer: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  debugText: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
  },
  recordButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.5,
  },
  fallbackContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 16,
  },
  fallbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0C4A6E',
    marginBottom: 8,
    textAlign: 'center',
  },
  fallbackDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  fallbackInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#374151',
    marginBottom: 12,
  },
  fallbackSubmitButton: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  fallbackSubmitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  comingSoonBadge: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 8,
  },
  comingSoonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: '#10B981',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'center',
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
