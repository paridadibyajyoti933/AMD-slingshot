import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { knowledgeAPI } from '../services/api';

const KnowledgeHub = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [stats, setStats] = useState(null);

    React.useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await knowledgeAPI.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setSearching(true);
        try {
            const data = await knowledgeAPI.search(query, 10);
            setResults(data.results || []);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setSearching(false);
        }
    };

    const getSourceIcon = (type) => {
        const icons = {
            research_paper: '📄',
            meeting: '💬',
            note: '📝',
            summary: '✨'
        };
        return icons[type] || '📌';
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Knowledge Hub</h1>
                <p className="text-dark-400">Semantic search across all your content</p>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="card text-center">
                        <p className="text-2xl font-bold">{stats.research_papers}</p>
                        <p className="text-sm text-dark-400 mt-1">Papers</p>
                    </div>
                    <div className="card text-center">
                        <p className="text-2xl font-bold">{stats.meetings}</p>
                        <p className="text-sm text-dark-400 mt-1">Meetings</p>
                    </div>
                    <div className="card text-center">
                        <p className="text-2xl font-bold">{stats.notes}</p>
                        <p className="text-sm text-dark-400 mt-1">Notes</p>
                    </div>
                    <div className="card text-center">
                        <p className="text-2xl font-bold">{stats.vector_store?.total_vectors || 0}</p>
                        <p className="text-sm text-dark-400 mt-1">Vectors</p>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="card mb-8">
                <div className="flex items-center space-x-3">
                    <Search className="w-5 h-5 text-dark-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search your knowledge base..."
                        className="flex-1 bg-transparent border-none outline-none text-dark-100 placeholder-dark-400"
                    />
                    <button
                        type="submit"
                        disabled={searching}
                        className="btn-primary flex items-center space-x-2"
                    >
                        {searching ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Searching...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                <span>Search</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Results */}
            {results.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Results ({results.length})</h2>
                    {results.map((result, idx) => (
                        <div key={idx} className="card hover:border-primary-600/50 transition-colors">
                            <div className="flex items-start space-x-4">
                                <div className="text-3xl">{getSourceIcon(result.source_type)}</div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <span className="text-xs text-dark-500 uppercase">{result.source_type.replace('_', ' ')}</span>
                                            {result.source_info?.title && (
                                                <h3 className="font-bold text-lg mt-1">{result.source_info.title}</h3>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-primary-400">
                                                {(result.similarity_score * 100).toFixed(1)}% match
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-dark-300 leading-relaxed mb-3">
                                        {result.content}
                                    </p>

                                    {result.source_info && (
                                        <div className="flex items-center space-x-4 text-xs text-dark-500">
                                            {result.source_info.authors && (
                                                <span>Authors: {result.source_info.authors.slice(0, 2).join(', ')}</span>
                                            )}
                                            {result.source_info.participants && (
                                                <span>Participants: {result.source_info.participants.slice(0, 2).join(', ')}</span>
                                            )}
                                            {result.source_info.created_at && (
                                                <span>{new Date(result.source_info.created_at).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {results.length === 0 && query && !searching && (
                <div className="card text-center py-12">
                    <p className="text-dark-400">No results found for "{query}"</p>
                </div>
            )}

            {!query && (
                <div className="card text-center py-20">
                    <Sparkles className="w-16 h-16 mx-auto text-dark-600 mb-4" />
                    <p className="text-dark-400">Enter a search query to find relevant content</p>
                    <p className="text-dark-500 text-sm mt-2">Powered by semantic vector search</p>
                </div>
            )}
        </div>
    );
};

export default KnowledgeHub;
