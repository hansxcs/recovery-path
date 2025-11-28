import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, ShieldAlert, Phone, Wind, DoorOpen, Activity } from 'lucide-react';

interface Props {
  onBack: () => void;
  onRelapsed: () => void;
}

export const EmergencySOS: React.FC<Props> = ({ onBack, onRelapsed }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Physical Reset",
      icon: <Wind className="w-12 h-12 text-blue-400" />,
      actions: [
        "Leave the room immediately.",
        "Splash cold water on your face.",
        "Do 20 Push-ups or Stretch for 3 mins."
      ],
      desc: "Break the dopamine cycle instantly."
    },
    {
      title: "Environmental Control",
      icon: <DoorOpen className="w-12 h-12 text-yellow-400" />,
      actions: [
        "Move to a public space or living room.",
        "Turn on Website Blockers.",
        "Leave bedroom door open."
      ],
      desc: "Remove the privacy required for the habit."
    },
    {
      title: "Healthy Distraction",
      icon: <Activity className="w-12 h-12 text-green-400" />,
      actions: [
        "Read 1 Psalm or Proverb.",
        "Listen to worship/calming music.",
        "Brisk walk for 5 minutes."
      ],
      desc: "Shift your mind to something higher."
    },
    {
      title: "Contact Point (Last Stand)",
      icon: <Phone className="w-12 h-12 text-red-400" />,
      actions: [
        "Text your Accountability Partner:",
        "\"Bro, I'm at high risk. I need help.\"",
        "DO NOT contact emotional triggers."
      ],
      desc: "Don't fight this alone."
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
      <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Safety
      </button>

      <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-6 mb-8 text-center">
        <h2 className="text-3xl font-bold text-red-500 mb-2 flex justify-center items-center gap-2">
          <ShieldAlert className="w-8 h-8" /> EMERGENCY MODE
        </h2>
        <p className="text-red-200">Follow these steps carefully. Do not skip.</p>
      </div>

      <div className="space-y-6">
        {steps.map((s, idx) => (
          <div 
            key={idx} 
            className={`transition-all duration-500 transform ${idx > step ? 'opacity-30 blur-[1px]' : 'opacity-100 scale-100'}`}
          >
            <div className={`bg-slate-800 rounded-xl p-6 border ${idx === step ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-700'}`}>
              <div className="flex items-start gap-4">
                <div className="shrink-0 p-3 bg-slate-900 rounded-lg">
                  {s.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{s.title}</h3>
                  <p className="text-sm text-slate-400 mb-4">{s.desc}</p>
                  <ul className="space-y-2">
                    {s.actions.map((action, i) => (
                      <li key={i} className="flex items-center text-slate-200">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        {action}
                      </li>
                    ))}
                  </ul>
                  
                  {idx === step && (
                    <button 
                      onClick={() => setStep(prev => prev + 1)}
                      className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" /> I Have Done This
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {step >= steps.length && (
        <div className="mt-8 p-6 bg-emerald-900/30 border border-emerald-800 rounded-xl text-center animate-bounce-in">
          <h3 className="text-2xl font-bold text-emerald-400 mb-2">Urge Subsided?</h3>
          <p className="text-emerald-100 mb-6">Great job fighting the battle. You are stronger than you think.</p>
          <button 
            onClick={onBack}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
          >
            Return to Dashboard
          </button>
        </div>
      )}

      <div className="mt-12 text-center border-t border-slate-800 pt-8">
        <p className="text-slate-500 mb-4">Did the urge win?</p>
        <button 
          onClick={onRelapsed}
          className="text-sm text-red-500 hover:text-red-400 underline decoration-red-500/30 underline-offset-4"
        >
          I Relapsed (Open Report)
        </button>
      </div>
    </div>
  );
};