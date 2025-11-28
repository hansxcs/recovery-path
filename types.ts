export interface User {
  id: string;
  name: string;
  streakStartDate: string; // ISO String
}

export interface RelapseLog {
  id: string;
  userId: string;
  date: string; // ISO String
  trigger: string;
  situation: string;
  missedPlan: string;
  emotion: string;
  improvementPlan: string;
}

export interface WeeklyReport {
  id: string;
  userId: string;
  reportDate: string; // ISO String
  weekStartDate: string; // ISO String
  totalRelapses: number;
  helpfulFactors: string;
  difficultFactors: string;
  warningSigns: string;
  emergencyPlanSuccess: string;
  focusNextWeek: string;
}

export interface DailyCheckIn {
  id: string;
  userId: string;
  date: string; // ISO String
  mood: string;
  urgeIntensity: number; // 1-10
  notes: string;
}

export type ViewState = 'USER_SELECT' | 'DASHBOARD' | 'SOS' | 'RELAPSE_FORM' | 'WEEKLY_FORM' | 'DAILY_FORM';

export interface DataContextType {
  users: User[];
  relapses: RelapseLog[];
  weeklyReports: WeeklyReport[];
  dailyCheckIns: DailyCheckIn[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  addUser: (name: string) => void;
  addRelapse: (log: Omit<RelapseLog, 'id' | 'userId'>) => void;
  addWeeklyReport: (report: Omit<WeeklyReport, 'id' | 'userId'>) => void;
  addDailyCheckIn: (checkIn: Omit<DailyCheckIn, 'id' | 'userId'>) => void;
  exportData: () => void;
}