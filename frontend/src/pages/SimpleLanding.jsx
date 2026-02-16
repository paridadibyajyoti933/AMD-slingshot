import React from 'react';
import { Link } from 'react-router-dom';

const SimpleLanding = () => {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            color: 'white',
            padding: '40px 20px',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: '60px', marginBottom: '20px', fontWeight: 'bold' }}>
                    DeepWork OS
                </h1>
                <p style={{ fontSize: '24px', color: '#a0a0a0', marginBottom: '40px' }}>
                    Your AI-Powered Productivity Operating System
                </p>

                <div style={{ marginBottom: '60px' }}>
                    <Link
                        to="/dashboard"
                        style={{
                            display: 'inline-block',
                            padding: '15px 40px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontSize: '18px',
                            fontWeight: '600'
                        }}
                    >
                        Get Started →
                    </Link>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '30px',
                    marginTop: '80px'
                }}>
                    {[
                        { title: 'Research Copilot', desc: 'AI-powered PDF analysis and citations' },
                        { title: 'Smart Planner', desc: 'Optimize your schedule with AI' },
                        { title: 'Meeting Summarizer', desc: 'Transform transcripts into insights' },
                        { title: 'Knowledge Hub', desc: 'Semantic search across all content' }
                    ].map((feature, idx) => (
                        <div key={idx} style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '30px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>{feature.title}</h3>
                            <p style={{ color: '#a0a0a0', fontSize: '14px' }}>{feature.desc}</p>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '80px', padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                    <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>✅ Backend Running!</h2>
                    <p style={{ color: '#a0a0a0', marginBottom: '20px' }}>
                        API Server: <a href="http://localhost:8000/docs" target="_blank" style={{ color: '#667eea' }}>http://localhost:8000/docs</a>
                    </p>
                    <p style={{ color: '#4ade80', fontSize: '14px' }}>
                        🎉 DeepWork OS is ready to use!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SimpleLanding;
