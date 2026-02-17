import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SimpleLanding from './pages/SimpleLanding';
import Dashboard from './pages/Dashboard';
import ResearchCopilot from './pages/ResearchCopilot';
import WeeklyPlanner from './pages/WeeklyPlanner';
import KnowledgeHub from './pages/KnowledgeHub';
import Meetings from './pages/Meetings';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SimpleLanding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/research" element={<ResearchCopilot />} />
                <Route path="/planner" element={<WeeklyPlanner />} />
                <Route path="/meetings" element={<Meetings />} />
                <Route path="/knowledge" element={<KnowledgeHub />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
