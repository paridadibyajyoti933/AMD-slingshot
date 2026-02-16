import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Zap, Shield, Sparkles } from 'lucide-react';

const Landing = () => {
    const features = [
        {
            icon: Brain,
            title: 'Research Copilot',
            description: 'Upload PDFs and get instant summaries, citations, and literature reviews powered by local AI.',
        },
        {
            icon: Zap,
            title: 'Smart Scheduling',
            description: 'AI-driven weekly planner that optimizes your deep work blocks based on deadlines and priorities.',
        },
        {
            icon: Sparkles,
            title: 'Meeting Intelligence',
            description: 'Transform transcripts into actionable summaries with key points, decisions, and action items.',
        },
        {
            icon: Shield,
            title: 'Knowledge Hub',
            description: 'Semantic search across all your research, notes, and meetings with vector-powered retrieval.',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
            {/* Hero Section */}
            <div className="container mx-auto px-6 py-20">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="inline-block mb-6">
                        <span className="px-4 py-2 bg-primary-600/20 border border-primary-600/30 rounded-full text-primary-400 text-sm font-medium">
                            🚀 Local-First AI Productivity
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                        Your AI-Powered
                        <br />
                        <span className="gradient-text">Productivity OS</span>
                    </h1>

                    <p className="text-xl text-dark-300 mb-10 max-w-2xl mx-auto">
                        DeepWork OS integrates research summarization, smart scheduling, meeting transcription,
                        and knowledge capture into a unified AI-driven dashboard.
                    </p>

                    <div className="flex items-center justify-center space-x-4">
                        <Link to="/dashboard" className="btn-primary flex items-center space-x-2">
                            <span>Get Started</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>

                        <a href="#features" className="btn-secondary">
                            Learn More
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
                        <div className="glass-effect rounded-xl p-6">
                            <div className="text-3xl font-bold text-primary-400">100%</div>
                            <div className="text-sm text-dark-400 mt-1">Local AI</div>
                        </div>
                        <div className="glass-effect rounded-xl p-6">
                            <div className="text-3xl font-bold text-primary-400">4</div>
                            <div className="text-sm text-dark-400 mt-1">Core Features</div>
                        </div>
                        <div className="glass-effect rounded-xl p-6">
                            <div className="text-3xl font-bold text-primary-400">∞</div>
                            <div className="text-sm text-dark-400 mt-1">Possibilities</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="container mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
                    <p className="text-dark-400 text-lg">Everything you need for deep, focused work</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={idx}
                                className="glass-effect rounded-2xl p-8 hover:border-primary-600/50 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Icon className="w-7 h-7 text-white" />
                                </div>

                                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary-400 transition-colors">
                                    {feature.title}
                                </h3>

                                <p className="text-dark-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-6 py-20">
                <div className="glass-effect rounded-3xl p-12 text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Workflow?</h2>
                    <p className="text-dark-400 text-lg mb-8">
                        Start using DeepWork OS today and experience AI-powered productivity.
                    </p>

                    <Link to="/dashboard" className="btn-primary inline-flex items-center space-x-2">
                        <span>Launch Dashboard</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-dark-700">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-between text-sm text-dark-500">
                        <div>© 2024 DeepWork OS. Built with ❤️ for productivity.</div>
                        <div>Powered by Local AI</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
