import React, { useState } from 'react';
import { RelapseLog } from '../types';
import { Save, ArrowLeft } from 'lucide-react';

interface Props {
  onSubmit: (data: Omit<RelapseLog, 'id' | 'userId'>) => void;
  onCancel: () => void;
}

export const RelapseForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    trigger: '',
    situation: '',
    missedPlan: '',
    emotion: '',
    improvementPlan: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      date: new Date().toISOString()
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
      <button onClick={onCancel} className="flex items-center text-slate-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Cancel
      </button>

      <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="bg-red-900/20 p-6 border-b border-red-900/20">
          <h2 className="text-2xl font-bold text-red-400">Relapse Report</h2>
          <p className="text-red-200/60 mt-1">Reflection to understand patterns, not to feel guilt.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              1. What was the main trigger?
            </label>
            <select 
              name="trigger" 
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={formData.trigger}
              onChange={handleChange}
            >
              <option value="">Select a trigger...</option>
              <option value="Stress/Fatigue">Stress / Emotional Fatigue</option>
              <option value="Conflict">Conflict (Partner/Family)</option>
              <option value="Boredom">Boredom / Emptiness</option>
              <option value="Isolation">Alone in room too long</option>
              <option value="Aimless Browsing">Aimless Browsing (Social Media)</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              2. What happened 10 minutes before?
            </label>
            <p className="text-xs text-slate-500 mb-2">Identify habits, browsing patterns, or specific emotions.</p>
            <textarea
              name="situation"
              required
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., I was scrolling Instagram in bed..."
              value={formData.situation}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              3. Which part of the Emergency Plan was missed?
            </label>
            <input
              type="text"
              name="missedPlan"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Did not leave the room, didn't use blocker..."
              value={formData.missedPlan}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              4. Emotion after relapse?
            </label>
            <input
              type="text"
              name="emotion"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Disappointed, Relieved, Numb..."
              value={formData.emotion}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              5. Action plan for the next 24 hours?
            </label>
            <textarea
              name="improvementPlan"
              required
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Will work in living room, install blocker..."
              value={formData.improvementPlan}
              onChange={handleChange}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <Save className="w-5 h-5" /> Submit & Reset Streak
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};