'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Save, AlertCircle, Loader2, AlertTriangle, CheckCircle, HelpCircle, Plus } from 'lucide-react';
import { useAppState } from '@/lib/useAppState';
import { analyzeTriggers } from '@/lib/geminiService';

const SymptomSeverity = {
  NONE: 0,
  MILD: 1,
  MODERATE: 2,
  SEVERE: 3,
};

export default function JournalPage() {
  const { logs, addLog, settings, updateSettings } = useAppState();
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
      setAiAnalysis({ error: 'Please log at least 3 days of data for an accurate analysis.' });
      return;
    }
    setAnalyzing(true);
    try {
      const result = await analyzeTriggers(logs);
      setAiAnalysis(result);
    } catch (e) {
      setAiAnalysis({ error: 'Failed to connect to AI service.' });
    } finally {
      setAnalyzing(false);
    }
  };

  const addToTriggerFoods = (food) => {
    if (!settings.triggerFoods.includes(food)) {
      updateSettings({
        triggerFoods: [...settings.triggerFoods, food],
      });
    }
  };

  const getConfidenceIcon = (confidence) => {
    switch (confidence) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'low':
        return <HelpCircle className="w-4 h-4 text-slate-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getConfidenceBadge = (confidence) => {
    const styles = {
      high: 'bg-rose-100 text-rose-700 border-rose-200',
      medium: 'bg-amber-100 text-amber-700 border-amber-200',
      low: 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return styles[confidence] || styles.low;
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

  const renderAnalysis = () => {
    if (!aiAnalysis) return null;

    // Error state
    if (aiAnalysis.error) {
      return (
        <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 text-rose-700 text-sm animate-fade-in">
          <p>{aiAnalysis.error}</p>
        </div>
      );
    }

    // Raw text fallback
    if (aiAnalysis.raw) {
      return (
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-slate-700 text-sm animate-fade-in">
          <h3 className="font-semibold text-indigo-700 mb-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" /> AI Insight
          </h3>
          <p className="whitespace-pre-line">{aiAnalysis.raw}</p>
        </div>
      );
    }

    // Structured analysis
    if (aiAnalysis.structured) {
      const { triggers, summary, recommendations, stressImpact } = aiAnalysis.structured;

      return (
        <div className="space-y-4 animate-fade-in">
          {/* Summary */}
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <h3 className="font-semibold text-indigo-700 mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" /> Analysis Summary
            </h3>
            <p className="text-sm text-slate-700">{summary}</p>
          </div>

          {/* Trigger Table */}
          {triggers && triggers.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h3 className="font-semibold text-slate-800 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-rose-500" />
                  Identified Triggers (Priority Order)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Priority</th>
                      <th className="px-4 py-2 text-left font-medium">Food</th>
                      <th className="px-4 py-2 text-left font-medium">Confidence</th>
                      <th className="px-4 py-2 text-left font-medium">Category</th>
                      <th className="px-4 py-2 text-left font-medium">Symptoms</th>
                      <th className="px-4 py-2 text-left font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {triggers.map((trigger, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            idx === 0 ? 'bg-rose-100 text-rose-700' :
                            idx === 1 ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {idx + 1}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {trigger.food}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getConfidenceBadge(trigger.confidence)}`}>
                            {getConfidenceIcon(trigger.confidence)}
                            {trigger.confidence}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {trigger.category}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {trigger.symptoms?.map((s, i) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {settings.triggerFoods.includes(trigger.food) ? (
                            <span className="inline-flex items-center text-xs text-emerald-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Added
                            </span>
                          ) : (
                            <button
                              onClick={() => addToTriggerFoods(trigger.food)}
                              className="inline-flex items-center text-xs text-teal-600 hover:text-teal-700 font-medium"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add to triggers
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {triggers[0]?.notes && (
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
                  <strong>Note:</strong> {triggers[0].notes}
                </div>
              )}
            </div>
          )}

          {/* Stress Impact */}
          {stressImpact && (
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <h4 className="font-semibold text-amber-800 mb-1 text-sm">Stress Impact</h4>
              <p className="text-sm text-amber-900/80">{stressImpact}</p>
            </div>
          )}

          {/* Recommendations */}
          {recommendations && recommendations.length > 0 && (
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <h4 className="font-semibold text-emerald-800 mb-3 text-sm">Recommendations</h4>
              <ol className="space-y-2">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start text-sm text-emerald-900/80">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 text-xs font-bold mr-2 flex-shrink-0">
                      {idx + 1}
                    </span>
                    {rec}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

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

      {renderAnalysis()}

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
