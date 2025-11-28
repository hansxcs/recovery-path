import React, { useState } from 'react';
import { DailyCheckIn } from '../types';
import { Save, ArrowLeft, Sun, Cloud, CloudRain, Zap, Battery } from 'lucide-react';

interface Props {
  onSubmit: (data: Omit<DailyCheckIn, 'id' | 'userId'>) => void;
  onCancel: () => void;
}

export const DailyForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    mood: 'Neutral',
    urgeIntensity: 1,
    notes: ''
  });

  const moods = [
    { label: 'Great', icon: <Sun className="w-6 h-6 text-yellow-400" /> },
    { label: 'Good', icon: <Zap className="w-6 h-6 text-orange-400" /> },
    { label: 'Neutral', icon: <Battery className="w-6 h-6 text-blue-400" /> },
    { label: 'Down', icon: <Cloud className="w-6 h-6 text-slate-400" /> },
    { label: 'Stressed', icon: <CloudRain className="w-6 h-6 text-indigo-400" /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      date: new Date().toISOString()
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
      <button onClick={onCancel} className="flex items-center text-slate-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Cancel
      </button>

      <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="bg-emerald-900/20 p-6 border-b border-emerald-900/20">
          <h2 className="text-2xl font-bold text-emerald-400">Daily Check-in</h2>
          <p className="text-emerald-200/60 mt-1">Track your mood and urge levels to stay aware.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-4">
              How are you feeling today?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {moods.map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setFormData({ ...formData, mood: m.label })}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                    formData.mood === m.label 
                      ? 'bg-slate-700 border-emerald-500 ring-1 ring-emerald-500' 
                      : 'bg-slate-900 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  {m.icon}
                  <span className="text-xs mt-2 text-slate-300">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Urge Intensity Slider */}
          <div>
            <div className="flex justify-between items-center mb-4">
               <label className="block text-sm font-medium text-slate-300">
                 Urge Intensity (1-10)
               </label>
               <span className={`font-bold text-lg ${formData.urgeIntensity > 7 ? 'text-red-400' : 'text-emerald-400'}`}>
                 {formData.urgeIntensity}
               </span>
            </div>
            <input 
              type="range"
              min="1"
              max="10"
              step="1"
              value={formData.urgeIntensity}
              onChange={(e) => setFormData({...formData, urgeIntensity: parseInt(e.target.value)})}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>None</span>
              <span>Manageable</span>
              <span>Strong</span>
              <span>Extreme</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Notes / Gratitude
            </label>
            <textarea
              required
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="What went well today? What are you grateful for?"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <Save className="w-5 h-5" /> Save Daily Check-in
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};