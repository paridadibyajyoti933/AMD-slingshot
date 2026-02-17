import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import theme from '../styles/theme';

const KnowledgeHub = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setSearching(true);
        try {
            const response = await fetch('http://localhost:8000/api/v1/knowledge/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, limit: 10 })
            });

            if (response.ok) {
                const data = await response.json();
                setResults(data.results || []);
            }
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setSearching(false);
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
                        KNOWLEDGE
                    </h1>
                    <p style={{
                        fontSize: theme.typography.h5,
                        color: theme.colors.textSecondary,
                        maxWidth: '600px'
                    }}>
                        Search across all your meetings, papers, and notes.
                    </p>
                </div>

                {/* Search Section */}
                <form onSubmit={handleSearch} style={{
                    background: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    padding: theme.spacing.xl,
                    marginBottom: theme.spacing.xxxl
                }}>
                    <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search your knowledge base..."
                            style={{
                                flex: 1,
                                padding: theme.spacing.md,
                                border: `1px solid ${theme.colors.border}`,
                                fontSize: theme.typography.body,
                                fontFamily: theme.typography.fontFamily,
                                outline: 'none'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={searching}
                            style={{
                                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                                background: searching ? theme.colors.textSecondary : theme.colors.accent,
                                color: theme.colors.surface,
                                border: 'none',
                                fontSize: theme.typography.body,
                                fontWeight: theme.typography.bold,
                                cursor: searching ? 'not-allowed' : 'pointer',
                                fontFamily: theme.typography.fontFamily
                            }}
                        >
                            {searching ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>

                {/* Results */}
                {results.length > 0 && (
                    <div>
                        <h2 style={{
                            fontSize: theme.typography.h3,
                            fontWeight: theme.typography.black,
                            marginBottom: theme.spacing.lg
                        }}>
                            Results ({results.length})
                        </h2>

                        <div style={{ display: 'grid', gap: theme.spacing.sm }}>
                            {results.map((result, idx) => (
                                <div
                                    key={idx}
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
                                        {result.title || 'Untitled'}
                                    </h3>
                                    <p style={{
                                        fontSize: theme.typography.body,
                                        color: theme.colors.textSecondary,
                                        marginBottom: theme.spacing.xs
                                    }}>
                                        {result.content}
                                    </p>
                                    <p style={{
                                        fontSize: theme.typography.small,
                                        color: theme.colors.textTertiary,
                                        textTransform: 'uppercase'
                                    }}>
                                        {result.source_type}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {results.length === 0 && query && !searching && (
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
                            No results found
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KnowledgeHub;
