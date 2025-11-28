import { User, RelapseLog, WeeklyReport, DailyCheckIn } from '../types';

// Initial Mock Data (Simulating public/*.csv content)
const INITIAL_USERS_CSV = `id,name,streakStartDate
1,John Doe,2023-10-01T12:00:00.000Z
2,Jane Smith,2023-10-25T08:30:00.000Z`;

const INITIAL_RELAPSES_CSV = `id,userId,date,trigger,situation,missedPlan,emotion,improvementPlan
101,1,2023-09-15T10:00:00.000Z,Stress,Alone in room,Did not call friend,Guilt,Work in living room
102,1,2023-09-20T14:00:00.000Z,Boredom,Scrolling social media,No blocker,Empty,Install blocker`;

const INITIAL_REPORTS_CSV = `id,userId,reportDate,weekStartDate,totalRelapses,helpfulFactors,difficultFactors,warningSigns,emergencyPlanSuccess,focusNextWeek
201,1,2023-09-22T09:00:00.000Z,2023-09-15T00:00:00.000Z,2,Running,Loneliness,Boredom,Failed to exit room,Morning routine`;

const INITIAL_DAILY_CSV = `id,userId,date,mood,urgeIntensity,notes
301,1,2023-10-02T20:00:00.000Z,Good,2,Had a productive day at work.
302,1,2023-10-03T21:00:00.000Z,Stressed,6,Arguments with boss, but used breathing techniques.`;

// --- Parsers ---

export const parseUsers = (csv: string): User[] => {
  const lines = csv.trim().split('\n');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      id: values[0],
      name: values[1],
      streakStartDate: values[2]
    };
  });
};

export const parseRelapses = (csv: string): RelapseLog[] => {
  const lines = csv.trim().split('\n');
  return lines.slice(1).map(line => {
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
    const clean = (val: string) => val ? val.replace(/^"|"$/g, '').replace(/""/g, '"') : '';
    
    return {
      id: clean(values[0]),
      userId: clean(values[1]),
      date: clean(values[2]),
      trigger: clean(values[3]),
      situation: clean(values[4]),
      missedPlan: clean(values[5]),
      emotion: clean(values[6]),
      improvementPlan: clean(values[7])
    };
  });
};

export const parseReports = (csv: string): WeeklyReport[] => {
  const lines = csv.trim().split('\n');
  return lines.slice(1).map(line => {
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const clean = (val: string) => val ? val.replace(/^"|"$/g, '').replace(/""/g, '"') : '';

    return {
      id: clean(values[0]),
      userId: clean(values[1]),
      reportDate: clean(values[2]),
      weekStartDate: clean(values[3]),
      totalRelapses: parseInt(clean(values[4])) || 0,
      helpfulFactors: clean(values[5]),
      difficultFactors: clean(values[6]),
      warningSigns: clean(values[7]),
      emergencyPlanSuccess: clean(values[8]),
      focusNextWeek: clean(values[9]),
    };
  });
};

export const parseDailyCheckIns = (csv: string): DailyCheckIn[] => {
  const lines = csv.trim().split('\n');
  return lines.slice(1).map(line => {
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const clean = (val: string) => val ? val.replace(/^"|"$/g, '').replace(/""/g, '"') : '';

    return {
      id: clean(values[0]),
      userId: clean(values[1]),
      date: clean(values[2]),
      mood: clean(values[3]),
      urgeIntensity: parseInt(clean(values[4])) || 1,
      notes: clean(values[5])
    };
  });
};

// --- Mock Loaders ---
export const getInitialData = () => ({
  users: parseUsers(INITIAL_USERS_CSV),
  relapses: parseRelapses(INITIAL_RELAPSES_CSV),
  reports: parseReports(INITIAL_REPORTS_CSV),
  dailyCheckIns: parseDailyCheckIns(INITIAL_DAILY_CSV)
});