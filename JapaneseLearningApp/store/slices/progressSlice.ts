import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StudySession {
  date: string;
  duration: number; // in minutes
  lessonsCompleted: number;
  accuracy: number;
  xpEarned: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  target: number;
}

export interface ProgressStats {
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  totalCharactersLearned: number;
  averageAccuracy: number;
  longestStreak: number;
  totalStudyDays: number;
  weeklyGoalProgress: number;
  monthlyGoalProgress: number;
}

interface ProgressState {
  stats: ProgressStats;
  studySessions: StudySession[];
  achievements: Achievement[];
  weeklyData: { date: string; minutes: number; accuracy: number }[];
  monthlyData: { month: string; totalMinutes: number; averageAccuracy: number }[];
  loading: boolean;
}

const initialState: ProgressState = {
  stats: {
    totalXP: 0,
    currentLevel: 1,
    xpToNextLevel: 100,
    totalCharactersLearned: 0,
    averageAccuracy: 0,
    longestStreak: 0,
    totalStudyDays: 0,
    weeklyGoalProgress: 0,
    monthlyGoalProgress: 0,
  },
  studySessions: [],
  achievements: [],
  weeklyData: [],
  monthlyData: [],
  loading: false,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    addStudySession: (state, action: PayloadAction<StudySession>) => {
      state.studySessions.push(action.payload);
      
      // Update stats
      state.stats.totalXP += action.payload.xpEarned;
      state.stats.totalStudyDays = new Set(state.studySessions.map(s => s.date)).size;
      
      // Calculate average accuracy
      const totalAccuracy = state.studySessions.reduce((sum, session) => sum + session.accuracy, 0);
      state.stats.averageAccuracy = totalAccuracy / state.studySessions.length;
      
      // Update level based on XP
      const newLevel = Math.floor(state.stats.totalXP / 100) + 1;
      if (newLevel > state.stats.currentLevel) {
        state.stats.currentLevel = newLevel;
      }
      state.stats.xpToNextLevel = (state.stats.currentLevel * 100) - state.stats.totalXP;
    },
    updateCharactersLearned: (state, action: PayloadAction<number>) => {
      state.stats.totalCharactersLearned += action.payload;
    },
    updateLongestStreak: (state, action: PayloadAction<number>) => {
      if (action.payload > state.stats.longestStreak) {
        state.stats.longestStreak = action.payload;
      }
    },
    unlockAchievement: (state, action: PayloadAction<string>) => {
      const achievement = state.achievements.find(a => a.id === action.payload);
      if (achievement && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date().toISOString();
      }
    },
    updateAchievementProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      const achievement = state.achievements.find(a => a.id === action.payload.id);
      if (achievement) {
        achievement.progress = Math.min(action.payload.progress, achievement.target);
        if (achievement.progress >= achievement.target && !achievement.unlockedAt) {
          achievement.unlockedAt = new Date().toISOString();
        }
      }
    },
    setAchievements: (state, action: PayloadAction<Achievement[]>) => {
      state.achievements = action.payload;
    },
    updateWeeklyData: (state, action: PayloadAction<{ date: string; minutes: number; accuracy: number }[]>) => {
      state.weeklyData = action.payload;
    },
    updateMonthlyData: (state, action: PayloadAction<{ month: string; totalMinutes: number; averageAccuracy: number }[]>) => {
      state.monthlyData = action.payload;
    },
    updateWeeklyGoalProgress: (state, action: PayloadAction<number>) => {
      state.stats.weeklyGoalProgress = action.payload;
    },
    updateMonthlyGoalProgress: (state, action: PayloadAction<number>) => {
      state.stats.monthlyGoalProgress = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addStudySession,
  updateCharactersLearned,
  updateLongestStreak,
  unlockAchievement,
  updateAchievementProgress,
  setAchievements,
  updateWeeklyData,
  updateMonthlyData,
  updateWeeklyGoalProgress,
  updateMonthlyGoalProgress,
  setLoading,
} = progressSlice.actions;

export default progressSlice.reducer;
