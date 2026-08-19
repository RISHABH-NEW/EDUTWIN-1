import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Flame, BookCheck, Clock, Brain, ArrowRight,
  Sparkles, ChevronRight, BookOpen, Play,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { recommendations, aiInsight } from '../data/mockData';
import Modal from '../components/ui/Modal';

function StatCard({ icon: Icon, label, value, suffix, color, bgColor }) {
  return (
    <div className="card hover-lift group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-surface-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-surface-900 mt-1">
            {value}<span className="text-base font-medium text-surface-400 ml-1">{suffix}</span>
          </p>
        </div>
        <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center
          group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
  );
}

function SubjectCard({ subject, onClick }) {
  const getStatusColor = (mastery) => {
    if (mastery >= 85) return 'bg-emerald-500';
    if (mastery >= 70) return 'bg-primary-500';
    if (mastery >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div onClick={onClick} className="card-interactive group">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-surface-800">{subject.name}</h3>
        <span className="text-sm font-bold" style={{ color: subject.color }}>{subject.mastery}%</span>
      </div>
      <div className="w-full bg-surface-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${getStatusColor(subject.mastery)}`}
          style={{ width: `${subject.mastery}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-surface-400">{subject.topics.length} topics</span>
        <ChevronRight className="w-4 h-4 text-surface-300 group-hover:text-primary-500
          group-hover:translate-x-1 transition-all duration-200" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { stats, subjects, profile } = useApp();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900">
          {getGreeting()}, {profile.name.split(' ')[0]} 👋
        </h1>
        <p className="text-surface-500 mt-1">
          Your EduTwin has analyzed your recent learning activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Overall Mastery"
          value={stats.overallMastery}
          suffix="%"
          color="text-primary-600"
          bgColor="bg-primary-50"
        />
        <StatCard
          icon={Flame}
          label="Current Streak"
          value={stats.currentStreak}
          suffix="days"
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
        <StatCard
          icon={BookCheck}
          label="Topics Mastered"
          value={stats.topicsMastered}
          suffix=""
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          icon={Clock}
          label="Learning Hours"
          value={stats.learningHours}
          suffix="hrs"
          color="text-accent-600"
          bgColor="bg-accent-50"
        />
      </div>

      {/* Subject Performance */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title">Subject Performance</h2>
            <p className="section-subtitle">Click a subject for detailed insights</p>
          </div>
          <button onClick={() => navigate('/progress')} className="btn-ghost text-xs">
            View All
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.slice(0, 4).map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onClick={() => setSelectedSubject(subject)}
            />
          ))}
        </div>
      </div>

      {/* AI Insight + Recommendations */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* AI Insight */}
        <div className="lg:col-span-3 card border-primary-100 bg-gradient-to-br from-primary-50/50 to-accent-50/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-surface-900 text-sm">AI Insight</h3>
              <p className="text-[10px] text-surface-400 uppercase tracking-wide">Powered by EduTwin AI</p>
            </div>
          </div>
          <p className="text-sm text-surface-700 leading-relaxed mb-4">{aiInsight.text}</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => navigate('/learn')} className="btn-primary text-xs py-2">
              <BookOpen className="w-3.5 h-3.5 mr-1.5 inline" />
              {aiInsight.action1}
            </button>
            <button onClick={() => navigate('/assessments')} className="btn-accent text-xs py-2">
              <Play className="w-3.5 h-3.5 mr-1.5 inline" />
              {aiInsight.action2}
            </button>
          </div>
        </div>

        {/* Recommendations */}
        <div className="lg:col-span-2">
          <h3 className="section-title mb-3">Recommended for You</h3>
          <div className="space-y-2.5">
            {recommendations.map((rec) => (
              <div key={rec.id} className="card-interactive flex items-center gap-3 !p-3.5">
                <div className={`w-2 h-2 rounded-full flex-shrink-0
                  ${rec.priority === 'high' ? 'bg-red-500' : rec.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-800 truncate">{rec.title}</p>
                  <p className="text-xs text-surface-400 truncate">{rec.subject}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (rec.type === 'quiz') navigate('/assessments');
                    else navigate('/learn');
                  }}
                  className="p-1.5 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100
                    transition-colors flex-shrink-0"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Detail Modal */}
      <Modal
        isOpen={!!selectedSubject}
        onClose={() => setSelectedSubject(null)}
        title={selectedSubject?.name}
        size="md"
      >
        {selectedSubject && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-surface-50 rounded-xl">
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: selectedSubject.color }}>
                  {selectedSubject.mastery}%
                </p>
                <p className="text-xs text-surface-400 mt-1">Overall Mastery</p>
              </div>
              <div className="flex-1 text-sm text-surface-600">
                <p>{selectedSubject.topics.length} topics total</p>
                <p>{selectedSubject.topics.filter(t => t.status === 'Mastered').length} mastered</p>
                <p>{selectedSubject.topics.filter(t => t.status === 'Needs Revision').length} need revision</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-surface-800 mb-3">Topics</h4>
              <div className="space-y-2">
                {selectedSubject.topics.map((topic) => (
                  <div key={topic.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-surface-800">{topic.name}</p>
                      <p className="text-xs text-surface-400">{topic.difficulty} · {topic.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-surface-700">{topic.mastery}%</p>
                      <span className={`badge text-[10px] ${
                        topic.status === 'Mastered' ? 'badge-success' :
                        topic.status === 'Needs Revision' ? 'badge-danger' :
                        'badge-warning'
                      }`}>{topic.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => { setSelectedSubject(null); navigate('/learn'); }} className="btn-primary w-full">
              Start Learning
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
