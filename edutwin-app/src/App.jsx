import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MyEduTwin from './pages/MyEduTwin';
import Learn from './pages/Learn';
import Assessments from './pages/Assessments';
import Progress from './pages/Progress';
import AITutor from './pages/AITutor';
import StudyPlanner from './pages/StudyPlanner';
import CareerPath from './pages/CareerPath';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* App Experience */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/edutwin" element={<MyEduTwin />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/tutor" element={<AITutor />} />
            <Route path="/planner" element={<StudyPlanner />} />
            <Route path="/career" element={<CareerPath />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
