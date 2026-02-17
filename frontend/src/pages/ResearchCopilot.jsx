import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import theme from '../styles/theme';

const ResearchCopilot = () => {
    const [papers, setPapers] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://localhost:8000/api/v1/research/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setSelectedFile(null);
                document.getElementById('pdf-upload').value = '';
                loadPapers();
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    const loadPapers = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/research/');
            const data = await response.json();
            setPapers(data);
        } catch (error) {
            console.error('Failed to load papers:', error);
        }
    };

    React.useEffect(() => {
        loadPapers();
    }, []);

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
                        RESEARCH
                    </h1>
                    <p style={{
                        fontSize: theme.typography.h5,
                        color: theme.colors.textSecondary,
                        maxWidth: '600px'
                    }}>
                        Upload research papers and get AI-powered summaries.
                    </p>
                </div>

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
                        Upload Paper
                    </h2>

                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        id="pdf-upload"
                        style={{ display: 'none' }}
                    />

                    <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                        <label
                            htmlFor="pdf-upload"
                            style={{
                                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                                border: `1px solid ${theme.colors.border}`,
                                cursor: 'pointer',
                                fontSize: theme.typography.body,
                                transition: theme.transitions.normal,
                                background: theme.colors.surface
                            }}
                        >
                            {selectedFile ? selectedFile.name : 'Choose PDF'}
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

                {/* Papers List */}
                <div>
                    <h2 style={{
                        fontSize: theme.typography.h3,
                        fontWeight: theme.typography.black,
                        marginBottom: theme.spacing.lg
                    }}>
                        Papers ({papers.length})
                    </h2>

                    {papers.length === 0 ? (
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
                                No papers yet
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: theme.spacing.sm }}>
                            {papers.map((paper) => (
                                <div
                                    key={paper.id}
                                    style={{
                                        background: theme.colors.surface,
                                        border: `1px solid ${theme.colors.border}`,
                                        padding: theme.spacing.lg,
                                    }}
                                >
                                    <h3 style={{
                                        fontSize: theme.typography.h5,
                                        fontWeight: theme.typography.bold,
                                        marginBottom: theme.spacing.xs
                                    }}>
                                        {paper.title}
                                    </h3>
                                    <p style={{
                                        fontSize: theme.typography.small,
                                        color: theme.colors.textSecondary
                                    }}>
                                        {new Date(paper.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResearchCopilot;
