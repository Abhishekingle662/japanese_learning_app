import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  learningGoal: 'casual' | 'business' | 'academic' | 'travel';
  dailyGoalMinutes: number;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredLearningTime: string;
  avatarUrl?: string;
}

interface UserState {
  profile: UserProfile | null;
  isAuthenticated: boolean;
  settings: {
    soundEnabled: boolean;
    hapticsEnabled: boolean;
    darkMode: boolean;
    notificationsEnabled: boolean;
    autoPlay: boolean;
  };
  streakCount: number;
  totalStudyTime: number;
}

const initialState: UserState = {
  profile: null,
  isAuthenticated: false,
  settings: {
    soundEnabled: true,
    hapticsEnabled: true,
    darkMode: false,
    notificationsEnabled: true,
    autoPlay: true,
  },
  streakCount: 0,
  totalStudyTime: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.isAuthenticated = true;
    },
    updateUserSettings: (state, action: PayloadAction<Partial<UserState['settings']>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    incrementStreak: (state) => {
      state.streakCount += 1;
    },
    resetStreak: (state) => {
      state.streakCount = 0;
    },
    addStudyTime: (state, action: PayloadAction<number>) => {
      state.totalStudyTime += action.payload;
    },
    logout: (state) => {
      state.profile = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  setUserProfile,
  updateUserSettings,
  incrementStreak,
  resetStreak,
  addStudyTime,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
