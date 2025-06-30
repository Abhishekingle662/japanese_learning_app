// Note: This analyzer doesn't actually use Audio directly
// The audio functionality is handled in the main pronunciation component

export interface PronunciationAnalysis {
  overallScore: number;
  accuracy: number;
  fluency: number;
  completeness: number;
  feedback: string[];
  strengths: string[];
  improvements: string[];
}

export interface JapanesePhonemeDifficulty {
  [key: string]: {
    difficulty: 'easy' | 'medium' | 'hard';
    commonMistakes: string[];
    tips: string[];
  };
}

export const japanesePhonemeDifficulty: JapanesePhonemeDifficulty = {
  'tsu': {
    difficulty: 'hard',
    commonMistakes: ['pronounced as "su"', 'too much "t" sound', 'missing aspiration'],
    tips: ['Touch tongue to roof of mouth', 'Quick release of air', 'Like "ts" in "cats"']
  },
  'r': {
    difficulty: 'hard',
    commonMistakes: ['English "r" sound', 'too rolled', 'too harsh'],
    tips: ['Quick tongue flick', 'Between "r" and "l"', 'Light touch to roof']
  },
  'rya': {
    difficulty: 'hard',
    commonMistakes: ['separated "r-ya"', 'too slow', 'wrong tongue position'],
    tips: ['Fluid combination', 'Quick transition', 'Practice slowly first']
  },
  'ryu': {
    difficulty: 'hard',
    commonMistakes: ['separated sounds', 'English "r"', 'too rounded "u"'],
    tips: ['Smooth combination', 'Light "r" sound', 'Compressed "yu"']
  },
  'ryo': {
    difficulty: 'hard',
    commonMistakes: ['separated sounds', 'wrong pitch', 'too long'],
    tips: ['Quick combination', 'Even pitch', 'Fluid motion']
  },
  'n': {
    difficulty: 'medium',
    commonMistakes: ['not nasal enough', 'too short', 'wrong placement'],
    tips: ['Nasal sound', 'Longer duration', 'Mouth closed']
  },
  'long_vowels': {
    difficulty: 'medium',
    commonMistakes: ['too short', 'pitch change', 'wrong quality'],
    tips: ['Hold twice as long', 'Keep same pitch', 'Don\'t diphthongize']
  },
  'pitch_accent': {
    difficulty: 'hard',
    commonMistakes: ['wrong pitch pattern', 'English stress', 'flat intonation'],
    tips: ['Learn pitch patterns', 'Practice with hand gestures', 'Listen to natives']
  }
};

export class PronunciationAnalyzer {
  private static instance: PronunciationAnalyzer;
  
  public static getInstance(): PronunciationAnalyzer {
    if (!PronunciationAnalyzer.instance) {
      PronunciationAnalyzer.instance = new PronunciationAnalyzer();
    }
    return PronunciationAnalyzer.instance;
  }

  /**
   * Analyze pronunciation accuracy based on target and recognized text
   */
  public analyzePronunciation(
    target: string, 
    recognized: string, 
    romanji: string,
    category: string
  ): PronunciationAnalysis {
    const normalizedTarget = this.normalizeText(target);
    const normalizedRecognized = this.normalizeText(recognized);
    const normalizedRomanji = this.normalizeText(romanji);

    // Calculate different scoring metrics
    const accuracy = this.calculateAccuracy(normalizedTarget, normalizedRecognized, normalizedRomanji);
    const fluency = this.calculateFluency(normalizedTarget, normalizedRecognized);
    const completeness = this.calculateCompleteness(normalizedTarget, normalizedRecognized);
    
    const overallScore = Math.round((accuracy * 0.5 + fluency * 0.3 + completeness * 0.2));

    // Generate detailed feedback
    const feedback = this.generateFeedback(
      normalizedTarget, 
      normalizedRecognized, 
      normalizedRomanji,
      category,
      { accuracy, fluency, completeness, overallScore }
    );

    const strengths = this.identifyStrengths(normalizedTarget, normalizedRecognized, overallScore);
    const improvements = this.suggestImprovements(
      normalizedTarget, 
      normalizedRecognized, 
      normalizedRomanji,
      category
    );

    return {
      overallScore,
      accuracy,
      fluency,
      completeness,
      feedback,
      strengths,
      improvements
    };
  }

  private normalizeText(text: string): string {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '')
      .trim();
  }

  private calculateAccuracy(target: string, recognized: string, romanji: string): number {
    if (!target || !recognized) return 0;

    // Use Levenshtein distance for similarity
    const targetLength = Math.max(target.length, romanji.length);
    const recognizedLength = recognized.length;
    
    if (targetLength === 0) return 100;

    // Calculate similarity with both Japanese and romanji
    const japaneseSimilarity = this.calculateSimilarity(target, recognized);
    const romanjiSimilarity = this.calculateSimilarity(romanji, recognized);
    
    // Use the better of the two similarities
    const bestSimilarity = Math.max(japaneseSimilarity, romanjiSimilarity);
    
    return Math.round(bestSimilarity * 100);
  }

  private calculateFluency(target: string, recognized: string): number {
    if (!target || !recognized) return 0;

    // Fluency based on length similarity and continuous recognition
    const lengthRatio = Math.min(recognized.length, target.length) / Math.max(recognized.length, target.length);
    const hasBreaks = recognized.includes(' ') ? 0.8 : 1.0; // Penalize breaks in single words
    
    return Math.round(lengthRatio * hasBreaks * 100);
  }

  private calculateCompleteness(target: string, recognized: string): number {
    if (!target) return 100;
    if (!recognized) return 0;

    // How much of the target was captured
    const targetLength = target.length;
    const recognizedLength = Math.min(recognized.length, targetLength);
    
    return Math.round((recognizedLength / targetLength) * 100);
  }

  private calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1;
    if (str1.length === 0 || str2.length === 0) return 0;

    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;

    // Create matrix
    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }

    // Fill matrix
    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const maxLength = Math.max(len1, len2);
    const similarity = (maxLength - matrix[len2][len1]) / maxLength;
    return Math.max(0, similarity);
  }

  private generateFeedback(
    target: string,
    recognized: string,
    romanji: string,
    category: string,
    scores: { accuracy: number; fluency: number; completeness: number; overallScore: number }
  ): string[] {
    const feedback: string[] = [];

    // Overall performance feedback
    if (scores.overallScore >= 90) {
      feedback.push('🎉 Excellent pronunciation! You sound very natural.');
    } else if (scores.overallScore >= 80) {
      feedback.push('👍 Great job! Your pronunciation is quite good.');
    } else if (scores.overallScore >= 70) {
      feedback.push('👌 Good effort! You\'re making progress.');
    } else if (scores.overallScore >= 60) {
      feedback.push('💪 Keep practicing! You\'re getting better.');
    } else {
      feedback.push('📚 Don\'t give up! Listen to the audio again and try slower.');
    }

    // Specific feedback based on category
    if (category === 'vowels') {
      if (scores.accuracy < 80) {
        feedback.push('Focus on mouth shape - Japanese vowels are very pure sounds.');
      }
    } else if (category === 'difficult') {
      if (scores.accuracy < 70) {
        feedback.push('These are challenging sounds! Break them down slowly.');
      }
    } else if (category === 'pitch') {
      if (scores.fluency < 70) {
        feedback.push('Remember pitch accent - try using hand gestures to help.');
      }
    }

    // Completeness feedback
    if (scores.completeness < 80) {
      feedback.push('Try to pronounce the complete word - don\'t skip sounds.');
    }

    return feedback;
  }

  private identifyStrengths(target: string, recognized: string, overallScore: number): string[] {
    const strengths: string[] = [];

    if (overallScore >= 80) {
      strengths.push('Clear pronunciation');
    }
    if (recognized.length >= target.length * 0.8) {
      strengths.push('Good completeness');
    }
    if (this.calculateSimilarity(target, recognized) > 0.8) {
      strengths.push('Accurate sound production');
    }

    if (strengths.length === 0) {
      strengths.push('Good effort - keep practicing!');
    }

    return strengths;
  }

  private suggestImprovements(
    target: string,
    recognized: string,
    romanji: string,
    category: string
  ): string[] {
    const improvements: string[] = [];

    // Check for specific difficult sounds
    if (romanji.includes('tsu') && recognized.toLowerCase().includes('su')) {
      improvements.push('Work on "tsu" sound - touch tongue to roof of mouth');
    }
    if (romanji.includes('r') && !recognized.toLowerCase().includes('r')) {
      improvements.push('Practice Japanese "r" sound - light tongue flick');
    }
    if (target.length > recognized.length * 1.5) {
      improvements.push('Speak more slowly and clearly');
    }
    if (category === 'pitch' && this.calculateSimilarity(target, recognized) < 0.7) {
      improvements.push('Focus on pitch patterns - practice with rising and falling tones');
    }

    // General improvements
    if (improvements.length === 0) {
      improvements.push('Listen to native speakers more');
      improvements.push('Practice daily for better muscle memory');
    }

    return improvements;
  }

  /**
   * Get pronunciation tips for specific sounds
   */
  public getPronunciationTips(romanji: string): string[] {
    const tips: string[] = [];
    
    Object.keys(japanesePhonemeDifficulty).forEach(sound => {
      if (romanji.includes(sound)) {
        tips.push(...japanesePhonemeDifficulty[sound].tips);
      }
    });

    if (tips.length === 0) {
      tips.push('Listen to the audio carefully');
      tips.push('Practice slowly at first');
      tips.push('Record yourself and compare');
    }

    return [...new Set(tips)]; // Remove duplicates
  }

  /**
   * Assess pronunciation difficulty
   */
  public assessDifficulty(romanji: string): 'easy' | 'medium' | 'hard' {
    let maxDifficulty: 'easy' | 'medium' | 'hard' = 'easy';
    
    Object.keys(japanesePhonemeDifficulty).forEach(sound => {
      if (romanji.includes(sound)) {
        const soundDifficulty = japanesePhonemeDifficulty[sound].difficulty;
        if (soundDifficulty === 'hard') {
          maxDifficulty = 'hard';
        } else if (soundDifficulty === 'medium' && maxDifficulty !== 'hard') {
          maxDifficulty = 'medium';
        }
      }
    });

    return maxDifficulty;
  }
}
