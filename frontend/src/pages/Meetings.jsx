import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Meetings = () => {
    const [meetings, setMeetings] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [meetingTitle, setMeetingTitle] = useState('');
    const [error, setError] = useState('');
    const [uploadedMeeting, setUploadedMeeting] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        loadMeetings();
    }, []);

    const loadMeetings = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/meetings/');
            const data = await response.json();
            setMeetings(data);
        } catch (error) {
            console.error('Failed to load meetings:', error);
            setError('Failed to connect to backend');
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setError('');
            // Auto-fill title from filename
            if (!meetingTitle) {
                setMeetingTitle(file.name.replace(/\.[^/.]+$/, ''));
            }
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file first');
            return;
        }

        if (!meetingTitle.trim()) {
            alert('Please enter a meeting title');
            return;
        }

        setUploading(true);
        setError('');
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch(`http://localhost:8000/api/v1/meetings/upload?title=${encodeURIComponent(meetingTitle)}`, {
                method: 'POST',
                body: formData,
                mode: 'cors'
            });

            const data = await response.json();

            if (response.ok) {
                setUploadedMeeting(data);
                setSelectedFile(null);
                setMeetingTitle('');
                document.getElementById('meeting-upload').value = '';
                loadMeetings();
            } else {
                setError(`Upload failed: ${data.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            setError(`Upload failed: ${error.message}`);
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
                        Meeting Intelligence
                    </h1>
                    <p style={{ color: '#a0a0a0', fontSize: '18px' }}>
                        Upload meeting transcripts and get AI-powered summaries and insights
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
                    border: '2px dashed rgba(79, 172, 254, 0.5)',
                    marginBottom: '40px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '60px', marginBottom: '20px' }}>💬</div>
                    <h2 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: '600' }}>
                        Upload Meeting Transcript
                    </h2>

                    <input
                        type="text"
                        value={meetingTitle}
                        onChange={(e) => setMeetingTitle(e.target.value)}
                        placeholder="Meeting Title (e.g., Team Standup - Feb 17)"
                        style={{
                            width: '100%',
                            maxWidth: '500px',
                            padding: '12px 20px',
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '16px',
                            marginBottom: '20px',
                            outline: 'none'
                        }}
                    />

                    <input
                        type="file"
                        accept=".txt,.doc,.docx"
                        onChange={handleFileSelect}
                        style={{
                            display: 'none'
                        }}
                        id="meeting-upload"
                    />

                    <label
                        htmlFor="meeting-upload"
                        style={{
                            display: 'inline-block',
                            padding: '12px 30px',
                            background: 'rgba(79, 172, 254, 0.2)',
                            border: '1px solid #4facfe',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            marginBottom: '20px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(79, 172, 254, 0.3)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(79, 172, 254, 0.2)'}
                    >
                        Choose Transcript File
                    </label>

                    {selectedFile && (
                        <div style={{ marginTop: '20px' }}>
                            <p style={{ color: '#4ade80', marginBottom: '10px' }}>
                                ✓ Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                            </p>
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                style={{
                                    padding: '12px 40px',
                                    background: uploading ? '#666' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
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
                        Supported formats: TXT, DOC, DOCX • Max size: 10MB
                    </p>
                </div>

                {/* Uploaded Meeting Display */}
                {uploadedMeeting && (
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
                        padding: '40px',
                        borderRadius: '16px',
                        border: '1px solid rgba(79, 172, 254, 0.3)',
                        marginBottom: '40px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                            <div>
                                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎉</div>
                                <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
                                    Meeting Uploaded Successfully!
                                </h2>
                                <p style={{ color: '#a0a0a0', fontSize: '16px' }}>
                                    {uploadedMeeting.title}
                                </p>
                            </div>
                            <button
                                onClick={() => setUploadedMeeting(null)}
                                style={{
                                    padding: '8px 16px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '6px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                ✕ Close
                            </button>
                        </div>

                        {uploadedMeeting.summary && (
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                padding: '24px',
                                borderRadius: '12px',
                                marginBottom: '20px'
                            }}>
                                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>📝</span> AI Summary
                                </h3>
                                <p style={{ color: '#e0e0e0', lineHeight: '1.8', fontSize: '16px', whiteSpace: 'pre-wrap' }}>
                                    {uploadedMeeting.summary}
                                </p>
                            </div>
                        )}

                        {uploadedMeeting.key_points && uploadedMeeting.key_points.length > 0 && (
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                padding: '24px',
                                borderRadius: '12px',
                                marginBottom: '20px'
                            }}>
                                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>🎯</span> Key Points
                                </h3>
                                <ul style={{ color: '#e0e0e0', lineHeight: '1.8', fontSize: '16px', paddingLeft: '20px' }}>
                                    {uploadedMeeting.key_points.map((point, idx) => (
                                        <li key={idx} style={{ marginBottom: '8px' }}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {uploadedMeeting.action_items && uploadedMeeting.action_items.length > 0 && (
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                padding: '24px',
                                borderRadius: '12px'
                            }}>
                                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>✅</span> Action Items
                                </h3>
                                <ul style={{ color: '#e0e0e0', lineHeight: '1.8', fontSize: '16px', paddingLeft: '20px' }}>
                                    {uploadedMeeting.action_items.map((item, idx) => (
                                        <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Meetings List */}
                <div>
                    <h2 style={{ fontSize: '28px', marginBottom: '24px', fontWeight: '600' }}>
                        Your Meetings ({meetings.length})
                    </h2>

                    {meetings.length === 0 ? (
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '60px',
                            borderRadius: '16px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.5 }}>💬</div>
                            <p style={{ color: '#a0a0a0', fontSize: '18px' }}>
                                No meetings uploaded yet. Upload your first transcript to get started!
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {meetings.map((meeting) => (
                                <div
                                    key={meeting.id}
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
                                                {meeting.title}
                                            </h3>
                                            {meeting.participants && meeting.participants.length > 0 && (
                                                <p style={{ color: '#a0a0a0', fontSize: '14px', marginBottom: '12px' }}>
                                                    Participants: {meeting.participants.join(', ')}
                                                </p>
                                            )}
                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    background: meeting.processed === 2 ? 'rgba(74, 222, 128, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                                                    color: meeting.processed === 2 ? '#4ade80' : '#fbbf24',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    fontWeight: '600'
                                                }}>
                                                    {meeting.processed === 2 ? '✓ Processed' : '⏳ Pending'}
                                                </span>
                                                <span style={{ color: '#666', fontSize: '12px' }}>
                                                    {new Date(meeting.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {meeting.processed !== 2 && (
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            setProcessingId(meeting.id);
                                                            const response = await fetch(`http://localhost:8000/api/v1/meetings/${meeting.id}/process`, {
                                                                method: 'POST'
                                                            });
                                                            const data = await response.json();
                                                            setProcessingId(null);
                                                            loadMeetings();
                                                            setUploadedMeeting(data);
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        } catch (error) {
                                                            console.error('Failed to process meeting:', error);
                                                            setError('Failed to process meeting');
                                                            setProcessingId(null);
                                                        }
                                                    }}
                                                    disabled={processingId === meeting.id}
                                                    style={{
                                                        padding: '8px 20px',
                                                        background: processingId === meeting.id ? '#666' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        color: 'white',
                                                        fontSize: '14px',
                                                        fontWeight: '600',
                                                        cursor: processingId === meeting.id ? 'not-allowed' : 'pointer'
                                                    }}
                                                >
                                                    {processingId === meeting.id ? '🤖 Processing...' : '🤖 Process with AI'}
                                                </button>
                                            )}
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const response = await fetch(`http://localhost:8000/api/v1/meetings/${meeting.id}`);
                                                        const data = await response.json();

                                                        if (!data.summary && (!data.key_points || data.key_points.length === 0)) {
                                                            setError('This meeting has not been processed yet. Click "Process with AI" first.');
                                                            setTimeout(() => setError(''), 4000);
                                                        } else {
                                                            setUploadedMeeting(data);
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        }
                                                    } catch (error) {
                                                        console.error('Failed to load meeting details:', error);
                                                        setError('Failed to load meeting details');
                                                    }
                                                }}
                                                style={{
                                                    padding: '8px 20px',
                                                    background: 'rgba(79, 172, 254, 0.2)',
                                                    border: '1px solid #4facfe',
                                                    borderRadius: '6px',
                                                    color: '#4facfe',
                                                    fontSize: '14px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Features Info */}
                <div style={{ marginTop: '60px', padding: '40px', background: 'rgba(79, 172, 254, 0.1)', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: '600' }}>
                        What You Get
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        {[
                            { icon: '🤖', title: 'AI Summaries', desc: 'Automatic meeting summaries and key takeaways' },
                            { icon: '🎯', title: 'Action Items', desc: 'Extract action items and decisions' },
                            { icon: '👥', title: 'Participants', desc: 'Track attendees and contributions' },
                            { icon: '🔍', title: 'Searchable', desc: 'Find content across all meetings' }
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
        </div >
    );
};

export default Meetings;
