import { useState } from 'react';
import { BookOpen, Clock, BarChart3, CheckCircle, ChevronRight, ArrowLeft, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { topicContent } from '../data/mockData';
import Modal from '../components/ui/Modal';

function TopicCard({ topic, subjectColor, onStart }) {
  const statusStyles = {
    'Mastered': 'badge-success',
    'Almost Done': 'badge-primary',
    'In Progress': 'badge-warning',
    'Needs Revision': 'badge-danger',
  };

  return (
    <div className="card hover-lift group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-surface-800">{topic.name}</h3>
        <span className={`badge text-[10px] ${statusStyles[topic.status] || 'badge-warning'}`}>
          {topic.status}
        </span>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-surface-500">
          <BarChart3 className="w-3 h-3" />
          <span>Mastery: {topic.mastery}%</span>
        </div>
        <div className="w-full bg-surface-100 rounded-full h-1.5">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${topic.mastery}%`, backgroundColor: subjectColor }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-surface-400">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{topic.time}</span>
          <span>{topic.difficulty}</span>
        </div>
      </div>
      <button onClick={onStart} className="btn-primary w-full text-xs py-2">
        Start Learning
      </button>
    </div>
  );
}

function TopicLearningView({ topic, subjectId, onClose }) {
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const { updateTopicMastery, addToast } = useApp();

  const content = topicContent[topic.id] || topicContent.quadratic;
  const pq = content.practiceQuestion;

  const handleCheck = () => {
    if (selected === null) return;
    setShowResult(true);
    const isCorrect = selected === pq.correct;
    if (isCorrect) {
      updateTopicMastery(subjectId, topic.id, 5);
      addToast('Correct! Your mastery has increased.', 'success');
    } else {
      addToast('Not quite right. Review the explanation below.', 'info');
    }
    setAnswered(true);
  };

  return (
    <div className="space-y-6">
      {/* Concept */}
      <div>
        <h3 className="text-sm font-semibold text-surface-800 mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary-500" /> Concept
        </h3>
        <div className="p-4 bg-surface-50 rounded-xl text-sm text-surface-700 whitespace-pre-line leading-relaxed">
          {content.concept}
        </div>
      </div>

      {/* Example */}
      <div>
        <h3 className="text-sm font-semibold text-surface-800 mb-2">Worked Example</h3>
        <div className="p-4 bg-primary-50/50 rounded-xl text-sm text-surface-700 whitespace-pre-line leading-relaxed font-mono">
          {content.example}
        </div>
      </div>

      {/* Key Formulas */}
      <div>
        <h3 className="text-sm font-semibold text-surface-800 mb-2">Key Formulas</h3>
        <div className="space-y-1.5">
          {content.formulas.map((f, i) => (
            <div key={i} className="flex items-center gap-2 p-2.5 bg-accent-50 rounded-lg">
              <CheckCircle className="w-3.5 h-3.5 text-accent-600 flex-shrink-0" />
              <span className="text-sm text-surface-700 font-mono">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Question */}
      <div className="border-t border-surface-200 pt-5">
        <h3 className="text-sm font-semibold text-surface-800 mb-3">Practice Question</h3>
        <p className="text-sm text-surface-700 mb-4">{pq.question}</p>
        <div className="space-y-2 mb-4">
          {pq.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => { if (!answered) setSelected(i); }}
              disabled={answered}
              className={`w-full text-left p-3 rounded-xl text-sm border transition-all duration-200
                ${answered && i === pq.correct
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : answered && i === selected && i !== pq.correct
                    ? 'bg-red-50 border-red-300 text-red-800'
                    : selected === i
                      ? 'bg-primary-50 border-primary-300 text-primary-800'
                      : 'bg-white border-surface-200 text-surface-700 hover:border-primary-300 hover:bg-primary-50/30'
                }
              `}
            >
              <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          ))}
        </div>
        {!answered ? (
          <button onClick={handleCheck} disabled={selected === null} className="btn-primary w-full">
            Check Answer
          </button>
        ) : (
          <div className={`p-4 rounded-xl text-sm ${
            selected === pq.correct
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border border-amber-200 text-amber-800'
          }`}>
            <p className="font-semibold mb-1">
              {selected === pq.correct ? '✅ Correct!' : '❌ Not quite right'}
            </p>
            <p className="leading-relaxed">
              {selected === pq.correct ? pq.explanation : pq.misconception}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Learn() {
  const { subjects } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  const filteredSubjects = activeCategory === 'all'
    ? subjects
    : subjects.filter(s => s.id === activeCategory);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary-500" /> Learn
        </h1>
        <p className="text-surface-500 mt-1">Explore topics and build mastery at your own pace.</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200
            ${activeCategory === 'all'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'bg-white text-surface-600 border border-surface-200 hover:bg-surface-50'
            }`}
        >
          All Subjects
        </button>
        {subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveCategory(s.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200
              ${activeCategory === s.id
                ? 'text-white shadow-sm'
                : 'bg-white text-surface-600 border border-surface-200 hover:bg-surface-50'
              }`}
            style={activeCategory === s.id ? { backgroundColor: s.color } : {}}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      {filteredSubjects.map((subject) => (
        <div key={subject.id}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }} />
            <h2 className="text-base font-semibold text-surface-800">{subject.name}</h2>
            <span className="text-xs text-surface-400">({subject.mastery}% mastery)</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {subject.topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                subjectColor={subject.color}
                onStart={() => { setSelectedTopic(topic); setSelectedSubjectId(subject.id); }}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Topic Learning Modal */}
      <Modal
        isOpen={!!selectedTopic}
        onClose={() => { setSelectedTopic(null); setSelectedSubjectId(null); }}
        title={selectedTopic?.name || 'Learn'}
        size="lg"
      >
        {selectedTopic && (
          <TopicLearningView
            topic={selectedTopic}
            subjectId={selectedSubjectId}
            onClose={() => { setSelectedTopic(null); setSelectedSubjectId(null); }}
          />
        )}
      </Modal>
    </div>
  );
}
