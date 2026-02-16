import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ResearchCopilot = () => {
    const [papers, setPapers] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadPapers();
    }, []);

    const loadPapers = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/research/');
            const data = await response.json();
            setPapers(data);
        } catch (error) {
            console.error('Failed to load papers:', error);
            setError('Failed to connect to backend');
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
            setError('');
        } else {
            alert('Please select a PDF file');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a PDF file first');
            return;
        }

        setUploading(true);
        setError('');
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            console.log('Uploading to: http://localhost:8000/api/v1/research/upload');
            const response = await fetch('http://localhost:8000/api/v1/research/upload', {
                method: 'POST',
                body: formData,
                mode: 'cors'
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok) {
                let message = `✅ Paper uploaded successfully!

Title: ${data.title}
Paper ID: ${data.paper_id}
Status: ${data.status}`;
                
                if (data.text_length) {
                    message += `
Text extracted: ${data.text_length} characters`;
                }
                
                if (data.preview) {
                    message += `

📄 Text Preview:
${data.preview}`;
                }
                
                if (data.summary) {
                    message += `

📝 AI Summary:
${data.summary}`;
                }
                
                if (data.key_contributions) {
                    message += `

🎯 Key Contributions:
${data.key_contributions}`;
                }
                
                if (data.note) {
                    message += `

⚠️ ${data.note}`;
                }
                
                alert(message);
                setSelectedFile(null);
                document.getElementById('pdf-upload').value = '';
                loadPapers();
            } else {
                setError(`Upload failed: ${data.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            setError(`Upload failed: ${error.message}. Check console for details.`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            color: 'white',
            padding: '40px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '40px' }}>
                    <Link to="/dashboard" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}>
                        ← Back to Dashboard
                    </Link>
                    <h1 style={{ fontSize: '48px', marginTop: '20px', marginBottom: '10px', fontWeight: 'bold' }}>
                        Research Copilot
                    </h1>
                    <p style={{ color: '#a0a0a0', fontSize: '18px' }}>
                        Upload PDFs and get AI-powered summaries, citations, and insights
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid #ef4444',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        color: '#fca5a5'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Upload Section */}
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '40px',
                    borderRadius: '16px',
                    border: '2px dashed rgba(102, 126, 234, 0.5)',
                    marginBottom: '40px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '60px', marginBottom: '20px' }}>📄</div>
                    <h2 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: '600' }}>
                        Upload Research Paper
                    </h2>

                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        style={{
                            display: 'none'
                        }}
                        id="pdf-upload"
                    />

                    <label
                        htmlFor="pdf-upload"
                        style={{
                            display: 'inline-block',
                            padding: '12px 30px',
                            background: 'rgba(102, 126, 234, 0.2)',
                            border: '1px solid #667eea',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            marginBottom: '20px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.3)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'}
                    >
                        Choose PDF File
                    </label>

                    {selectedFile && (
                        <div style={{ marginTop: '20px' }}>
                            <p style={{ color: '#4ade80', marginBottom: '10px' }}>
                                ✓ Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                style={{
                                    padding: '12px 40px',
                                    background: uploading ? '#666' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: uploading ? 'not-allowed' : 'pointer',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => !uploading && (e.currentTarget.style.transform = 'scale(1.05)')}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                {uploading ? 'Uploading...' : 'Upload & Process'}
                            </button>
                        </div>
                    )}

                    <p style={{ marginTop: '20px', color: '#666', fontSize: '12px' }}>
                        Backend: http://localhost:8000 • Max size: 50MB
                    </p>
                </div>

                {/* Papers List */}
                <div>
                    <h2 style={{ fontSize: '28px', marginBottom: '24px', fontWeight: '600' }}>
                        Your Papers ({papers.length})
                    </h2>

                    {papers.length === 0 ? (
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '60px',
                            borderRadius: '16px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>📚</div>
                            <p style={{ color: '#a0a0a0', fontSize: '18px' }}>
                                No papers uploaded yet. Upload your first PDF to get started!
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {papers.map((paper) => (
                                <div
                                    key={paper.id}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        padding: '24px',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                                                {paper.title}
                                            </h3>
                                            {paper.authors && paper.authors.length > 0 && (
                                                <p style={{ color: '#a0a0a0', fontSize: '14px', marginBottom: '12px' }}>
                                                    {paper.authors.join(', ')}
                                                </p>
                                            )}
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    background: paper.processed === 2 ? 'rgba(74, 222, 128, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                                                    color: paper.processed === 2 ? '#4ade80' : '#fbbf24',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    fontWeight: '600'
                                                }}>
                                                    {paper.processed === 2 ? '✓ Processed' : '⏳ Processing'}
                                                </span>
                                                <span style={{ color: '#666', fontSize: '12px' }}>
                                                    {new Date(paper.uploaded_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            style={{
                                                padding: '8px 20px',
                                                background: 'rgba(102, 126, 234, 0.2)',
                                                border: '1px solid #667eea',
                                                borderRadius: '6px',
                                                color: '#667eea',
                                                fontSize: '14px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Features Info */}
                <div style={{ marginTop: '60px', padding: '40px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: '600' }}>
                        What You Get
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        {[
                            { icon: '🤖', title: 'AI Summaries', desc: 'Abstract, methodology, and key contributions' },
                            { icon: '📝', title: 'Auto Citations', desc: 'APA, IEEE, and BibTeX formats' },
                            { icon: '🔍', title: 'Semantic Search', desc: 'Find relevant content across all papers' },
                            { icon: '📊', title: 'Key Insights', desc: 'Equations, limitations, and findings' }
                        ].map((feature, idx) => (
                            <div key={idx}>
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{feature.icon}</div>
                                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{feature.title}</h4>
                                <p style={{ color: '#a0a0a0', fontSize: '14px' }}>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResearchCopilot;

