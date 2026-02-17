import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import theme from '../styles/theme';

const Dashboard = () => {
    const [stats, setStats] = useState({
        tasks: 0,
        papers: 0,
        meetings: 0,
        notes: 0
    });

    useEffect(() => {
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

    const quickActions = [
        {
            title: 'Upload Research',
            desc: 'AI-powered summaries',
            link: '/research',
        },
        {
            title: 'Create Task',
            desc: 'Plan your week',
            link: '/planner',
        },
        {
            title: 'Add Meeting',
            desc: 'Extract insights',
            link: '/meetings',
        },
        {
            title: 'Search Knowledge',
            desc: 'Find anything',
            link: '/knowledge',
        },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: theme.colors.background,
            color: theme.colors.textPrimary,
            fontFamily: theme.typography.fontFamily,
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: theme.spacing.xxl }}>
                {/* Hero Section */}
                <div style={{ marginBottom: theme.spacing.xxxl }}>
                    <h1 style={{
                        fontSize: theme.typography.hero,
                        fontWeight: theme.typography.black,
                        lineHeight: '1',
                        marginBottom: theme.spacing.md,
                        letterSpacing: '-0.02em'
                    }}>
                        DEEP
                        <br />
                        WORK
                    </h1>
                    <p style={{
                        fontSize: theme.typography.h4,
                        color: theme.colors.textSecondary,
                        fontWeight: theme.typography.regular,
                        maxWidth: '600px'
                    }}>
                        AI-powered productivity for focused work and deep thinking.
                    </p>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: theme.spacing.sm,
                    marginBottom: theme.spacing.xxxl
                }}>
                    {[
                        { label: 'Tasks', value: stats.tasks },
                        { label: 'Papers', value: stats.papers },
                        { label: 'Meetings', value: stats.meetings },
                        { label: 'Notes', value: stats.notes }
                    ].map((stat, idx) => (
                        <div key={idx} style={{
                            background: theme.colors.surface,
                            padding: theme.spacing.lg,
                            border: `1px solid ${theme.colors.border}`,
                            transition: theme.transitions.normal,
                        }}>
                            <p style={{
                                fontSize: theme.typography.small,
                                color: theme.colors.textSecondary,
                                marginBottom: theme.spacing.xs,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                {stat.label}
                            </p>
                            <p style={{
                                fontSize: theme.typography.h2,
                                fontWeight: theme.typography.black,
                                color: theme.colors.textPrimary
                            }}>
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 style={{
                        fontSize: theme.typography.h3,
                        fontWeight: theme.typography.black,
                        marginBottom: theme.spacing.lg,
                        letterSpacing: '-0.01em'
                    }}>
                        Quick Actions
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: theme.spacing.sm
                    }}>
                        {quickActions.map((action, idx) => (
                            <Link
                                key={idx}
                                to={action.link}
                                style={{
                                    background: theme.colors.surface,
                                    padding: theme.spacing.xl,
                                    border: `1px solid ${theme.colors.border}`,
                                    textDecoration: 'none',
                                    color: theme.colors.textPrimary,
                                    transition: theme.transitions.normal,
                                    display: 'block'
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
                                <h3 style={{
                                    fontSize: theme.typography.h4,
                                    fontWeight: theme.typography.bold,
                                    marginBottom: theme.spacing.xs
                                }}>
                                    {action.title}
                                </h3>
                                <p style={{
                                    fontSize: theme.typography.body,
                                    opacity: 0.6
                                }}>
                                    {action.desc}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
