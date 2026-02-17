import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import theme from '../styles/theme';

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
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setError('');
            if (!meetingTitle) {
                setMeetingTitle(file.name.replace(/\.[^/.]+$/, ''));
            }
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !meetingTitle.trim()) return;

        setUploading(true);
        setError('');
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch(`http://localhost:8000/api/v1/meetings/upload?title=${encodeURIComponent(meetingTitle)}`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setSelectedFile(null);
                setMeetingTitle('');
                document.getElementById('meeting-upload').value = '';
                loadMeetings();
            }
        } catch (error) {
            setError('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: theme.colors.background,
            fontFamily: theme.typography.fontFamily,
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: theme.spacing.xxl }}>
                {/* Header */}
                <div style={{ marginBottom: theme.spacing.xxxl }}>
                    <Link to="/dashboard" style={{
                        color: theme.colors.textSecondary,
                        textDecoration: 'none',
                        fontSize: theme.typography.small,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        display: 'inline-block',
                        marginBottom: theme.spacing.md
                    }}>
                        ← Dashboard
                    </Link>
                    <h1 style={{
                        fontSize: theme.typography.hero,
                        fontWeight: theme.typography.black,
                        lineHeight: '1',
                        marginBottom: theme.spacing.md,
                        letterSpacing: '-0.02em'
                    }}>
                        MEETINGS
                    </h1>
                    <p style={{
                        fontSize: theme.typography.h5,
                        color: theme.colors.textSecondary,
                        maxWidth: '600px'
                    }}>
                        Upload transcripts and extract insights with AI.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        background: theme.colors.accent,
                        color: theme.colors.surface,
                        padding: theme.spacing.md,
                        marginBottom: theme.spacing.lg,
                        fontSize: theme.typography.body
                    }}>
                        {error}
                    </div>
                )}

                {/* Upload Section */}
                <div style={{
                    background: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    padding: theme.spacing.xl,
                    marginBottom: theme.spacing.xxxl
                }}>
                    <h2 style={{
                        fontSize: theme.typography.h3,
                        fontWeight: theme.typography.bold,
                        marginBottom: theme.spacing.lg
                    }}>
                        Upload Transcript
                    </h2>

                    <input
                        type="text"
                        value={meetingTitle}
                        onChange={(e) => setMeetingTitle(e.target.value)}
                        placeholder="Meeting title"
                        style={{
                            width: '100%',
                            padding: theme.spacing.md,
                            border: `1px solid ${theme.colors.border}`,
                            fontSize: theme.typography.body,
                            marginBottom: theme.spacing.md,
                            fontFamily: theme.typography.fontFamily,
                            outline: 'none'
                        }}
                    />

                    <input
                        type="file"
                        accept=".txt"
                        onChange={handleFileSelect}
                        id="meeting-upload"
                        style={{ display: 'none' }}
                    />

                    <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                        <label
                            htmlFor="meeting-upload"
                            style={{
                                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                                border: `1px solid ${theme.colors.border}`,
                                cursor: 'pointer',
                                fontSize: theme.typography.body,
                                transition: theme.transitions.normal,
                                background: theme.colors.surface
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.textPrimary}
                            onMouseLeave={(e) => e.currentTarget.style.background = theme.colors.surface}
                        >
                            {selectedFile ? selectedFile.name : 'Choose File'}
                        </label>

                        {selectedFile && (
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                style={{
                                    padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                                    background: uploading ? theme.colors.textSecondary : theme.colors.accent,
                                    color: theme.colors.surface,
                                    border: 'none',
                                    fontSize: theme.typography.body,
                                    fontWeight: theme.typography.bold,
                                    cursor: uploading ? 'not-allowed' : 'pointer',
                                    fontFamily: theme.typography.fontFamily
                                }}
                            >
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Uploaded Meeting Details */}
                {uploadedMeeting && (
                    <div style={{
                        background: theme.colors.surface,
                        border: `2px solid ${theme.colors.textPrimary}`,
                        padding: theme.spacing.xl,
                        marginBottom: theme.spacing.xxxl
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing.lg }}>
                            <h2 style={{
                                fontSize: theme.typography.h3,
                                fontWeight: theme.typography.bold
                            }}>
                                {uploadedMeeting.title}
                            </h2>
                            <button
                                onClick={() => setUploadedMeeting(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: theme.typography.h4,
                                    cursor: 'pointer'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {uploadedMeeting.summary && (
                            <div style={{ marginBottom: theme.spacing.lg }}>
                                <h3 style={{
                                    fontSize: theme.typography.h5,
                                    fontWeight: theme.typography.bold,
                                    marginBottom: theme.spacing.sm
                                }}>
                                    Summary
                                </h3>
                                <p style={{
                                    fontSize: theme.typography.body,
                                    lineHeight: '1.6',
                                    color: theme.colors.textSecondary
                                }}>
                                    {uploadedMeeting.summary}
                                </p>
                            </div>
                        )}

                        {uploadedMeeting.key_points && uploadedMeeting.key_points.length > 0 && (
                            <div style={{ marginBottom: theme.spacing.lg }}>
                                <h3 style={{
                                    fontSize: theme.typography.h5,
                                    fontWeight: theme.typography.bold,
                                    marginBottom: theme.spacing.sm
                                }}>
                                    Key Points
                                </h3>
                                <ul style={{ paddingLeft: theme.spacing.md }}>
                                    {uploadedMeeting.key_points.map((point, idx) => (
                                        <li key={idx} style={{
                                            fontSize: theme.typography.body,
                                            marginBottom: theme.spacing.xs,
                                            color: theme.colors.textSecondary
                                        }}>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {uploadedMeeting.action_items && uploadedMeeting.action_items.length > 0 && (
                            <div>
                                <h3 style={{
                                    fontSize: theme.typography.h5,
                                    fontWeight: theme.typography.bold,
                                    marginBottom: theme.spacing.sm
                                }}>
                                    Action Items
                                </h3>
                                <ul style={{ paddingLeft: theme.spacing.md }}>
                                    {uploadedMeeting.action_items.map((item, idx) => (
                                        <li key={idx} style={{
                                            fontSize: theme.typography.body,
                                            marginBottom: theme.spacing.xs,
                                            color: theme.colors.textSecondary
                                        }}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Meetings List */}
                <div>
                    <h2 style={{
                        fontSize: theme.typography.h3,
                        fontWeight: theme.typography.black,
                        marginBottom: theme.spacing.lg
                    }}>
                        All Meetings ({meetings.length})
                    </h2>

                    {meetings.length === 0 ? (
                        <div style={{
                            background: theme.colors.surface,
                            border: `1px solid ${theme.colors.border}`,
                            padding: theme.spacing.xxl,
                            textAlign: 'center'
                        }}>
                            <p style={{
                                fontSize: theme.typography.h5,
                                color: theme.colors.textSecondary
                            }}>
                                No meetings yet
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: theme.spacing.sm }}>
                            {meetings.map((meeting) => (
                                <div
                                    key={meeting.id}
                                    style={{
                                        background: theme.colors.surface,
                                        border: `1px solid ${theme.colors.border}`,
                                        padding: theme.spacing.lg,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div>
                                        <h3 style={{
                                            fontSize: theme.typography.h5,
                                            fontWeight: theme.typography.bold,
                                            marginBottom: theme.spacing.xs
                                        }}>
                                            {meeting.title}
                                        </h3>
                                        <p style={{
                                            fontSize: theme.typography.small,
                                            color: theme.colors.textSecondary,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            {meeting.processed === 2 ? 'Processed' : 'Pending'}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: theme.spacing.xs }}>
                                        {meeting.processed !== 2 && (
                                            <button
                                                onClick={async () => {
                                                    setProcessingId(meeting.id);
                                                    try {
                                                        const response = await fetch(`http://localhost:8000/api/v1/meetings/${meeting.id}/process`, {
                                                            method: 'POST'
                                                        });
                                                        const data = await response.json();
                                                        setUploadedMeeting(data);
                                                        loadMeetings();
                                                    } catch (error) {
                                                        setError('Processing failed');
                                                    } finally {
                                                        setProcessingId(null);
                                                    }
                                                }}
                                                disabled={processingId === meeting.id}
                                                style={{
                                                    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                                                    background: processingId === meeting.id ? theme.colors.textSecondary : theme.colors.accent,
                                                    color: theme.colors.surface,
                                                    border: 'none',
                                                    fontSize: theme.typography.small,
                                                    fontWeight: theme.typography.bold,
                                                    cursor: processingId === meeting.id ? 'not-allowed' : 'pointer',
                                                    fontFamily: theme.typography.fontFamily
                                                }}
                                            >
                                                {processingId === meeting.id ? 'Processing...' : 'Process'}
                                            </button>
                                        )}
                                        <button
                                            onClick={async () => {
                                                const response = await fetch(`http://localhost:8000/api/v1/meetings/${meeting.id}`);
                                                const data = await response.json();
                                                if (data.summary || (data.key_points && data.key_points.length > 0)) {
                                                    setUploadedMeeting(data);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                } else {
                                                    setError('Process this meeting first');
                                                    setTimeout(() => setError(''), 3000);
                                                }
                                            }}
                                            style={{
                                                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                                                background: theme.colors.surface,
                                                border: `1px solid ${theme.colors.border}`,
                                                fontSize: theme.typography.small,
                                                fontWeight: theme.typography.bold,
                                                cursor: 'pointer',
                                                fontFamily: theme.typography.fontFamily,
                                                transition: theme.transitions.normal
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = theme.colors.textPrimary;
                                                e.currentTarget.style.color = theme.colors.surface;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = theme.colors.surface;
                                                e.currentTarget.style.color = theme.colors.textPrimary;
                                            }}
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Meetings;
