import React, { useState } from 'react';
import { WeeklyReport } from '../types';
import { Save, ArrowLeft } from 'lucide-react';

interface Props {
  onSubmit: (data: Omit<WeeklyReport, 'id' | 'userId'>) => void;
  onCancel: () => void;
}

export const WeeklyForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    totalRelapses: 0,
    helpfulFactors: '',
    difficultFactors: '',
    warningSigns: '',
    emergencyPlanSuccess: '',
    focusNextWeek: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    // Assuming week starts 7 days ago for this report context
    const lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    
    onSubmit({
      ...formData,
      reportDate: now.toISOString(),
      weekStartDate: lastWeek.toISOString()
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
      <button onClick={onCancel} className="flex items-center text-slate-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Cancel
      </button>

      <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="bg-blue-900/20 p-6 border-b border-blue-900/20">
          <h2 className="text-2xl font-bold text-blue-400">Weekly Check-in</h2>
          <p className="text-blue-200/60 mt-1">Consistent review is key to recovery.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              1. Total relapses this week:
            </label>
            <input
              type="number"
              name="totalRelapses"
              min="0"
              required
              className="w-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.totalRelapses}
              onChange={(e) => setFormData({...formData, totalRelapses: parseInt(e.target.value)})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              2. What helped the most this week?
            </label>
            <textarea
              name="helpfulFactors"
              required
              rows={2}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.helpfulFactors}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              3. What was most difficult?
            </label>
            <textarea
              name="difficultFactors"
              required
              rows={2}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.difficultFactors}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              4. Frequent Early Warning Signs?
            </label>
            <textarea
              name="warningSigns"
              required
              rows={2}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.warningSigns}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              5. Emergency Plan: Success/Failures?
            </label>
            <textarea
              name="emergencyPlanSuccess"
              required
              rows={2}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.emergencyPlanSuccess}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              6. Main focus for next week:
            </label>
            <textarea
              name="focusNextWeek"
              required
              rows={2}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.focusNextWeek}
              onChange={handleChange}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <Save className="w-5 h-5" /> Save Weekly Report
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};