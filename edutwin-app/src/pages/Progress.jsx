import { useState } from 'react';
import { TrendingUp, BarChart3, Activity, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { performanceHistory, weeklyActivity } from '../data/mockData';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const timeFilters = ['Week', 'Month', 'All Time'];

export default function Progress() {
  const { subjects, stats } = useApp();
  const [filter, setFilter] = useState('All Time');

  const getFilteredPerformance = () => {
    switch (filter) {
      case 'Week': return performanceHistory.slice(-3);
      case 'Month': return performanceHistory.slice(-5);
      default: return performanceHistory;
    }
  };

  const getFilteredActivity = () => {
    switch (filter) {
      case 'Week': return weeklyActivity.slice(0, 5);
      case 'Month': return weeklyActivity;
      default: return weeklyActivity;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-white border border-surface-200 rounded-xl shadow-elevated p-3 text-xs">
        <p className="font-semibold text-surface-800 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: <span className="font-semibold">{p.value}%</span>
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary-500" /> Progress Analytics
          </h1>
          <p className="text-surface-500 mt-1">Track your learning journey with detailed insights.</p>
        </div>
        <div className="flex gap-1.5 bg-surface-100 p-1 rounded-xl">
          {timeFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                ${filter === f ? 'bg-white text-primary-700 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Performance Over Time */}
        <div className="card">
          <h3 className="section-title mb-4">Performance Over Time</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getFilteredPerformance()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="math" name="Mathematics" stroke="#6366F1" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="physics" name="Physics" stroke="#14B8A6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="cs" name="Computer Science" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="english" name="English" stroke="#EC4899" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Mastery */}
        <div className="card">
          <h3 className="section-title mb-4">Subject Mastery</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjects.map(s => ({ name: s.name.substring(0, 8), mastery: s.mastery, fill: s.color }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="mastery" name="Mastery" radius={[6, 6, 0, 0]}>
                  {subjects.map((s, i) => (
                    <rect key={i} fill={s.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Learning Activity */}
        <div className="card">
          <h3 className="section-title mb-4">Learning Activity</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getFilteredActivity()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip />
                <Area
                  type="monotone" dataKey="hours" name="Hours"
                  stroke="#6366F1" fill="#6366F1" fillOpacity={0.15} strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic Mastery Progress Bars */}
        <div className="card">
          <h3 className="section-title mb-4">Topic Mastery</h3>
          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
            {subjects.flatMap(s => s.topics.map(t => ({ ...t, subjectColor: s.color, subjectName: s.name })))
              .sort((a, b) => a.mastery - b.mastery)
              .slice(0, 12)
              .map((topic) => (
                <div key={topic.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-surface-700 truncate block">{topic.name}</span>
                      <span className="text-[10px] text-surface-400">{topic.subjectName}</span>
                    </div>
                    <span className="text-xs font-bold text-surface-600 ml-2">{topic.mastery}%</span>
                  </div>
                  <div className="w-full bg-surface-100 rounded-full h-1.5">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${topic.mastery}%`, backgroundColor: topic.subjectColor }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
