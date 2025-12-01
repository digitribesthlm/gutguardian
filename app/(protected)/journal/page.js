'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Save, AlertCircle, Loader2 } from 'lucide-react';
import { useAppState } from '@/lib/useAppState';
import { analyzeTriggers } from '@/lib/geminiService';

const SymptomSeverity = {
  NONE: 0,
  MILD: 1,
  MODERATE: 2,
  SEVERE: 3,
};

export default function JournalPage() {
  const { logs, addLog } = useAppState();
  const [meals, setMeals] = useState('');
  const [mood, setMood] = useState(5);
  const [stress, setStress] = useState(5);
  const [notes, setNotes] = useState('');
  const [symptoms, setSymptoms] = useState({
    bloating: SymptomSeverity.NONE,
    pain: SymptomSeverity.NONE,
    fatigue: SymptomSeverity.NONE,
    brainFog: SymptomSeverity.NONE,
    other: '',
  });

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLog = {
      id: uuidv4(),
      timestamp: Date.now(),
      meals: meals.split(',').map((m) => m.trim()).filter(Boolean),
      mood,
      stress,
      notes,
      symptoms,
    };
    addLog(newLog);
    setMeals('');
    setNotes('');
    setMood(5);
  };

  const handleAnalysis = async () => {
    if (logs.length < 3) {
      setAiAnalysis('Please log at least 3 days of data for an accurate analysis.');
      return;
    }
    setAnalyzing(true);
    try {
      const result = await analyzeTriggers(logs);
      setAiAnalysis(result);
    } catch (e) {
      setAiAnalysis('Failed to connect to AI service.');
    } finally {
      setAnalyzing(false);
    }
  };

  const SeverityButton = ({ label, value, current, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        current === value
          ? 'bg-teal-600 text-white'
          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Daily Journal</h1>
        <button
          onClick={handleAnalysis}
          disabled={analyzing}
          className="text-sm bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors flex items-center"
        >
          {analyzing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <AlertCircle className="w-4 h-4 mr-2" />
          )}
          Identify Triggers
        </button>
      </div>

      {aiAnalysis && (
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-slate-700 text-sm animate-fade-in">
          <h3 className="font-semibold text-indigo-700 mb-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" /> AI Insight
          </h3>
          <p className="whitespace-pre-line">{aiAnalysis}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Food Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            What did you eat today?
          </label>
          <textarea
            value={meals}
            onChange={(e) => setMeals(e.target.value)}
            placeholder="Breakfast: Avocado on sweet potato toast..."
            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            rows={3}
          />
        </div>

        {/* Symptoms Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Symptom Severity (0-3)</h3>

          <div className="space-y-4">
            {[
              { key: 'bloating', label: 'Bloating' },
              { key: 'pain', label: 'Stomach Pain' },
              { key: 'fatigue', label: 'Fatigue' },
              { key: 'brainFog', label: 'Brain Fog' },
            ].map((sym) => (
              <div key={sym.key} className="flex justify-between items-center">
                <span className="text-sm text-slate-600">{sym.label}</span>
                <div className="flex space-x-1">
                  {[0, 1, 2, 3].map((level) => (
                    <SeverityButton
                      key={level}
                      label={level === 0 ? '-' : level}
                      value={level}
                      current={symptoms[sym.key]}
                      onChange={(val) => setSymptoms((prev) => ({ ...prev, [sym.key]: val }))}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mood & Stress */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Mood (1-10)</label>
            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={(e) => setMood(parseInt(e.target.value))}
              className="w-full accent-teal-600"
            />
            <div className="text-center font-bold text-teal-600 mt-2">{mood}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Stress (1-10)</label>
            <input
              type="range"
              min="1"
              max="10"
              value={stress}
              onChange={(e) => setStress(parseInt(e.target.value))}
              className="w-full accent-rose-500"
            />
            <div className="text-center font-bold text-rose-500 mt-2">{stress}</div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-teal-200 hover:bg-teal-700 transition-all flex items-center justify-center"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Entry
        </button>
      </form>
    </div>
  );
}

