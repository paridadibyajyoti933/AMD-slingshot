import React from 'react';
import { Link } from 'react-router-dom';
import theme from '../styles/theme';

const SimpleLanding = () => {
    return (
        <div style={{
            minHeight: '100vh',
            background: theme.colors.background,
            fontFamily: theme.typography.fontFamily,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{ maxWidth: '1200px', padding: theme.spacing.xxl, textAlign: 'center' }}>
                {/* Hero */}
                <h1 style={{
                    fontSize: theme.typography.hero,
                    fontWeight: theme.typography.black,
                    lineHeight: '0.9',
                    marginBottom: theme.spacing.xl,
                    letterSpacing: '-0.02em'
                }}>
                    DEEP
                    <br />
                    WORK
                    <br />
                    OS
                </h1>

                <p style={{
                    fontSize: theme.typography.h4,
                    color: theme.colors.textSecondary,
                    marginBottom: theme.spacing.xxxl,
                    maxWidth: '700px',
                    margin: `0 auto ${theme.spacing.xxxl}`
                }}>
                    AI-powered productivity platform for focused work and deep thinking.
                </p>

                {/* CTA */}
                <Link
                    to="/dashboard"
                    style={{
                        display: 'inline-block',
                        padding: `${theme.spacing.lg} ${theme.spacing.xxl}`,
                        background: theme.colors.accent,
                        color: theme.colors.surface,
                        textDecoration: 'none',
                        fontSize: theme.typography.h5,
                        fontWeight: theme.typography.bold,
                        transition: theme.transitions.normal
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.accentHover}
                    onMouseLeave={(e) => e.currentTarget.style.background = theme.colors.accent}
                >
                    Get Started
                </Link>

                {/* Features */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: theme.spacing.sm,
                    marginTop: theme.spacing.xxxl
                }}>
                    {[
                        { title: 'Planner', desc: 'AI task scheduling' },
                        { title: 'Meetings', desc: 'Auto summaries' },
                        { title: 'Research', desc: 'Paper analysis' },
                        { title: 'Knowledge', desc: 'Smart search' }
                    ].map((feature, idx) => (
                        <div
                            key={idx}
                            style={{
                                background: theme.colors.surface,
                                border: `1px solid ${theme.colors.border}`,
                                padding: theme.spacing.lg,
                                textAlign: 'left'
                            }}
                        >
                            <h3 style={{
                                fontSize: theme.typography.h5,
                                fontWeight: theme.typography.bold,
                                marginBottom: theme.spacing.xs
                            }}>
                                {feature.title}
                            </h3>
                            <p style={{
                                fontSize: theme.typography.body,
                                color: theme.colors.textSecondary
                            }}>
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SimpleLanding;
