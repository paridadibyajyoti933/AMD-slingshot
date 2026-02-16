import React from 'react';
import { Settings as SettingsIcon, Database, Cpu, Zap } from 'lucide-react';

const Settings = () => {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Settings</h1>
                <p className="text-dark-400">Configure your DeepWork OS</p>
            </div>

            <div className="space-y-6">
                {/* AI Configuration */}
                <div className="card">
                    <div className="flex items-center space-x-3 mb-4">
                        <Cpu className="w-6 h-6 text-primary-400" />
                        <h2 className="text-xl font-bold">AI Configuration</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Ollama Base URL</label>
                            <input
                                type="text"
                                defaultValue="http://localhost:11434"
                                className="input-field"
                                placeholder="http://localhost:11434"
                            />
                            <p className="text-xs text-dark-500 mt-1">URL of your local Ollama instance</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">LLM Model</label>
                            <select className="input-field">
                                <option>mistral</option>
                                <option>llama2</option>
                                <option>codellama</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Embedding Model</label>
                            <input
                                type="text"
                                defaultValue="sentence-transformers/all-MiniLM-L6-v2"
                                className="input-field"
                                disabled
                            />
                        </div>
                    </div>
                </div>

                {/* Database Configuration */}
                <div className="card">
                    <div className="flex items-center space-x-3 mb-4">
                        <Database className="w-6 h-6 text-primary-400" />
                        <h2 className="text-xl font-bold">Database</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">PostgreSQL URL</label>
                            <input
                                type="text"
                                defaultValue="postgresql://localhost:5432/deepwork_db"
                                className="input-field"
                            />
                        </div>

                        <div className="bg-dark-700/50 rounded-lg p-4">
                            <p className="text-sm text-dark-400">Vector Store Status</p>
                            <p className="text-lg font-bold text-green-400 mt-1">✓ Connected</p>
                        </div>
                    </div>
                </div>

                {/* Performance */}
                <div className="card">
                    <div className="flex items-center space-x-3 mb-4">
                        <Zap className="w-6 h-6 text-primary-400" />
                        <h2 className="text-xl font-bold">Performance</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Chunk Size</label>
                            <input
                                type="number"
                                defaultValue="500"
                                className="input-field"
                            />
                            <p className="text-xs text-dark-500 mt-1">Characters per text chunk for embeddings</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Max Tokens</label>
                            <input
                                type="number"
                                defaultValue="2048"
                                className="input-field"
                            />
                        </div>
                    </div>
                </div>

                <button className="btn-primary w-full">Save Settings</button>
            </div>
        </div>
    );
};

export default Settings;
