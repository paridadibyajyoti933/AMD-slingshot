import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({
        tasks: 0,
        papers: 0,
        meetings: 0,
        notes: 0
    });

    useEffect(() => {
        // Fetch stats from backend
        fetch('http://localhost:8000/api/v1/knowledge/stats')
            .then(res => res.json())
            .then(data => {
                setStats({
                    tasks: 0,
                    papers: data.research_papers || 0,
                    meetings: data.meetings || 0,
                    notes: data.notes || 0
                });
            })
            .catch(err => console.error('Failed to load stats:', err));
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            color: 'white',
            padding: '40px'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '48px', marginBottom: '10px', fontWeight: 'bold' }}>
                        Dashboard
                    </h1>
                    <p style={{ color: '#a0a0a0', fontSize: '18px' }}>
                        Your AI-powered productivity overview
                    </p>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '24px',
                    marginBottom: '60px'
                }}>
                    {[
                        { label: 'Active Tasks', value: stats.tasks, color: '#667eea', icon: '✓' },
                        { label: 'Research Papers', value: stats.papers, color: '#764ba2', icon: '📄' },
                        { label: 'Meetings', value: stats.meetings, color: '#f093fb', icon: '💬' },
                        { label: 'Notes', value: stats.notes, color: '#4facfe', icon: '📝' }
                    ].map((stat, idx) => (
                        <div key={idx} style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '30px',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ color: '#a0a0a0', fontSize: '14px', marginBottom: '8px' }}>
                                        {stat.label}
                                    </p>
                                    <p style={{ fontSize: '36px', fontWeight: 'bold', color: stat.color }}>
                                        {stat.value}
                                    </p>
                                </div>
                                <div style={{
                                    fontSize: '40px',
                                    opacity: 0.3
                                }}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div style={{ marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '28px', marginBottom: '24px', fontWeight: '600' }}>
                        Quick Actions
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '20px'
                    }}>
                        {[
                            {
                                title: 'Upload Research Paper',
                                desc: 'Get AI-powered summaries and citations',
                                icon: '📚',
                                link: '/research',
                                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            },
                            {
                                title: 'Create Task',
                                desc: 'Add to your weekly planner',
                                icon: '📅',
                                link: '/planner',
                                gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                            },
                            {
                                title: 'Add Meeting',
                                desc: 'Summarize transcripts with AI',
                                icon: '🎯',
                                link: '/meetings',
                                gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                            },
                            {
                                title: 'Search Knowledge',
                                desc: 'Semantic search across all content',
                                icon: '🔍',
                                link: '/knowledge',
                                gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                            }
                        ].map((action, idx) => (
                            <Link
                                key={idx}
                                to={action.link}
                                style={{
                                    background: action.gradient,
                                    padding: '30px',
                                    borderRadius: '16px',
                                    textDecoration: 'none',
                                    color: 'white',
                                    display: 'block',
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{action.icon}</div>
                                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                                    {action.title}
                                </h3>
                                <p style={{ fontSize: '14px', opacity: 0.9 }}>
                                    {action.desc}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* System Status */}
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '30px',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: '600' }}>
                        System Status
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div>
                            <p style={{ color: '#a0a0a0', fontSize: '14px', marginBottom: '8px' }}>Backend API</p>
                            <p style={{ color: '#4ade80', fontSize: '16px', fontWeight: '600' }}>✓ Running</p>
                        </div>
                        <div>
                            <p style={{ color: '#a0a0a0', fontSize: '14px', marginBottom: '8px' }}>Database</p>
                            <p style={{ color: '#4ade80', fontSize: '16px', fontWeight: '600' }}>✓ Connected (SQLite)</p>
                        </div>
                        <div>
                            <p style={{ color: '#a0a0a0', fontSize: '14px', marginBottom: '8px' }}>AI Model</p>
                            <p style={{ color: '#4ade80', fontSize: '16px', fontWeight: '600' }}>✓ Ollama (Mistral)</p>
                        </div>
                        <div>
                            <p style={{ color: '#a0a0a0', fontSize: '14px', marginBottom: '8px' }}>API Docs</p>
                            <a
                                href="http://localhost:8000/docs"
                                target="_blank"
                                style={{ color: '#667eea', fontSize: '16px', fontWeight: '600', textDecoration: 'none' }}
                            >
                                → View Docs
                            </a>
                        </div>
                    </div>
                </div>

                {/* Back to Landing */}
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <Link
                        to="/"
                        style={{
                            color: '#a0a0a0',
                            textDecoration: 'none',
                            fontSize: '14px'
                        }}
                    >
                        ← Back to Landing Page
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
