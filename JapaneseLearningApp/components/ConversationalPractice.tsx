import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useConversation } from '@elevenlabs/react';
import { Ionicons } from '@expo/vector-icons';
import { CONFIG } from '../config/config';

interface ConversationalPracticeProps {
  targetText: string;
  onAnalysisComplete?: (analysis: any) => void;
}

export default function ConversationalPractice({ 
  targetText, 
  onAnalysisComplete 
}: ConversationalPracticeProps) {
  const [isInitializing, setIsInitializing] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>('');

  // Initialize the conversation hook
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs Conversational AI');
      setIsInitializing(false);
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs Conversational AI');
      setIsInitializing(false);
    },
    onMessage: (message) => {
      console.log('Received message:', message);
      setLastMessage(message.message || '');
      
      // If this is a response from the agent, pass it to parent
      if (onAnalysisComplete && message.source === 'ai') {
        onAnalysisComplete({
          feedback: message.message,
          timestamp: Date.now(),
        });
      }
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      Alert.alert('Error', 'Failed to connect to pronunciation coach. Please try again.');
      setIsInitializing(false);
    },
  });

  const startPronunciationSession = useCallback(async () => {
    try {
      setIsInitializing(true);
      
      // Request microphone permission first
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (micError) {
        throw new Error('Microphone access is required for pronunciation practice');
      }

      // For now, use a direct agent ID approach (public agent)
      // In production, you would generate signed URLs on your server
      const conversationId = await conversation.startSession({ 
        agentId: CONFIG.ELEVENLABS_AGENT_ID 
      });
      
      console.log('Started conversation with ID:', conversationId);
      
      // Set volume to comfortable level
      await conversation.setVolume({ volume: 0.7 });
      
    } catch (error) {
      console.error('Error starting pronunciation session:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to start pronunciation session');
      setIsInitializing(false);
    }
  }, [conversation, targetText]);

  const endPronunciationSession = useCallback(async () => {
    try {
      await conversation.endSession();
      console.log('Ended pronunciation session');
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }, [conversation]);

  const isConnected = conversation.status === 'connected';
  const isSpeaking = conversation.isSpeaking;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Pronunciation Coach</Text>
      <Text style={styles.subtitle}>
        Practice saying: "{targetText}"
      </Text>
      
      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, isConnected && styles.connected]} />
        <Text style={styles.statusText}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Text>
        {isSpeaking && (
          <Text style={styles.speakingIndicator}>🎤 AI is speaking...</Text>
        )}
      </View>

      <View style={styles.controls}>
        {!isConnected ? (
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={startPronunciationSession}
            disabled={isInitializing}
          >
            <Ionicons 
              name={isInitializing ? "hourglass" : "mic"} 
              size={24} 
              color="#FFFFFF" 
            />
            <Text style={styles.buttonText}>
              {isInitializing ? 'Connecting...' : 'Start AI Practice'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.endButton]}
            onPress={endPronunciationSession}
          >
            <Ionicons name="stop" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>End Session</Text>
          </TouchableOpacity>
        )}
      </View>

      {lastMessage && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackTitle}>AI Feedback:</Text>
          <Text style={styles.feedbackText}>{lastMessage}</Text>
        </View>
      )}

      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>How it works:</Text>
        <Text style={styles.instructionText}>
          • Click "Start AI Practice" to begin{'\n'}
          • Say the Japanese text when prompted{'\n'}
          • The AI will provide real-time feedback{'\n'}
          • Practice until you get it right!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0C4A6E',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#0284C7',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  connected: {
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 14,
    color: '#64748B',
    marginRight: 12,
  },
  speakingIndicator: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  controls: {
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  startButton: {
    backgroundColor: '#0EA5E9',
  },
  endButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  feedbackContainer: {
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0C4A6E',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  instructions: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
  },
});
