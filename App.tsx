import React, { useState, useEffect, useRef } from 'react';
import { 
  User, RelapseLog, WeeklyReport, DailyCheckIn, ViewState 
} from './types';
import * as CsvService from './services/csvService';
import { CountdownTimer } from './components/CountdownTimer';
import { RelapseChart } from './components/RelapseChart';
import { UrgeChart } from './components/UrgeChart';
import { EmergencySOS } from './components/EmergencySOS';
import { RelapseForm } from './components/RelapseForm';
import { WeeklyForm } from './components/WeeklyForm';
import { DailyForm } from './components/DailyForm';
import { 
  ShieldCheck, AlertTriangle, FileText, Download, Upload,
  Users, LogOut, Activity, Plus, Calendar, TrendingUp
} from 'lucide-react';

const App = () => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [relapses, setRelapses] = useState<RelapseLog[]>([]);
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [dailyCheckIns, setDailyCheckIns] = useState<DailyCheckIn[]>([]);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('USER_SELECT');
  const [newUserName, setNewUserName] = useState('');
  const [chartFilter, setChartFilter] = useState<'week'|'month'|'year'>('week');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Initial Data from CSV Service (Mock Data)
  // No LocalStorage - Data resets on refresh unless exported/imported
  useEffect(() => {
    const data = CsvService.getInitialData();
    setUsers(data.users);
    setRelapses(data.relapses);
    setReports(data.reports);
    setDailyCheckIns(data.dailyCheckIns);
  }, []);

  // Handlers
  const handleAddUser = () => {
    if (!newUserName.trim()) return;
    const newUser: User = {
      id: Date.now().toString(),
      name: newUserName,
      streakStartDate: new Date().toISOString()
    };
    setUsers([...users, newUser]);
    setNewUserName('');
  };

  const handleUserSelect = (user: User) => {
    setCurrentUser(user);
    setView('DASHBOARD');
  };

  const handleRelapseSubmit = (logData: Omit<RelapseLog, 'id' | 'userId'>) => {
    if (!currentUser) return;
    
    // 1. Add Log
    const newLog: RelapseLog = {
      id: Date.now().toString(),
      userId: currentUser.id,
      ...logData
    };
    setRelapses([...relapses, newLog]);

    // 2. Reset Streak
    const updatedUser = { ...currentUser, streakStartDate: new Date().toISOString() };
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    
    // 3. Navigate
    setView('DASHBOARD');
  };

  const handleWeeklySubmit = (reportData: Omit<WeeklyReport, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const newReport: WeeklyReport = {
      id: Date.now().toString(),
      userId: currentUser.id,
      ...reportData
    };
    setReports([...reports, newReport]);
    setView('DASHBOARD');
  };

  const handleDailySubmit = (checkInData: Omit<DailyCheckIn, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const newCheckIn: DailyCheckIn = {
      id: Date.now().toString(),
      userId: currentUser.id,
      ...checkInData
    };
    setDailyCheckIns([...dailyCheckIns, newCheckIn]);
    setView('DASHBOARD');
  };

  // JSON Export
  const handleExportJson = () => {
    const data = {
      users,
      relapses,
      reports,
      dailyCheckIns
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recovery_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // JSON Import
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const data = JSON.parse(json);
        
        if (data.users && Array.isArray(data.users)) setUsers(data.users);
        if (data.relapses && Array.isArray(data.relapses)) setRelapses(data.relapses);
        if (data.reports && Array.isArray(data.reports)) setReports(data.reports);
        if (data.dailyCheckIns && Array.isArray(data.dailyCheckIns)) setDailyCheckIns(data.dailyCheckIns);
        
        alert('Data imported successfully!');
        if (currentUser) {
          // Refresh current user if they exist in new data, else logout
          const updatedUser = data.users?.find((u: User) => u.id === currentUser.id);
          if (updatedUser) setCurrentUser(updatedUser);
          else {
            setCurrentUser(null);
            setView('USER_SELECT');
          }
        }
      } catch (err) {
        console.error(err);
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Views ---

  if (view === 'USER_SELECT') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 animate-fade-in">
        <div className="max-w-md w-full bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-800">
          <div className="text-center mb-8">
            <ShieldCheck className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Recovery Path</h1>
            <p className="text-slate-400">Select a profile to continue your journey.</p>
          </div>

          <div className="space-y-4 mb-8">
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">{user.name}</div>
                    <div className="text-xs text-slate-500">
                      ID: {user.id.slice(0,4)}...
                    </div>
                  </div>
                </div>
                <Activity className="w-5 h-5 text-slate-600 group-hover:text-blue-400" />
              </button>
            ))}
          </div>

          <div className="flex gap-2 mb-6">
            <input 
              type="text" 
              placeholder="New User Name" 
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
            <button 
              onClick={handleAddUser}
              disabled={!newUserName.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg px-4 flex items-center"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-6 border-t border-slate-800 flex justify-center gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm"
            >
              <Upload className="w-4 h-4" /> Import JSON
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportJson} 
              accept=".json" 
              className="hidden" 
            />
          </div>
        </div>
      </div>
    );
  }

  if (view === 'SOS') {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <EmergencySOS 
          onBack={() => setView('DASHBOARD')} 
          onRelapsed={() => setView('RELAPSE_FORM')} 
        />
      </div>
    );
  }

  if (view === 'RELAPSE_FORM') {
    return (
      <div className="min-h-screen bg-slate-950 text-white py-8">
        <RelapseForm 
          onSubmit={handleRelapseSubmit} 
          onCancel={() => setView('DASHBOARD')} 
        />
      </div>
    );
  }

  if (view === 'WEEKLY_FORM') {
    return (
      <div className="min-h-screen bg-slate-950 text-white py-8">
        <WeeklyForm 
          onSubmit={handleWeeklySubmit} 
          onCancel={() => setView('DASHBOARD')} 
        />
      </div>
    );
  }

  if (view === 'DAILY_FORM') {
    return (
      <div className="min-h-screen bg-slate-950 text-white py-8">
        <DailyForm 
          onSubmit={handleDailySubmit} 
          onCancel={() => setView('DASHBOARD')} 
        />
      </div>
    );
  }

  // DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20 animate-fade-in">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <ShieldCheck className="w-8 h-8 text-blue-500" />
             <div>
               <h1 className="font-bold text-lg leading-tight">Recovery Path</h1>
               <p className="text-xs text-slate-400">Welcome back, {currentUser?.name}</p>
             </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExportJson}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors flex items-center gap-2"
              title="Export Data as JSON"
            >
              <Download className="w-5 h-5" />
              <span className="hidden md:inline text-xs font-bold">EXPORT JSON</span>
            </button>
            <button 
              onClick={() => { setCurrentUser(null); setView('USER_SELECT'); }}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Switch User"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-6">
        
        {/* Top Section: Timer & Emergency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CountdownTimer startDate={currentUser!.streakStartDate} />
          
          <div className="flex flex-col gap-4">
             <button 
                onClick={() => setView('SOS')}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-900/20 rounded-xl p-6 flex flex-col items-center justify-center transition-transform hover:scale-[1.02]"
             >
                <AlertTriangle className="w-10 h-10 mb-2 text-white" />
                <span className="text-xl font-bold">I HAVE AN URGE (SOS)</span>
                <span className="text-red-100 text-sm opacity-80 mt-1">Click here for immediate help steps</span>
             </button>

             <div className="grid grid-cols-3 gap-2 h-full">
                <button 
                  onClick={() => setView('DAILY_FORM')}
                  className="bg-slate-800 border border-slate-700 hover:border-emerald-500 hover:text-emerald-400 text-slate-300 rounded-xl p-2 font-semibold transition-colors flex flex-col items-center justify-center gap-2 text-sm"
                >
                  <Calendar className="w-5 h-5" />
                  Daily
                </button>
                <button 
                  onClick={() => setView('WEEKLY_FORM')}
                  className="bg-slate-800 border border-slate-700 hover:border-blue-500 hover:text-blue-400 text-slate-300 rounded-xl p-2 font-semibold transition-colors flex flex-col items-center justify-center gap-2 text-sm"
                >
                  <FileText className="w-5 h-5" />
                  Weekly
                </button>
                <button 
                  onClick={() => setView('RELAPSE_FORM')}
                  className="bg-slate-800 border border-slate-700 hover:border-red-500 hover:text-red-400 text-slate-300 rounded-xl p-2 font-semibold transition-colors flex flex-col items-center justify-center gap-2 text-sm"
                >
                  <Activity className="w-5 h-5" />
                  Relapse
                </button>
             </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Relapse Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-red-400">
                <Activity className="w-5 h-5" />
                Relapse Frequency
              </h2>
              <div className="flex bg-slate-800 rounded-lg p-1 text-xs font-medium">
                {(['week', 'month', 'year'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setChartFilter(f)}
                    className={`px-2 py-1 rounded-md transition-colors capitalize ${
                      chartFilter === f ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <RelapseChart relapses={relapses.filter(r => r.userId === currentUser!.id)} filter={chartFilter} />
          </div>

          {/* Urge Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
                Urge Intensity
              </h2>
            </div>
            <UrgeChart checkIns={dailyCheckIns.filter(r => r.userId === currentUser!.id)} />
          </div>
        </div>

        {/* History Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Daily Check-ins List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-hidden flex flex-col h-96">
            <h3 className="text-lg font-bold mb-4 text-emerald-400 flex items-center gap-2">
               <Calendar className="w-5 h-5" /> Daily Logs
            </h3>
            <div className="overflow-y-auto flex-1 pr-2 space-y-3 custom-scrollbar">
               {dailyCheckIns
                 .filter(r => r.userId === currentUser!.id)
                 .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                 .map(log => (
                   <div key={log.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 hover:border-emerald-500/30 transition-colors">
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-xs text-slate-400">{new Date(log.date).toLocaleDateString()}</span>
                       <span className="text-xs font-bold text-emerald-400">{log.mood}</span>
                     </div>
                     <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Urge: {log.urgeIntensity}/10</span>
                     </div>
                     {log.notes && <p className="text-xs text-slate-300 mt-1 italic line-clamp-2">"{log.notes}"</p>}
                   </div>
               ))}
               {dailyCheckIns.filter(r => r.userId === currentUser!.id).length === 0 && (
                 <p className="text-center text-slate-500 mt-10 text-sm">No daily check-ins yet.</p>
               )}
            </div>
          </div>

          {/* Relapse Log Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-hidden flex flex-col h-96">
            <h3 className="text-lg font-bold mb-4 text-red-400 flex items-center gap-2">
              <Activity className="w-5 h-5" /> Relapses
            </h3>
            <div className="overflow-y-auto flex-1 pr-2 space-y-3 custom-scrollbar">
              {relapses
                .filter(r => r.userId === currentUser!.id)
                .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(log => (
                  <div key={log.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800 hover:border-red-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-slate-400">{new Date(log.date).toLocaleString()}</span>
                      <span className="px-2 py-0.5 rounded text-xs bg-red-900/30 text-red-400 border border-red-900/50">{log.trigger}</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-1"><span className="text-slate-500">Mood:</span> {log.emotion}</p>
                    <p className="text-sm text-slate-300 line-clamp-2"><span className="text-slate-500">Fix:</span> {log.improvementPlan}</p>
                  </div>
              ))}
              {relapses.filter(r => r.userId === currentUser!.id).length === 0 && (
                <p className="text-center text-slate-500 mt-10 text-sm">No relapses recorded.</p>
              )}
            </div>
          </div>

          {/* Weekly Reports Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-hidden flex flex-col h-96">
            <h3 className="text-lg font-bold mb-4 text-blue-400 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Weekly
            </h3>
            <div className="overflow-y-auto flex-1 pr-2 space-y-3 custom-scrollbar">
              {reports
                .filter(r => r.userId === currentUser!.id)
                .sort((a,b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime())
                .map(rep => (
                  <div key={rep.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800 hover:border-blue-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-slate-400">{new Date(rep.reportDate).toLocaleDateString()}</span>
                      <span className="px-2 py-0.5 rounded text-xs bg-blue-900/30 text-blue-400 border border-blue-900/50">{rep.totalRelapses} Relapses</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-1 line-clamp-1"><span className="text-slate-500">Helpful:</span> {rep.helpfulFactors}</p>
                    <p className="text-sm text-slate-300 line-clamp-1"><span className="text-slate-500">Focus:</span> {rep.focusNextWeek}</p>
                  </div>
              ))}
              {reports.filter(r => r.userId === currentUser!.id).length === 0 && (
                <p className="text-center text-slate-500 mt-10 text-sm">No weekly reports yet.</p>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;
