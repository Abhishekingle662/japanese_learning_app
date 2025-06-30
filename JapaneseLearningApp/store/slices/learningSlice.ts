import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LessonItem {
  id: string;
  character: string;
  romanji: string;
  audio?: string;
  strokeOrder?: string[];
  mnemonics?: string;
  examples: string[];
}

export interface Lesson {
  id: string;
  title: string;
  type: 'hiragana' | 'katakana' | 'kanji' | 'grammar' | 'vocabulary' | 'pronunciation';
  difficulty: 1 | 2 | 3 | 4 | 5;
  items: LessonItem[];
  estimatedTime: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  score?: number;
}

export interface LearningModule {
  id: string;
  name: string;
  icon: string;
  description: string;
  lessons: Lesson[];
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

interface LearningState {
  modules: LearningModule[];
  currentLesson: Lesson | null;
  currentLessonProgress: number;
  isLessonActive: boolean;
  reviewItems: LessonItem[];
  mistakeItems: LessonItem[];
  dailyReview: LessonItem[];
  loading: boolean;
  error: string | null;
}

const initialState: LearningState = {
  modules: [],
  currentLesson: null,
  currentLessonProgress: 0,
  isLessonActive: false,
  reviewItems: [],
  mistakeItems: [],
  dailyReview: [],
  loading: false,
  error: null,
};

const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    setModules: (state, action: PayloadAction<LearningModule[]>) => {
      state.modules = action.payload;
    },
    startLesson: (state, action: PayloadAction<Lesson>) => {
      state.currentLesson = action.payload;
      state.currentLessonProgress = 0;
      state.isLessonActive = true;
    },
    updateLessonProgress: (state, action: PayloadAction<number>) => {
      state.currentLessonProgress = action.payload;
    },
    completeLesson: (state, action: PayloadAction<{ lessonId: string; score: number }>) => {
      const { lessonId, score } = action.payload;
      
      // Find and update the lesson
      state.modules.forEach(module => {
        const lesson = module.lessons.find(l => l.id === lessonId);
        if (lesson) {
          lesson.isCompleted = true;
          lesson.score = score;
          module.completedLessons += 1;
          module.progress = (module.completedLessons / module.totalLessons) * 100;
        }
      });
      
      state.currentLesson = null;
      state.isLessonActive = false;
      state.currentLessonProgress = 0;
    },
    addToReview: (state, action: PayloadAction<LessonItem>) => {
      const exists = state.reviewItems.find(item => item.id === action.payload.id);
      if (!exists) {
        state.reviewItems.push(action.payload);
      }
    },
    addToMistakes: (state, action: PayloadAction<LessonItem>) => {
      const exists = state.mistakeItems.find(item => item.id === action.payload.id);
      if (!exists) {
        state.mistakeItems.push(action.payload);
      }
    },
    removeFromMistakes: (state, action: PayloadAction<string>) => {
      state.mistakeItems = state.mistakeItems.filter(item => item.id !== action.payload);
    },
    setDailyReview: (state, action: PayloadAction<LessonItem[]>) => {
      state.dailyReview = action.payload;
    },
    unlockLesson: (state, action: PayloadAction<string>) => {
      state.modules.forEach(module => {
        const lesson = module.lessons.find(l => l.id === action.payload);
        if (lesson) {
          lesson.isUnlocked = true;
        }
      });
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setModules,
  startLesson,
  updateLessonProgress,
  completeLesson,
  addToReview,
  addToMistakes,
  removeFromMistakes,
  setDailyReview,
  unlockLesson,
  setLoading,
  setError,
} = learningSlice.actions;

export default learningSlice.reducer;
