'use client';

import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Brain, Battery, AlertTriangle, Plus, X, ChevronDown } from 'lucide-react';
import { useAppState, AIPStage } from '@/lib/useAppState';
import { useAuth } from '@/lib/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const { logs, settings, updateSettings } = useAppState();
  const [newTrigger, setNewTrigger] = useState('');
  const [showStageSelector, setShowStageSelector] = useState(false);

  const chartData = useMemo(() => {
    const sorted = [...logs].sort((a, b) => a.timestamp - b.timestamp).slice(-7);
    return sorted.map((log) => ({
      date: new Date(log.timestamp).toLocaleDateString(undefined, { weekday: 'short' }),
      mood: log.mood,
      pain: log.symptoms.pain,
      bloating: log.symptoms.bloating,
    }));
  }, [logs]);

  const recentAvgMood = useMemo(() => {
    if (logs.length === 0) return 0;
    const sum = logs.slice(-3).reduce((acc, curr) => acc + curr.mood, 0);
    return (sum / Math.min(logs.length, 3)).toFixed(1);
  }, [logs]);

  const handleAddTrigger = (e) => {
    e.preventDefault();
    if (newTrigger.trim() && !settings.triggerFoods.includes(newTrigger.trim())) {
      updateSettings({
        triggerFoods: [...settings.triggerFoods, newTrigger.trim()],
      });
      setNewTrigger('');
    }
  };

  const removeTrigger = (trigger) => {
    updateSettings({
      triggerFoods: settings.triggerFoods.filter((t) => t !== trigger),
    });
  };

  const displayName = user?.name || settings.name;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">Hello, {displayName}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowStageSelector(!showStageSelector)}
                className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm transition-colors flex items-center"
              >
                Phase: {settings.currentStage}
                <ChevronDown className="w-3 h-3 ml-2 opacity-70" />
              </button>

              {showStageSelector && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl p-2 w-48 z-50 animate-fade-in text-slate-800">
                  {Object.values(AIPStage).map((stage) => (
                    <button
                      key={stage}
                      onClick={() => {
                        updateSettings({ currentStage: stage });
                        setShowStageSelector(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-teal-50 ${
                        settings.currentStage === stage
                          ? 'text-teal-600 font-bold bg-teal-50'
                          : 'text-slate-600'
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-sm opacity-90">
              Day {Math.floor((Date.now() - settings.startDate) / (1000 * 60 * 60 * 24))} of your journey
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <Activity className="text-rose-500 w-6 h-6 mb-2" />
          <span className="text-2xl font-bold text-slate-800">{recentAvgMood}</span>
          <span className="text-xs text-slate-500">Avg Mood</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <Brain className="text-indigo-500 w-6 h-6 mb-2" />
          <span className="text-2xl font-bold text-slate-800">{logs.length}</span>
          <span className="text-xs text-slate-500">Days Logged</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <Battery className="text-emerald-500 w-6 h-6 mb-2" />
          <span className="text-2xl font-bold text-slate-800">
            {logs.length > 0 ? 10 - logs[logs.length - 1].stress : '-'}
          </span>
          <span className="text-xs text-slate-500">Energy</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Wellness Trends */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Wellness Trends</h2>
          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#0d9488"
                    strokeWidth={3}
                    dot={{ fill: '#0d9488', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bloating"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                Log data to see trends
              </div>
            )}
          </div>
        </div>

        {/* Trigger Management */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center mb-4 text-rose-500">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-semibold text-slate-800">My Triggers</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Track foods that you have identified as triggers during your Reintroduction phase.
          </p>

          <div className="flex-1 overflow-y-auto mb-4 space-y-2 max-h-48">
            {settings.triggerFoods.length === 0 && (
              <p className="text-sm text-slate-400 italic text-center py-4">No triggers added yet.</p>
            )}
            {settings.triggerFoods.map((food, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-rose-50 px-3 py-2 rounded-lg text-sm text-rose-800"
              >
                <span>{food}</span>
                <button onClick={() => removeTrigger(food)} className="text-rose-400 hover:text-rose-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddTrigger} className="relative mt-auto">
            <input
              type="text"
              value={newTrigger}
              onChange={(e) => setNewTrigger(e.target.value)}
              placeholder="Add trigger (e.g., Dairy)"
              className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
            <button
              type="submit"
              disabled={!newTrigger}
              className="absolute right-1 top-1 p-1 bg-rose-500 text-white rounded-md hover:bg-rose-600 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

