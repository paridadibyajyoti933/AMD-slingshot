import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SimpleLanding from './pages/SimpleLanding';
import Dashboard from './pages/Dashboard';
import ResearchCopilot from './pages/ResearchCopilot';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SimpleLanding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/research" element={<ResearchCopilot />} />
                <Route path="/planner" element={<div style={{ padding: '40px', color: 'white', background: '#1a1a2e', minHeight: '100vh' }}><h1>Weekly Planner Coming Soon!</h1><a href="/dashboard" style={{ color: '#667eea' }}>← Back to Dashboard</a></div>} />
                <Route path="/meetings" element={<div style={{ padding: '40px', color: 'white', background: '#1a1a2e', minHeight: '100vh' }}><h1>Meetings Coming Soon!</h1><a href="/dashboard" style={{ color: '#667eea' }}>← Back to Dashboard</a></div>} />
                <Route path="/knowledge" element={<div style={{ padding: '40px', color: 'white', background: '#1a1a2e', minHeight: '100vh' }}><h1>Knowledge Hub Coming Soon!</h1><a href="/dashboard" style={{ color: '#667eea' }}>← Back to Dashboard</a></div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
