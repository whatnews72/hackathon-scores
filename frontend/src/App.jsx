import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TeacherConsole from './pages/TeacherConsole';
import StudentScoring from './pages/StudentScoring';
import ScreenDisplay from './pages/ScreenDisplay';
import FinalResults from './pages/FinalResults';
import TopBar from './components/Hackathon/TopBar';
import Toast from './components/Hackathon/Toast';
import { useHackathonSocket } from './hooks/useHackathonSocket';

function App() {
  const { state, connected } = useHackathonSocket();
  const [currentRole, setCurrentRole] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('hk.role');
    setCurrentRole(saved || 'teacher');
  }, []);

  if (!currentRole) return null;

  return (
    <>
      <TopBar title={state.title} connected={connected} />
      <Routes>
        <Route path="/" element={<Navigate to={`/${currentRole}`} replace />} />
        <Route path="/teacher" element={<TeacherConsole />} />
        <Route path="/student" element={<StudentScoring />} />
        <Route path="/screen" element={<ScreenDisplay />} />
        <Route path="/results" element={<FinalResults />} />
      </Routes>
      <Toast />
    </>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter;
