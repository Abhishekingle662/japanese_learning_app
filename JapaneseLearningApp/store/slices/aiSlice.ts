import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LessonItem } from './learningSlice';

export interface AIRecommendation {
  id: string;
  type: 'lesson' | 'review' | 'practice' | 'break';
  title: string;
  description: string;
  confidence: number;
  estimatedTime: number;
  targetLessonId?: string;
  items?: LessonItem[];
}

export interface LearningPattern {
  userId: string;
  preferredTimeOfDay: string;
  averageSessionLength: number;
  strengths: string[];
  weaknesses: string[];
  learningVelocity: number;
  retentionRate: number;
  difficultyPreference: number;
  lastUpdated: string;
}

export interface SpacedRepetitionItem {
  itemId: string;
  difficulty: number;
  interval: number; // days
  repetitions: number;
  easeFactor: number;
  nextReviewDate: string;
  lastReviewDate: string;
  correctCount: number;
  incorrectCount: number;
}

interface AIState {
  recommendations: AIRecommendation[];
  learningPattern: LearningPattern | null;
  spacedRepetitionItems: SpacedRepetitionItem[];
  adaptiveDifficulty: {
    currentLevel: number;
    adjustmentFactor: number;
    recentPerformance: number[];
  };
  personalizedContent: {
    preferredLessonTypes: string[];
    strugglingAreas: string[];
    masteredAreas: string[];
  };
  isAnalyzing: boolean;
  lastAnalysisDate: string | null;
}

const initialState: AIState = {
  recommendations: [],
  learningPattern: null,
  spacedRepetitionItems: [],
  adaptiveDifficulty: {
    currentLevel: 1,
    adjustmentFactor: 1.0,
    recentPerformance: [],
  },
  personalizedContent: {
    preferredLessonTypes: [],
    strugglingAreas: [],
    masteredAreas: [],
  },
  isAnalyzing: false,
  lastAnalysisDate: null,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setRecommendations: (state, action: PayloadAction<AIRecommendation[]>) => {
      state.recommendations = action.payload;
    },
    addRecommendation: (state, action: PayloadAction<AIRecommendation>) => {
      state.recommendations.push(action.payload);
    },
    removeRecommendation: (state, action: PayloadAction<string>) => {
      state.recommendations = state.recommendations.filter(r => r.id !== action.payload);
    },
    updateLearningPattern: (state, action: PayloadAction<Partial<LearningPattern>>) => {
      if (state.learningPattern) {
        state.learningPattern = { ...state.learningPattern, ...action.payload };
      } else {
        state.learningPattern = action.payload as LearningPattern;
      }
    },
    addSpacedRepetitionItem: (state, action: PayloadAction<SpacedRepetitionItem>) => {
      const existingIndex = state.spacedRepetitionItems.findIndex(
        item => item.itemId === action.payload.itemId
      );
      
      if (existingIndex >= 0) {
        state.spacedRepetitionItems[existingIndex] = action.payload;
      } else {
        state.spacedRepetitionItems.push(action.payload);
      }
    },
    updateSpacedRepetitionItem: (state, action: PayloadAction<{ itemId: string; isCorrect: boolean }>) => {
      const item = state.spacedRepetitionItems.find(sri => sri.itemId === action.payload.itemId);
      if (item) {
        const { isCorrect } = action.payload;
        const now = new Date().toISOString();
        
        item.lastReviewDate = now;
        item.repetitions += 1;
        
        if (isCorrect) {
          item.correctCount += 1;
          item.easeFactor = Math.max(1.3, item.easeFactor + (0.1 - (5 - item.difficulty) * (0.08 + (5 - item.difficulty) * 0.02)));
          item.interval = Math.round(item.interval * item.easeFactor);
        } else {
          item.incorrectCount += 1;
          item.easeFactor = Math.max(1.3, item.easeFactor - 0.2);
          item.interval = 1;
          item.repetitions = 0;
        }
        
        // Calculate next review date
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + item.interval);
        item.nextReviewDate = nextDate.toISOString();
      }
    },
    updateAdaptiveDifficulty: (state, action: PayloadAction<{ performance: number }>) => {
      const { performance } = action.payload;
      
      // Add to recent performance (keep last 10 scores)
      state.adaptiveDifficulty.recentPerformance.push(performance);
      if (state.adaptiveDifficulty.recentPerformance.length > 10) {
        state.adaptiveDifficulty.recentPerformance.shift();
      }
      
      // Calculate average recent performance
      const avgPerformance = state.adaptiveDifficulty.recentPerformance.reduce((a, b) => a + b, 0) / 
        state.adaptiveDifficulty.recentPerformance.length;
      
      // Adjust difficulty based on performance
      if (avgPerformance > 0.8 && state.adaptiveDifficulty.recentPerformance.length >= 3) {
        state.adaptiveDifficulty.adjustmentFactor = Math.min(2.0, state.adaptiveDifficulty.adjustmentFactor + 0.1);
      } else if (avgPerformance < 0.6 && state.adaptiveDifficulty.recentPerformance.length >= 3) {
        state.adaptiveDifficulty.adjustmentFactor = Math.max(0.5, state.adaptiveDifficulty.adjustmentFactor - 0.1);
      }
    },
    updatePersonalizedContent: (state, action: PayloadAction<Partial<AIState['personalizedContent']>>) => {
      state.personalizedContent = { ...state.personalizedContent, ...action.payload };
    },
    setAnalyzing: (state, action: PayloadAction<boolean>) => {
      state.isAnalyzing = action.payload;
      if (!action.payload) {
        state.lastAnalysisDate = new Date().toISOString();
      }
    },
    clearRecommendations: (state) => {
      state.recommendations = [];
    },
  },
});

export const {
  setRecommendations,
  addRecommendation,
  removeRecommendation,
  updateLearningPattern,
  addSpacedRepetitionItem,
  updateSpacedRepetitionItem,
  updateAdaptiveDifficulty,
  updatePersonalizedContent,
  setAnalyzing,
  clearRecommendations,
} = aiSlice.actions;

export default aiSlice.reducer;
