import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    Calendar,
    MessageSquare,
    Search,
    Settings,
    Brain
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/research', icon: BookOpen, label: 'Research Copilot' },
        { path: '/planner', icon: Calendar, label: 'Weekly Planner' },
        { path: '/meetings', icon: MessageSquare, label: 'Meetings' },
        { path: '/knowledge', icon: Search, label: 'Knowledge Hub' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="w-64 h-screen bg-dark-800 border-r border-dark-700 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-dark-700">
                <Link to="/" className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold gradient-text">DeepWork OS</h1>
                        <p className="text-xs text-dark-400">AI Productivity</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                                    : 'text-dark-300 hover:bg-dark-700 hover:text-white'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-dark-700">
                <div className="glass-effect rounded-lg p-3">
                    <p className="text-xs text-dark-400">Version 1.0.0</p>
                    <p className="text-xs text-dark-500 mt-1">Local AI Powered</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
