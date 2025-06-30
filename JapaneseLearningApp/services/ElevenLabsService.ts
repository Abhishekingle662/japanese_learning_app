import { CONFIG } from '../config/config';

export class ElevenLabsService {
  private static instance: ElevenLabsService;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  private constructor() {
    console.log('ElevenLabs service initialized for React Native with REST API');
  }

  public static getInstance(): ElevenLabsService {
    if (!ElevenLabsService.instance) {
      ElevenLabsService.instance = new ElevenLabsService();
    }
    return ElevenLabsService.instance;
  }

  // Main TTS method for pronunciation practice
  async generateJapaneseSpeechUrl(text: string, voiceId?: string): Promise<string> {
    try {
      console.log(`Generating TTS for: "${text}"`);
      
      // Use a Japanese voice ID or the default one from config
      const selectedVoiceId = voiceId || CONFIG.ELEVENLABS_DEFAULT_VOICE_ID;
      
      const response = await fetch(`${this.baseUrl}/text-to-speech/${selectedVoiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': CONFIG.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.5, // Add style for more natural speech
            use_speaker_boost: true, // Enhance clarity
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // Convert response to blob and create URL
      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      console.log('TTS generated successfully, audio URL created');
      return url;
    } catch (error) {
      console.error('Error generating speech with ElevenLabs:', error);
      throw error;
    }
  }

  async generateJapaneseSpeech(text: string, voiceId?: string) {
    try {
      // Use a Japanese voice ID or the default one from config
      const selectedVoiceId = voiceId || CONFIG.ELEVENLABS_DEFAULT_VOICE_ID;
      
      const response = await fetch(`${this.baseUrl}/text-to-speech/${selectedVoiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': CONFIG.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error generating speech with ElevenLabs:', error);
      throw error;
    }
  }

  // Method to get available Japanese voices
  async getJapaneseVoices() {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': CONFIG.ELEVENLABS_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // Filter for Japanese voices or voices that support Japanese
      return data.voices?.filter((voice: any) => 
        voice.name?.toLowerCase().includes('japanese') ||
        voice.name?.toLowerCase().includes('jp') ||
        voice.labels?.language === 'ja'
      ) || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      return [];
    }
  }

  // Method for speech-to-speech (if available)
  async analyzePronunciation(audioBlob: Blob, targetText: string): Promise<any> {
    try {
      console.log('Analyzing pronunciation with ElevenLabs...');
      
      // For now, we'll implement basic analysis
      // In the future, this could integrate with ElevenLabs speech analysis or other services
      
      // TODO: Implement actual speech analysis when available
      // This could involve:
      // 1. Uploading the audio blob to ElevenLabs or another speech analysis service
      // 2. Getting back pronunciation accuracy, phoneme analysis, etc.
      // 3. Comparing against the target Japanese text
      
      // Mock analysis based on target text length and some randomization
      const baseAccuracy = Math.random() * 40 + 50; // 50-90% base
      const textComplexity = targetText.length > 5 ? 0.8 : 1.0; // Longer text is harder
      const finalAccuracy = Math.min(95, baseAccuracy * textComplexity);
      
      return {
        accuracy: finalAccuracy,
        suggestions: [
          'Practice the pronunciation of certain syllables',
          'Focus on the rhythm and timing',
          'Try to match the pitch accent patterns'
        ],
        confidence: Math.random() * 30 + 70, // 70-100%
        detectedText: `[Audio analysis for: ${targetText}]`,
        phonemeAnalysis: {
          correctPhonemes: Math.floor(targetText.length * (finalAccuracy / 100)),
          totalPhonemes: targetText.length,
          incorrectPhonemes: []
        }
      };
    } catch (error) {
      console.error('Error analyzing pronunciation:', error);
      throw error;
    }
  }

  // Method to upload and analyze audio file (for future use)
  async uploadAndAnalyzeAudio(audioBlob: Blob, targetText: string): Promise<any> {
    try {
      console.log('Uploading audio for analysis...');
      
      // This would be the actual implementation for sending audio to ElevenLabs
      // or another speech analysis service
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.m4a');
      formData.append('target_text', targetText);
      formData.append('language', 'ja-JP');
      
      // For now, we'll return the mock analysis
      return this.analyzePronunciation(audioBlob, targetText);
      
      /* Future implementation might look like:
      const response = await fetch(`${this.baseUrl}/speech-analysis`, {
        method: 'POST',
        headers: {
          'xi-api-key': CONFIG.ELEVENLABS_API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Error uploading and analyzing audio:', error);
      throw error;
    }
  }
}

export default ElevenLabsService;
